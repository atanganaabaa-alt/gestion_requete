"use server";

import { redirect } from "next/navigation";
import { Priority } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function nextNumero() {
  const year = new Date().getFullYear();
  const count = await prisma.request.count({
    where: { numero: { startsWith: `REQ-${year}-` } },
  });
  return `REQ-${year}-${String(count + 1).padStart(5, "0")}`;
}

export async function createRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const categoryId = String(formData.get("categoryId") ?? "");
  const objet = String(formData.get("objet") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "NORMALE") as Priority;

  if (!categoryId || !objet || !description) {
    throw new Error("Champs obligatoires manquants");
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error("Catégorie inconnue");

  const numero = await nextNumero();
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

  redirect(`/espace/requetes/${request.id}`);
}
