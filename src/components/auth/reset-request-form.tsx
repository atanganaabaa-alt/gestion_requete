"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestResetAction, type ResetState } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

const initial: ResetState = {};

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestResetAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label>Courriel du compte</Label>
        <Input name="email" type="email" required placeholder="prenom.nom@estlc.cm" />
      </div>
      <FieldError message={state.message} />
      {state.link && (
        <p className="rounded-md border border-line bg-paper px-3 py-2 text-sm">
          Lien local :{" "}
          <Link href={state.link} className="font-medium text-navy underline">
            réinitialiser le mot de passe
          </Link>
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Préparation…" : "Demander la réinitialisation"}
      </Button>
    </form>
  );
}
