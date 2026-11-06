import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const [users, services, categories] = await Promise.all([
    prisma.user.findMany({
      orderBy: { nom: "asc" },
      include: { service: true },
    }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { service: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Administration ESTLC</h1>
        <p className="text-muted">
          Comptes, services et catégories de la plateforme.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="border-b border-line px-4 py-3 font-medium">Utilisateurs</div>
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <div className="font-medium">{u.nom}</div>
                <div className="text-muted">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted">{u.service?.name ?? "—"}</span>
                <Badge value={u.role} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-card p-4">
          <h2 className="mb-3 font-medium">Services</h2>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <span className="font-mono text-xs text-navy">{s.code}</span> · {s.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <h2 className="mb-3 font-medium">Catégories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                {c.name}
                <span className="text-muted"> · {c.service.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
