import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NouvelleForm } from "@/components/requests/nouvelle-form";

export default async function NouvelleRequetePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const categories = await prisma.category.findMany({
    where: { active: true, service: { active: true } },
    include: { service: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl">Nouvelle requête</h1>
        <p className="text-muted">
          À l’envoi, la requête passe au statut Soumise et reçoit un numéro de suivi unique.
        </p>
      </div>
      <NouvelleForm
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          service: c.service.name,
        }))}
      />
    </div>
  );
}
