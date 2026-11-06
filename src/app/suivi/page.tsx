import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoMark } from "@/components/brand/logo-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { STATUS_LABELS } from "@/lib/workflow";

export default async function SuiviPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>;
}) {
  const { numero } = await searchParams;
  const query = numero?.trim().toUpperCase() ?? "";
  const request = query
    ? await prisma.request.findUnique({
        where: { numero: query },
        select: {
          numero: true,
          objet: true,
          status: true,
          updatedAt: true,
          category: { select: { name: true } },
          service: { select: { name: true } },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-block">
          <LogoMark />
        </Link>
        <h1 className="mt-8 font-display text-3xl">Suivi public</h1>
        <p className="mt-1 text-sm text-muted">
          Saisissez le numéro reçu à la soumission, par exemple REQ-2026-00001.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end" action="/suivi">
          <div className="flex-1">
            <Label>Numéro de suivi</Label>
            <Input name="numero" defaultValue={query} placeholder="REQ-2026-00001" required />
          </div>
          <Button type="submit">Consulter</Button>
        </form>
        {query && (
          <div className="mt-6 rounded-xl border border-line bg-card p-5">
            {request ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <Badge value={request.status} label={STATUS_LABELS[request.status]} />
                  <span className="font-mono text-xs text-muted">{request.numero}</span>
                </div>
                <h2 className="text-lg font-medium">{request.objet}</h2>
                <p className="mt-1 text-sm text-muted">
                  {request.category.name} · {request.service.name}
                </p>
                <p className="mt-3 text-xs text-muted">
                  Mise à jour{" "}
                  {request.updatedAt.toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">Aucune requête ne correspond à ce numéro.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}