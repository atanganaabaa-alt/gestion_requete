import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createUserAction, toggleUserAction } from "@/app/actions/admin";

const errors: Record<string, string> = {
  champs: "Nom, courriel et mot de passe (8 caractères) sont requis.",
  service: "Un agent ou un responsable doit être rattaché à un service.",
  existe: "Ce courriel est déjà utilisé.",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; ok?: string }>;
}) {
  const params = await searchParams;
  const [users, services] = await Promise.all([
    prisma.user.findMany({ orderBy: { nom: "asc" }, include: { service: true } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Comptes</h1>
        <p className="text-muted">Création des accès agent, responsable et demandeur.</p>
      </div>
      {params.ok && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Compte créé.
        </p>
      )}
      {params.erreur && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {errors[params.erreur] ?? "Action impossible."}
        </p>
      )}
      <form action={createUserAction} className="grid gap-3 rounded-xl border border-line bg-card p-5 md:grid-cols-2">
        <div>
          <Label>Nom</Label>
          <Input name="nom" required />
        </div>
        <div>
          <Label>Courriel</Label>
          <Input name="email" type="email" required />
        </div>
        <div>
          <Label>Mot de passe initial</Label>
          <Input name="password" type="password" required minLength={8} />
        </div>
        <div>
          <Label>Rôle</Label>
          <select name="role" className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm" defaultValue="AGENT">
            <option value="DEMANDEUR">Demandeur</option>
            <option value="AGENT">Agent</option>
            <option value="RESPONSABLE">Responsable</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Service</Label>
          <select name="serviceId" className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm" defaultValue="">
            <option value="">Aucun</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button type="submit">Créer le compte</Button>
        </div>
      </form>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <div className="font-medium">{user.nom}</div>
              <div className="text-muted">
                {user.email} · {user.service?.name ?? "sans service"} · {user.active ? "actif" : "désactivé"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge value={user.role} />
              <form action={toggleUserAction}>
                <input type="hidden" name="id" value={user.id} />
                <Button type="submit" variant="secondary" size="sm">
                  {user.active ? "Désactiver" : "Réactiver"}
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
