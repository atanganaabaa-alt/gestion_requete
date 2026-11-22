"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RequestStatus, type Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canReadRequest, canTreatRequest } from "@/lib/access";
import { canTransition, STATUS_LABELS } from "@/lib/workflow";

export type AgentActionState = { message?: string; ok?: boolean };

type Actor = {
  id: string;
  role: Role;
  serviceId?: string | null;
};

async function requireAgent() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (!canTreatRequest(session.user.role)) {
    return { error: "Seuls les agents et responsables peuvent traiter une requête." as const };
  }
  return { user: session.user };
}

async function loadTreatable(id: string, user: Actor) {
  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) return { error: "Requête introuvable." as const };
  const allowed = canReadRequest({
    role: user.role,
    userId: user.id,
    serviceId: user.serviceId,
    demandeurId: request.demandeurId,
    requestServiceId: request.serviceId,
  });
  if (!allowed) return { error: "Cette requête n’est pas dans votre périmètre." as const };
  return { request };
}

export async function assignToMeAction(
  _prev: AgentActionState,
  formData: FormData
): Promise<AgentActionState> {
  const gate = await requireAgent();
  if ("error" in gate) return { message: gate.error };
  const { user } = gate;

  const id = String(formData.get("requestId") ?? "");
  const loaded = await loadTreatable(id, user);
  if ("error" in loaded) return { message: loaded.error };
  const { request } = loaded;

  if (request.status !== "SOUMISE" && request.status !== "AFFECTEE") {
    return { message: "Cette requête ne peut plus être prise en charge ainsi." };
  }
  if (request.agentId && request.agentId !== user.id && user.role === "AGENT") {
    return { message: "Cette requête est déjà affectée à un autre agent." };
  }

  const toStatus: RequestStatus = request.status === "SOUMISE" ? "AFFECTEE" : request.status;
  const check = canTransition({
    from: request.status,
    to: toStatus,
    role: user.role,
    isDemandeur: false,
  });
  if (request.status === "SOUMISE" && !check.ok) return { message: check.message };

  if (toStatus !== request.status) {
    await prisma.request.update({
      where: { id },
      data: {
        agentId: user.id,
        status: toStatus,
        history: {
          create: {
            fromStatus: request.status,
            toStatus,
            actorId: user.id,
            note: "Prise en charge",
          },
        },
      },
    });
  } else {
    await prisma.request.update({
      where: { id },
      data: { agentId: user.id },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "REQUEST_ASSIGN",
      entity: "Request",
      entityId: id,
      meta: user.id,
    },
  });

  revalidatePath(`/agent/requetes/${id}`);
  revalidatePath("/agent/file");
  revalidatePath("/agent");
  revalidatePath(`/espace/requetes/${id}`);
  return { ok: true, message: "Requête affectée à votre compte." };
}

export async function transitionRequestAction(
  _prev: AgentActionState,
  formData: FormData
): Promise<AgentActionState> {
  const gate = await requireAgent();
  if ("error" in gate) return { message: gate.error };
  const { user } = gate;

  const id = String(formData.get("requestId") ?? "");
  const toRaw = String(formData.get("toStatus") ?? "") as RequestStatus;
  const note = String(formData.get("note") ?? "").trim();
  const reponseFinale = String(formData.get("reponseFinale") ?? "").trim();

  const loaded = await loadTreatable(id, user);
  if ("error" in loaded) return { message: loaded.error };
  const { request } = loaded;

  const check = canTransition({
    from: request.status,
    to: toRaw,
    role: user.role,
    isDemandeur: false,
    note,
  });
  if (!check.ok) return { message: check.message };

  if (
    user.role === "AGENT" &&
    request.agentId &&
    request.agentId !== user.id &&
    toRaw !== "AFFECTEE"
  ) {
    return { message: "Seul l’agent affecté (ou un responsable) peut changer ce statut." };
  }

  const data: {
    status: RequestStatus;
    agentId?: string;
    reponseFinale?: string;
    closedAt?: Date | null;
  } = { status: toRaw };

  if (!request.agentId && (toRaw === "AFFECTEE" || toRaw === "EN_COURS")) {
    data.agentId = user.id;
  }
  if (toRaw === "RESOLUE" && reponseFinale) {
    data.reponseFinale = reponseFinale;
  }
  if (toRaw === "CLOTUREE") {
    data.closedAt = new Date();
  }

  await prisma.request.update({
    where: { id },
    data: {
      ...data,
      history: {
        create: {
          fromStatus: request.status,
          toStatus: toRaw,
          actorId: user.id,
          note: note || `Passage à ${STATUS_LABELS[toRaw]}`,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "REQUEST_STATUS",
      entity: "Request",
      entityId: id,
      meta: `${request.status}->${toRaw}`,
    },
  });

  revalidatePath(`/agent/requetes/${id}`);
  revalidatePath("/agent/file");
  revalidatePath("/agent");
  revalidatePath(`/espace/requetes/${id}`);
  revalidatePath("/espace/requetes");
  revalidatePath("/espace");
  return { ok: true, message: `Statut mis à jour : ${STATUS_LABELS[toRaw]}.` };
}

export async function addCommentAction(
  _prev: AgentActionState,
  formData: FormData
): Promise<AgentActionState> {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const id = String(formData.get("requestId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2) return { message: "Le commentaire est trop court." };

  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) return { message: "Requête introuvable." };

  const allowed = canReadRequest({
    role: session.user.role,
    userId: session.user.id,
    serviceId: session.user.serviceId,
    demandeurId: request.demandeurId,
    requestServiceId: request.serviceId,
  });
  if (!allowed) return { message: "Accès refusé." };

  if (["CLOTUREE", "ANNULEE"].includes(request.status)) {
    return { message: "Cette requête est fermée : plus de commentaires." };
  }

  await prisma.comment.create({
    data: {
      requestId: id,
      authorId: session.user.id,
      body,
      isInternal: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "COMMENT_CREATE",
      entity: "Request",
      entityId: id,
    },
  });

  revalidatePath(`/agent/requetes/${id}`);
  revalidatePath(`/espace/requetes/${id}`);
  return { ok: true, message: "Commentaire publié." };
}
