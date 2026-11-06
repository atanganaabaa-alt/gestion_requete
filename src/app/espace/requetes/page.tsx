import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/workflow";

export default async function MesRequetesPage() {
  const session = await auth();
  const requests = await prisma.request.findMany({
    where: { demandeurId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, service: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Mes requêtes</h1>
        <p className="text-muted">Historique complet de vos dépôts.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Objet</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">État</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/espace/requetes/${r.id}`} className="text-navy underline">
                    {r.numero}
                  </Link>
                </td>
                <td className="px-4 py-3">{r.objet}</td>
                <td className="px-4 py-3 text-muted">{r.service.name}</td>
                <td className="px-4 py-3">
                  <Badge value={r.status} label={STATUS_LABELS[r.status]} />
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Aucune requête.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
