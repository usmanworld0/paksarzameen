import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { ProfileDashboard } from "@/features/auth/components/ProfileDashboard";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected profile and donor management dashboard.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Private</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">Dashboard</h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Manage your profile, track donations, and view your activity.
          </p>
        </div>
      </header>
      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <ProfileDashboard />
        </div>
      </div>
    </main>
  );
}
