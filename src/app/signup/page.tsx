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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,99,62,0.2),_transparent_42%),linear-gradient(160deg,_#f6fbf7_0%,_#edf5ef_52%,_#e8f0ea_100%)] px-4 py-14 sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center">
        <SignupForm />
      </section>
    </main>
  );
}
