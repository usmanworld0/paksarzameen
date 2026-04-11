import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account.",
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl items-center justify-center">
        <ResetPasswordForm token={params.token} />
      </section>
    </main>
  );
}
