import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/shell/app-shell";

export default async function AgentLayout({
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
        { href: "/agent", label: "Tableau de bord" },
        { href: "/agent/file", label: "File des requêtes" },
      ]}
    >
      {children}
    </AppShell>
  );
}
