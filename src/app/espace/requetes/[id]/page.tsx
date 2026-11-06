import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/workflow";

export default async function RequeteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  const { id } = await params;

  const request = await prisma.request.findFirst({
    where: { id, demandeurId: session.user.id },
    include: {
      category: true,
      service: true,
      history: {
        orderBy: { createdAt: "asc" },
        include: { actor: { select: { nom: true } } },
      },
      comments: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { nom: true } } },
      },
    },
  });

  if (!request) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge value={request.status} label={STATUS_LABELS[request.status]} />
          <span className="font-mono text-sm text-muted">{request.numero}</span>
        </div>
        <h1 className="font-display text-3xl">{request.objet}</h1>
        <p className="mt-1 text-sm text-muted">
          {request.category.name} · {request.service.name}
        </p>
      </div>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="font-medium">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
          {request.description}
        </p>
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 font-medium">Historique</h2>
        <ol className="space-y-4 border-l-2 border-gold/50 pl-4">
          {request.history.map((h) => (
            <li key={h.id}>
              <div className="text-sm font-medium">
                {STATUS_LABELS[h.toStatus]}
              </div>
              <div className="text-xs text-muted">
                {h.actor.nom} ·{" "}
                {h.createdAt.toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              {h.note && <p className="mt-1 text-sm">{h.note}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
