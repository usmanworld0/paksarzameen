import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { SignupForm } from "@/features/auth/components/SignupForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create a donor or hospital account for Paksarzameen Blood Bank.",
};

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="site-auth">
      <section className="site-auth-shell">
        <SignupForm />
      </section>
    </main>
  );
}
