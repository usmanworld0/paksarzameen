import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a secure password reset link.",
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl items-center justify-center">
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
