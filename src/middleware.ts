import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const roleHome: Record<string, string> = {
  DEMANDEUR: "/espace",
  AGENT: "/agent",
  RESPONSABLE: "/agent",
  ADMIN: "/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  const isAuthPage =
    pathname.startsWith("/connexion") || pathname.startsWith("/inscription");

  if (session && isAuthPage) {
    return NextResponse.redirect(
      new URL(roleHome[role ?? "DEMANDEUR"] ?? "/espace", req.url)
    );
  }

  const needsAuth =
    pathname.startsWith("/espace") ||
    pathname.startsWith("/agent") ||
    pathname.startsWith("/admin");

  if (needsAuth && !session) {
    const url = new URL("/connexion", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[role ?? "DEMANDEUR"], req.url));
  }

  if (
    pathname.startsWith("/agent") &&
    role !== "AGENT" &&
    role !== "RESPONSABLE" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL(roleHome[role ?? "DEMANDEUR"], req.url));
  }

  if (
    pathname.startsWith("/espace") &&
    (role === "AGENT" || role === "RESPONSABLE")
  ) {
    return NextResponse.redirect(new URL("/agent", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
};
