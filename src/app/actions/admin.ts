"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ADMIN") redirect("/espace");
  return session.user;
}

const ROLES: Role[] = ["DEMANDEUR", "AGENT", "RESPONSABLE", "ADMIN"];

export async function createUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleRaw = String(formData.get("role") ?? "DEMANDEUR");
  const serviceId = String(formData.get("serviceId") ?? "");
  const role = ROLES.includes(roleRaw as Role) ? (roleRaw as Role) : "DEMANDEUR";

  if (nom.length < 2 || !email.includes("@") || password.length < 8) {
    redirect("/admin/utilisateurs?erreur=champs");
  }
  if ((role === "AGENT" || role === "RESPONSABLE") && !serviceId) {
    redirect("/admin/utilisateurs?erreur=service");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect("/admin/utilisateurs?erreur=existe");

  const user = await prisma.user.create({
    data: {
      nom,
      email,
      role,
      passwordHash: await hash(password, 10),
      serviceId: serviceId || null,
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "USER_CREATE",
      entity: "User",
      entityId: user.id,
      meta: `${email} ${role}`,
    },
  });
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?ok=1");
}

export async function toggleUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.id === admin.id) redirect("/admin/utilisateurs");
  await prisma.user.update({ where: { id }, data: { active: !user.active } });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: user.active ? "USER_DISABLE" : "USER_ENABLE",
      entity: "User",
      entityId: id,
    },
  });
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function createServiceAction(formData: FormData) {
  const admin = await requireAdmin();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!code || !name) redirect("/admin/services?erreur=champs");
  const exists = await prisma.service.findUnique({ where: { code } });
  if (exists) redirect("/admin/services?erreur=existe");
  const service = await prisma.service.create({
    data: { code, name, description: description || null },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SERVICE_CREATE",
      entity: "Service",
      entityId: service.id,
      meta: code,
    },
  });
  revalidatePath("/admin/services");
  redirect("/admin/services?ok=1");
}

export async function toggleServiceAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) redirect("/admin/services");
  await prisma.service.update({ where: { id }, data: { active: !service.active } });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: service.active ? "SERVICE_DISABLE" : "SERVICE_ENABLE",
      entity: "Service",
      entityId: id,
    },
  });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function createCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!code || !name || !serviceId) redirect("/admin/categories?erreur=champs");
  const exists = await prisma.category.findUnique({ where: { code } });
  if (exists) redirect("/admin/categories?erreur=existe");
  const category = await prisma.category.create({
    data: { code, name, serviceId },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CATEGORY_CREATE",
      entity: "Category",
      entityId: category.id,
      meta: code,
    },
  });
  revalidatePath("/admin/categories");
  redirect("/admin/categories?ok=1");
}

export async function toggleCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) redirect("/admin/categories");
  await prisma.category.update({ where: { id }, data: { active: !category.active } });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: category.active ? "CATEGORY_DISABLE" : "CATEGORY_ENABLE",
      entity: "Category",
      entityId: id,
    },
  });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
