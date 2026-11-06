import Image from "next/image";
import { LogoMark } from "@/components/brand/logo-mark";
import { LoginForm } from "@/components/auth/login-form";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-card shadow-[0_20px_60px_rgba(0,34,102,0.08)] md:grid-cols-2">
        <aside className="hidden bg-navy p-8 text-white md:flex md:flex-col md:justify-between">
          <LogoMark />
          <div>
            <h1 className="font-display text-3xl leading-snug">
              Accès sécurisé aux services de l’ESTLC
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Espace demandeur, file agent, administration — selon votre rôle.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Image
              src="/brand/logo_ueb.png"
              alt="UEB"
              width={40}
              height={40}
              className="rounded bg-white p-0.5"
            />
            Université d’Ebolowa · Ambam
          </div>
        </aside>
        <div className="p-6 md:p-10">
          <div className="mb-6 md:hidden">
            <LogoMark />
          </div>
          <h2 className="font-display text-2xl text-ink">Connexion</h2>
          <p className="mt-1 text-sm text-muted">
            Utilisez le courriel institutionnel ou votre compte créé ici.
          </p>
          {params.registered && (
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Compte créé. Vous pouvez vous connecter.
            </p>
          )}
          <div className="mt-6">
            <LoginForm callbackUrl={params.callbackUrl} />
          </div>
          <div className="mt-8 rounded-md border border-line bg-paper px-3 py-3 text-xs text-muted">
            Démo seed : <code>etudiant@estlc.cm</code>,{" "}
            <code>agent@estlc.cm</code>, <code>responsable@estlc.cm</code>,{" "}
            <code>admin@estlc.cm</code> — mot de passe{" "}
            <code>Estlc2026!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
