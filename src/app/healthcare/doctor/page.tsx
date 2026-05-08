import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { DoctorDashboard } from "@/features/healthcare/components/DoctorDashboard";
import { DoctorAccessStatusCard } from "@/features/healthcare/components/DoctorAccessStatusCard";
import { getDoctorByUserId, getDoctorSignupRequestByUserId } from "@/services/healthcare/core-service";

export const dynamic = "force-dynamic";

export default async function HealthCareDoctorPage() {
  const user = await requireAuthenticatedUser();
  if (!user?.id) {
    redirect("/healthcare/doctor/sign-in");
  }

  const [doctor, request] = await Promise.all([
    getDoctorByUserId(user.id),
    getDoctorSignupRequestByUserId(user.id),
  ]);

  if (!doctor) {
    return <DoctorAccessStatusCard userEmail={user.email} request={request} />;
  }

  return <DoctorDashboard />;
}
