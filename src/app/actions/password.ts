"use server";

import { createHash, randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type ResetState = { message?: string; link?: string; ok?: boolean };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestResetAction(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const generic = {
    message:
      "Si un compte existe pour ce courriel, un lien de réinitialisation a été préparé. L’envoi SMTP arrivera au sprint 4 ; en local, le lien s’affiche ici.",
  };
  if (!email.includes("@")) return { message: "Indiquez un courriel valide." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return generic;

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt },
  });

  return {
    ...generic,
    link: `/mot-de-passe/reinitialiser?token=${token}`,
  };
}

export async function resetPasswordAction(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { message: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record || record.expiresAt < new Date()) {
    return { message: "Ce lien est invalide ou expiré." };
  }
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hash(password, 10) },
  });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
  await prisma.auditLog.create({
    data: {
      actorId: record.userId,
      action: "PASSWORD_RESET",
      entity: "User",
      entityId: record.userId,
    },
  });
  return { ok: true, message: "Mot de passe mis à jour. Vous pouvez vous connecter." };
}
