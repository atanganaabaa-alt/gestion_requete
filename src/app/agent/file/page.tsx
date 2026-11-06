import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/workflow";
import type { RequestStatus } from "@prisma/client";

const FILTERS: Array<RequestStatus | "TOUTES"> = [
  "TOUTES",
  "SOUMISE",
  "AFFECTEE",
  "EN_COURS",
  "EN_ATTENTE",
  "RESOLUE",
  "CLOTUREE",
];

export default async function AgentFilePage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const session = await auth();
  const { statut } = await searchParams;
  const serviceFilter =
    session!.user.role === "ADMIN" || !session!.user.serviceId
      ? {}
      : { serviceId: session!.user.serviceId };

  const statusFilter =
    statut && statut !== "TOUTES" && FILTERS.includes(statut as RequestStatus)
      ? { status: statut as RequestStatus }
      : {};

  const requests = await prisma.request.findMany({
    where: { ...serviceFilter, ...statusFilter },
    orderBy: { updatedAt: "desc" },
    include: { category: true, demandeur: true, service: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">File des requêtes</h1>
        <p className="text-muted">Filtrez par statut pour prioriser le traitement.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "TOUTES" ? "/agent/file" : `/agent/file?statut=${f}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              (statut ?? "TOUTES") === f
                ? "border-navy bg-navy text-white"
                : "border-line bg-card text-ink hover:border-navy"
            }`}
          >
            {f === "TOUTES" ? "Toutes" : STATUS_LABELS[f]}
          </Link>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Objet</th>
              <th className="px-4 py-3">Demandeur</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">État</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{r.numero}</td>
                <td className="px-4 py-3">{r.objet}</td>
                <td className="px-4 py-3">{r.demandeur.nom}</td>
                <td className="px-4 py-3 text-muted">{r.service.name}</td>
                <td className="px-4 py-3">
                  <Badge value={r.status} label={STATUS_LABELS[r.status]} />
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Aucune requête pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
