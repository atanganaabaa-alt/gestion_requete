import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canReadRequest, canTreatRequest } from "@/lib/access";
import { Badge } from "@/components/ui/badge";
import { AssignForm, TransitionForm } from "@/components/requests/agent-treat-form";
import { CommentForm } from "@/components/requests/comment-form";
import { nextActions, STATUS_LABELS } from "@/lib/workflow";

export default async function AgentRequetePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (!canTreatRequest(session.user.role)) redirect("/espace");

  const { id } = await params;
  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      category: true,
      service: true,
      demandeur: { select: { id: true, nom: true, email: true } },
      agent: { select: { id: true, nom: true } },
      attachments: true,
      history: {
        orderBy: { createdAt: "asc" },
        include: { actor: { select: { nom: true } } },
      },
      comments: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { nom: true } } },
      },
    },
  });

  if (!request) notFound();

  const allowed = canReadRequest({
    role: session.user.role,
    userId: session.user.id,
    serviceId: session.user.serviceId,
    demandeurId: request.demandeurId,
    requestServiceId: request.serviceId,
  });
  if (!allowed) notFound();

  const actions = nextActions(request.status, session.user.role, false).filter(
    (status) => status !== "ANNULEE"
  );
  const canAssign =
    !request.agentId ||
    request.agentId === session.user.id ||
    session.user.role === "RESPONSABLE" ||
    session.user.role === "ADMIN";
  const showAssign =
    canAssign && (request.status === "SOUMISE" || request.status === "AFFECTEE");

  return (
    <div className="space-y-6">
      <p className="text-sm">
        <Link href="/agent/file" className="text-navy underline">
          ← Retour à la file
        </Link>
      </p>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge value={request.status} label={STATUS_LABELS[request.status]} />
          <span className="font-mono text-sm text-muted">{request.numero}</span>
        </div>
        <h1 className="font-display text-3xl">{request.objet}</h1>
        <p className="mt-1 text-sm text-muted">
          {request.category.name} · {request.service.name} · {request.demandeur.nom} (
          {request.demandeur.email})
        </p>
        <p className="mt-1 text-sm text-muted">
          Agent : {request.agent?.nom ?? "non affecté"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-line bg-card p-5">
          <h2 className="font-medium">Traitement</h2>
          {showAssign && <AssignForm requestId={request.id} />}
          <TransitionForm requestId={request.id} actions={actions} />
        </section>

        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="font-medium">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
            {request.description}
          </p>
          {request.reponseFinale && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <strong>Réponse finale :</strong> {request.reponseFinale}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="font-medium">Pièces jointes</h2>
        {request.attachments.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucune pièce.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {request.attachments.map((piece) => (
              <li key={piece.id}>
                <a className="text-navy underline" href={`/api/pieces/${piece.id}`}>
                  {piece.filename}
                </a>
                <span className="text-muted"> · {Math.round(piece.sizeBytes / 1024)} Ko</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 font-medium">Commentaires</h2>
        <ul className="mb-4 space-y-3">
          {request.comments.map((c) => (
            <li key={c.id} className="rounded-md border border-line bg-paper px-3 py-2 text-sm">
              <div className="text-xs text-muted">
                {c.author.nom} ·{" "}
                {c.createdAt.toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
          {request.comments.length === 0 && (
            <li className="text-sm text-muted">Aucun commentaire pour l’instant.</li>
          )}
        </ul>
        <CommentForm requestId={request.id} />
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 font-medium">Historique</h2>
        <ol className="space-y-4 border-l-2 border-gold/50 pl-4">
          {request.history.map((h) => (
            <li key={h.id}>
              <div className="text-sm font-medium">{STATUS_LABELS[h.toStatus]}</div>
              <div className="text-xs text-muted">
                {h.actor.nom} ·{" "}
                {h.createdAt.toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              {h.note && <p className="mt-1 text-sm">{h.note}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
