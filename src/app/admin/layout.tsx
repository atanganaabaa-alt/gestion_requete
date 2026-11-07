import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/shell/app-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ADMIN") redirect("/espace");

  return (
    <AppShell
      user={session.user}
      nav={[
        { href: "/admin", label: "Vue d’ensemble" },
        { href: "/admin/utilisateurs", label: "Comptes" },
        { href: "/admin/services", label: "Services" },
        { href: "/admin/categories", label: "Catégories" },
        { href: "/agent", label: "Console agent" },
      ]}
    >
      {children}
    </AppShell>
  );
}
