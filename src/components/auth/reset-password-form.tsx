"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetState } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

const initial: ResetState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);

  if (state.ok) {
    return (
      <div className="space-y-4">
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.message}
        </p>
        <Link href="/connexion" className="inline-block text-sm font-medium text-navy underline">
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label>Nouveau mot de passe</Label>
        <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <FieldError message={state.message} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </Button>
    </form>
  );
}
