"use client";

import { useActionState } from "react";
import { createRequestAction, type RequestFormState } from "@/app/actions/requests";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";

const initial: RequestFormState = {};

export function NouvelleForm({
  categories,
}: {
  categories: Array<{ id: string; name: string; service: string }>;
}) {
  const [state, action, pending] = useActionState(createRequestAction, initial);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-line bg-card p-5">
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
              {c.name} · {c.service}
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
      <div>
        <Label>Pièces jointes (PDF, JPG, PNG — 1 Ko à 5 Mo, 5 fichiers max)</Label>
        <Input name="pieces" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" />
      </div>
      <FieldError message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Soumettre la requête"}
      </Button>
    </form>
  );
}
