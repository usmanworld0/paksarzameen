import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileDashboard } from "@/features/auth/components/ProfileDashboard";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected profile and donor management dashboard.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
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
