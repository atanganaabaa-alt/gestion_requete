import { LogoMark } from "@/components/brand/logo-mark";
import { RegisterForm } from "@/components/auth/register-form";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-6 shadow-[0_20px_60px_rgba(0,34,102,0.08)] md:p-10">
        <LogoMark />
        <h1 className="mt-6 font-display text-2xl">Créer un compte</h1>
        <p className="mt-1 text-sm text-muted">
          Inscription demandeur (étudiant, personnel, candidat). Les comptes
          agent et admin sont créés par l’administration.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
