import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-6 md:p-10">
        <LogoMark />
        <h1 className="mt-6 font-display text-2xl">Nouveau mot de passe</h1>
        <div className="mt-6">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p className="text-sm text-muted">
              Lien incomplet.{" "}
              <Link href="/mot-de-passe-oublie" className="text-navy underline">
                Recommencer
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
