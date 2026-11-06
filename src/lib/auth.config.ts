import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role: Role }).role;
        token.nom = (user as { nom: string }).nom;
        token.serviceId = (user as { serviceId?: string | null }).serviceId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email ?? session.user.email;
      session.user.nom = token.nom as string;
      session.user.role = token.role as Role;
      session.user.serviceId = (token.serviceId as string | null | undefined) ?? null;
      return session;
    },
  },
} satisfies NextAuthConfig;
