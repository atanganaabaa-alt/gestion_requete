"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(undefined);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: fd.get("nom"),
        email: fd.get("email"),
        telephone: fd.get("telephone"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.message ?? "Inscription impossible");
      return;
    }
    router.push("/connexion?registered=1");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Nom complet</Label>
        <Input name="nom" required placeholder="Amina Ngo" />
      </div>
      <div>
        <Label>Courriel</Label>
        <Input name="email" type="email" required placeholder="amina@estlc.cm" />
      </div>
      <div>
        <Label>Téléphone (optionnel)</Label>
        <Input name="telephone" placeholder="+237 6XX XXX XXX" />
      </div>
      <div>
        <Label>Mot de passe</Label>
        <Input name="password" type="password" required minLength={8} />
      </div>
      <FieldError message={error} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte demandeur"}
      </Button>
      <p className="text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-medium text-navy underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
