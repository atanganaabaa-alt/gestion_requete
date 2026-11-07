import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createCategoryAction, toggleCategoryAction } from "@/app/actions/admin";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; ok?: string }>;
}) {
  const params = await searchParams;
  const [categories, services] = await Promise.all([
    prisma.category.findMany({ include: { service: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Catégories</h1>
        <p className="text-muted">Chaque catégorie est rattachée à un service destinataire.</p>
      </div>
      {params.ok && <p className="text-sm text-emerald-800">Catégorie ajoutée.</p>}
      {params.erreur === "existe" && <p className="text-sm text-accent">Ce code existe déjà.</p>}
      {params.erreur === "champs" && <p className="text-sm text-accent">Code, nom et service sont obligatoires.</p>}
      <form action={createCategoryAction} className="grid gap-3 rounded-xl border border-line bg-card p-5 md:grid-cols-3">
        <div>
          <Label>Code</Label>
          <Input name="code" required placeholder="RELEVE" />
        </div>
        <div>
          <Label>Nom</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Service</Label>
          <select name="serviceId" required className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm" defaultValue="">
            <option value="" disabled>
              Choisir…
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button type="submit">Ajouter</Button>
        </div>
      </form>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              {category.name}
              <span className="text-muted">
                {" "}
                · {category.service.name} · {category.active ? "active" : "inactive"}
              </span>
            </div>
            <form action={toggleCategoryAction}>
              <input type="hidden" name="id" value={category.id} />
              <Button type="submit" variant="secondary" size="sm">
                {category.active ? "Désactiver" : "Réactiver"}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
