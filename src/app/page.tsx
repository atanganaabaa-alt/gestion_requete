import Image from "next/image";
import Link from "next/link";
import { auth, homeForRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect(homeForRole(session.user.role));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#003399_0%,#001a4d_42%,#0b1220_100%)] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <div className="rounded-md bg-white px-3 py-2 text-navy">
          <LogoMark />
        </div>
        <div className="flex gap-2">
          <Link href="/connexion">
            <Button variant="secondary">Connexion</Button>
          </Link>
          <Link href="/inscription" className="hidden sm:block">
            <Button variant="danger">Créer un compte</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-6 md:pt-16">
        <section>
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-white/60">
            ESTLC · Université d’Ebolowa
          </p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">
            Vos demandes scolaires, suivies jusqu’à la clôture.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Relevé, attestation, recours, réservation de salle, assistance :
            un seul point d’entrée pour les étudiants et les services de
            l’ESTLC à Ambam.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inscription">
              <Button variant="danger" className="min-w-40">
                Soumettre une requête
              </Button>
            </Link>
            <Link href="/suivi">
              <Button variant="secondary">Suivre un numéro</Button>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
          <div className="mb-5 flex items-center gap-4">
            <Image
              src="/brand/logo_ueb.png"
              alt="Université d’Ebolowa"
              width={64}
              height={64}
              className="rounded bg-white p-1"
            />
            <div>
              <div className="font-display text-xl">Campus Ambam</div>
              <div className="text-sm text-white/65">
                Transport · Logistique · Commerce · Numérique
              </div>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="border-l-2 border-accent pl-3">
              Numéro de suivi unique à chaque dépôt
            </li>
            <li className="border-l-2 border-accent pl-3">
              Workflow clair pour la scolarité et les départements
            </li>
            <li className="border-l-2 border-accent pl-3">
              Historique, pièces jointes et notifications
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
