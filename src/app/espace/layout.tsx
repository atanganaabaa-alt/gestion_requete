import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/shell/app-shell";

export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  return (
    <AppShell
      user={session.user}
      nav={[
        { href: "/espace", label: "Tableau de bord" },
        { href: "/espace/requetes", label: "Mes requêtes" },
        { href: "/espace/nouvelle", label: "Nouvelle requête" },
        { href: "/suivi", label: "Suivi public" },
      ]}
    >
      {children}
    </AppShell>
  );
}
