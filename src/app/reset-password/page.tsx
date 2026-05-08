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
    <main className="min-h-screen bg-[#f3f3ee] flex items-center justify-center px-[5%] py-24">
      <ResetPasswordForm token={params.token} />
    </main>
  );
}
