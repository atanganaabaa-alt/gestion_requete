import { redirect } from "next/navigation";
import { auth, homeForRole } from "@/lib/auth";

export default async function ApresConnexionPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  redirect(homeForRole(session.user.role));
}
