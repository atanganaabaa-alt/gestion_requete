import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/workflow";

export default async function AgentDashboardPage() {
  const session = await auth();
  const where =
    session!.user.role === "ADMIN"
      ? {}
      : session!.user.serviceId
        ? { serviceId: session!.user.serviceId }
        : {};

  const [total, open, recent] = await Promise.all([
    prisma.request.count({ where }),
    prisma.request.count({
      where: {
        ...where,
        status: { in: ["SOUMISE", "AFFECTEE", "EN_COURS", "EN_ATTENTE"] },
      },
    }),
    prisma.request.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { category: true, demandeur: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Console agent</h1>
        <p className="text-muted">File de traitement des services ESTLC.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="text-sm text-muted">Volume visible</div>
          <div className="text-3xl font-semibold text-navy">{total}</div>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="text-sm text-muted">À traiter</div>
          <div className="text-3xl font-semibold text-navy">{open}</div>
        </div>
      </div>
      <section className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-medium">Récents</span>
          <Link href="/agent/file" className="text-sm text-navy underline">
            Voir la file
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <div className="font-medium">{r.objet}</div>
                <div className="text-sm text-muted">
                  {r.numero} · {r.demandeur.nom} · {r.category.name}
                </div>
              </div>
              <Badge value={r.status} label={STATUS_LABELS[r.status]} />
            </li>
          ))}
          {recent.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted">
              Aucune requête dans votre périmètre.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
