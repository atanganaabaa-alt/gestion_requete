"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

const initial: AuthState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <div>
        <Label>Courriel</Label>
        <Input
          name="email"
          type="email"
          required
          placeholder="prenom.nom@estlc.cm"
          autoComplete="email"
        />
      </div>
      <div>
        <Label>Mot de passe</Label>
        <Input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
        />
      </div>
      <p className="text-right text-sm">
        <Link href="/mot-de-passe-oublie" className="text-navy underline">
          Mot de passe oublié
        </Link>
      </p>
      <FieldError message={state.message} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
      <p className="text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-navy underline">
          S’inscrire
        </Link>
      </p>
    </form>
  );
}
