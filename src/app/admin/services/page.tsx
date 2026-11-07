import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createServiceAction, toggleServiceAction } from "@/app/actions/admin";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; ok?: string }>;
}) {
  const params = await searchParams;
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Services</h1>
        <p className="text-muted">Scolarité, départements, patrimoine, DSI.</p>
      </div>
      {params.ok && <p className="text-sm text-emerald-800">Service ajouté.</p>}
      {params.erreur === "existe" && <p className="text-sm text-accent">Ce code existe déjà.</p>}
      {params.erreur === "champs" && <p className="text-sm text-accent">Code et nom sont obligatoires.</p>}
      <form action={createServiceAction} className="grid gap-3 rounded-xl border border-line bg-card p-5 md:grid-cols-3">
        <div>
          <Label>Code</Label>
          <Input name="code" required placeholder="GSI" />
        </div>
        <div>
          <Label>Nom</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" />
        </div>
        <div>
          <Button type="submit">Ajouter</Button>
        </div>
      </form>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
        {services.map((service) => (
          <li key={service.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <span className="font-mono text-xs text-navy">{service.code}</span> · {service.name}
              <span className="text-muted"> · {service.active ? "actif" : "inactif"}</span>
            </div>
            <form action={toggleServiceAction}>
              <input type="hidden" name="id" value={service.id} />
              <Button type="submit" variant="secondary" size="sm">
                {service.active ? "Désactiver" : "Réactiver"}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
