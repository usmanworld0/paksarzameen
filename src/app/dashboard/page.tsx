import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { ProfileDashboard } from "@/features/auth/components/ProfileDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected profile and donor management dashboard.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
