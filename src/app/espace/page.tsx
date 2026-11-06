import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/workflow";

export default async function EspacePage() {
  const session = await auth();
  const userId = session!.user.id;

  const requests = await prisma.request.findMany({
    where: { demandeurId: userId },
    orderBy: { updatedAt: "desc" },
    take: 8,
    include: { category: true },
  });

  const open = requests.filter(
    (r) => !["CLOTUREE", "ANNULEE", "REJETEE"].includes(r.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Bonjour, {session!.user.nom.split(" ")[0]}</h1>
          <p className="mt-1 text-muted">
            Suivez vos demandes auprès des services de l’ESTLC.
          </p>
        </div>
        <Link href="/espace/nouvelle">
          <Button>Nouvelle requête</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="text-sm text-muted">Requêtes</div>
          <div className="mt-1 text-3xl font-semibold text-navy">{requests.length}</div>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="text-sm text-muted">En cours</div>
          <div className="mt-1 text-3xl font-semibold text-navy">{open}</div>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="text-sm text-muted">Astuce</div>
          <div className="mt-1 text-sm text-ink/80">
            Conservez votre numéro <span className="font-mono">REQ-…</span> pour le suivi public.
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="border-b border-line px-4 py-3 font-medium">Dernières requêtes</div>
        {requests.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted">
            Aucune requête pour le moment.{" "}
            <Link href="/espace/nouvelle" className="text-navy underline">
              Déposez votre première demande
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {requests.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/espace/requetes/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-paper"
                >
                  <div>
                    <div className="font-medium text-ink">{r.objet}</div>
                    <div className="text-sm text-muted">
                      {r.numero} · {r.category.name}
                    </div>
                  </div>
                  <Badge value={r.status} label={STATUS_LABELS[r.status]} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
