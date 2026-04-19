import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/utils/supabase/server";

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
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      redirect(callbackUrl);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,99,62,0.22),_transparent_42%),linear-gradient(160deg,_#f6fbf7_0%,_#edf5ef_52%,_#e8f0ea_100%)] px-4 py-14 sm:px-6 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-white/70 shadow-[0_34px_120px_rgba(4,45,29,0.15)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-[linear-gradient(140deg,#0d6b41_0%,#0c5636_100%)] p-8 text-white sm:p-12 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.22),transparent_38%),radial-gradient(circle_at_80%_78%,rgba(152,255,198,0.2),transparent_36%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
                Secure Portal
              </p>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Sign in with email and password.
              </h1>
              <p className="max-w-lg text-base leading-7 text-emerald-50/90 sm:text-lg">
                Access your blood bank dashboard, manage your donor profile, and respond to emergency requests.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm leading-6 text-emerald-50/90">
              Use this login for donor and protected user flows. Admin access has its own sign-in page.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </section>
    </main>
  );
}
