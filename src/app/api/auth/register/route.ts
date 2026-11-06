import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  nom: z.string().min(2, "Indiquez votre nom complet"),
  email: z.string().email("Courriel invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  telephone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: "Un compte existe déjà avec ce courriel." },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      nom: parsed.data.nom.trim(),
      email,
      telephone: parsed.data.telephone?.trim() || null,
      passwordHash: await hash(parsed.data.password, 10),
      role: "DEMANDEUR",
    },
    select: { id: true, email: true, nom: true, role: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
