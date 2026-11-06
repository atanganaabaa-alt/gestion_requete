import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    nom: string;
    serviceId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      nom: string;
      role: Role;
      serviceId?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    nom: string;
    serviceId?: string | null;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user || !user.active) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          role: user.role,
          serviceId: user.serviceId,
        };
      },
    }),
  ],
});

export function homeForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "AGENT":
    case "RESPONSABLE":
      return "/agent";
    case "DEMANDEUR":
      return "/espace";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}
