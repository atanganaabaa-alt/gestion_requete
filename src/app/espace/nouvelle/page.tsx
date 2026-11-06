import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRequestAction } from "@/app/actions/requests";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function NouvelleRequetePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const categories = await prisma.category.findMany({
    where: { active: true },
    include: { service: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl">Nouvelle requête</h1>
        <p className="text-muted">
          Décrivez votre besoin. Un numéro de suivi sera généré à l’envoi.
        </p>
      </div>

      <form action={createRequestAction} className="space-y-4 rounded-xl border border-line bg-card p-5">
        <div>
          <Label>Catégorie</Label>
          <select
            name="categoryId"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
            defaultValue=""
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Objet</Label>
          <Input name="objet" required maxLength={120} placeholder="Ex. Relevé de notes L3 — concours" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            required
            rows={6}
            placeholder="Précisez le contexte, le délai souhaité et les pièces déjà disponibles."
          />
        </div>
        <div>
          <Label>Priorité souhaitée</Label>
          <select
            name="priority"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm"
            defaultValue="NORMALE"
          >
            <option value="BASSE">Basse</option>
            <option value="NORMALE">Normale</option>
            <option value="HAUTE">Haute</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>
        <Button type="submit">Soumettre la requête</Button>
      </form>
    </div>
  );
}
