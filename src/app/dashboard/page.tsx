import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileDashboard } from "@/features/auth/components/ProfileDashboard";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected profile and donor management dashboard.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 py-14 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_60px_rgba(146,64,14,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">Supabase not configured</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard data is unavailable right now.</h1>
          <p className="mt-3 text-sm leading-6 text-amber-900/80">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or the ANON aliases) to enable sign-in and profile data loading.
          </p>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <ProfileDashboard />
      </section>
    </main>
  );
}
