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
    <main className="site-auth">
      <section className="site-auth-shell site-auth-shell--split">
        <div className="site-auth-panel site-auth-panel--dark">
          <div className="site-auth-panel__content">
            <div className="space-y-4">
              <p className="site-auth-badge">
                Secure Portal
              </p>
              <h1 className="site-auth-title">
                Sign in with email and password.
              </h1>
              <p className="site-auth-copy">
                Access your blood bank dashboard, manage your donor profile, and respond to emergency requests.
              </p>
            </div>

            <div className="site-auth-note">
              Use this login for donor and protected user flows. Admin access has its own sign-in page.
            </div>
          </div>
        </div>

        <div className="site-auth-form-wrap">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </section>
    </main>
  );
}
