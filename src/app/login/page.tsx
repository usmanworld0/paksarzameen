import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Secure email and password sign-in for protected Paksarzameen pages.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee] flex items-center justify-center px-[5%] py-24">
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
