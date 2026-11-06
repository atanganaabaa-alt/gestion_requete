import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/app/actions/auth";

const roleLabel: Record<string, string> = {
  DEMANDEUR: "Demandeur",
  AGENT: "Agent",
  RESPONSABLE: "Responsable",
  ADMIN: "Administrateur",
};

export function AppShell({
  user,
  nav,
  children,
}: {
  user: { nom: string; email: string; role: string };
  nav: Array<{ href: string; label: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-navy text-white md:border-b-0 md:border-r md:border-navy-deep">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <Link href="/" className="rounded-md bg-white/95 px-3 py-2 text-navy">
            <LogoMark compact />
          </Link>
          <div className="rounded-md bg-white/10 px-3 py-3 text-sm">
            <div className="font-medium">{user.nom}</div>
            <div className="mt-1 text-white/70">{user.email}</div>
            <div className="mt-2">
              <Badge value={user.role} label={roleLabel[user.role] ?? user.role} />
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="mt-auto">
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
