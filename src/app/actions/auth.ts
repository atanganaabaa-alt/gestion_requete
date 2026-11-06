"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export type AuthState = { message?: string };

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "");
  const target =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/apres-connexion";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: target,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Courriel ou mot de passe incorrect." };
    }
    throw error;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/connexion" });
}
