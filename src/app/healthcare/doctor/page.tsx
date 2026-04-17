import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { DoctorDashboard } from "@/features/healthcare/components/DoctorDashboard";

export const dynamic = "force-dynamic";

export default async function HealthCareDoctorPage() {
  const user = await requireAuthenticatedUser();
  if (!user?.id) {
    redirect("/login?callbackUrl=/healthcare/doctor");
  }

  return <DoctorDashboard />;
}
