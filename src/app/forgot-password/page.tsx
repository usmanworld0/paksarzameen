import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Verify your email and CNIC to set a new password.",
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee] flex items-center justify-center px-[5%] py-24">
      <ForgotPasswordForm />
    </main>
  );
}
