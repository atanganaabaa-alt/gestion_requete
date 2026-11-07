"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { Priority } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatNumero } from "@/lib/numero";
import { validateUploads } from "@/lib/files";

export type RequestFormState = { message?: string };

const PRIORITIES: Priority[] = ["BASSE", "NORMALE", "HAUTE", "URGENTE"];

function isFile(value: FormDataEntryValue): value is File {
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "name" in value;
}

export async function createRequestAction(
  _prev: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "DEMANDEUR" && session.user.role !== "ADMIN") {
    return { message: "Seuls les demandeurs peuvent déposer une requête." };
  }

  const categoryId = String(formData.get("categoryId") ?? "");
  const objet = String(formData.get("objet") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "NORMALE");
  const priority = PRIORITIES.includes(priorityRaw as Priority)
    ? (priorityRaw as Priority)
    : "NORMALE";

  if (!categoryId || !objet || !description) {
    return { message: "La catégorie, l’objet et la description sont obligatoires." };
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || !category.active) {
    return { message: "Cette catégorie n’est pas disponible." };
  }

  const files = formData.getAll("pieces").filter(isFile).filter((file) => file.size > 0);
  const invalid = validateUploads(
    files.map((file) => ({ name: file.name, type: file.type, size: file.size }))
  );
  if (invalid) return { message: invalid };

  const year = new Date().getFullYear();
  const existing = await prisma.request.count({
    where: { numero: { startsWith: `REQ-${year}-` } },
  });
  const numero = formatNumero(year, existing);

  const stored: Array<{ filename: string; storedName: string; mimeType: string; sizeBytes: number }> = [];
  if (files.length > 0) {
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    for (const file of files) {
      const storedName = `${randomBytes(16).toString("hex")}${path.extname(file.name).toLowerCase()}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(dir, storedName), buffer);
      stored.push({
        filename: file.name.trim(),
        storedName,
        mimeType: file.type,
        sizeBytes: file.size,
      });
    }
  }

  const request = await prisma.request.create({
    data: {
      numero,
      objet,
      description,
      priority,
      status: "SOUMISE",
      demandeurId: session.user.id,
      categoryId: category.id,
      serviceId: category.serviceId,
      attachments: { create: stored },
      history: {
        create: {
          toStatus: "SOUMISE",
          actorId: session.user.id,
          note: "Création de la requête",
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "REQUEST_CREATE",
      entity: "Request",
      entityId: request.id,
      meta: numero,
    },
  });

  redirect(`/espace/requetes/${request.id}?cree=1`);
}
