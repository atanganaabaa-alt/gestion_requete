import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { ResetRequestForm } from "@/components/auth/reset-request-form";

export default function MotDePasseOubliePage() {
  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-6 md:p-10">
        <LogoMark />
        <h1 className="mt-6 font-display text-2xl">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted">
          Indiquez le courriel du compte. Le lien reste valable une heure.
        </p>
        <div className="mt-6">
          <ResetRequestForm />
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/connexion" className="text-navy underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
