import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { getDoctorByUserId, getDoctorSignupRequestByUserId } from "@/services/healthcare/core-service";
import { DoctorPortalSignupForm } from "@/features/healthcare/components/DoctorPortalSignupForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doctor Sign Up",
  description: "Apply for a doctor account. Admin approval is required before dashboard access is granted.",
};

export default async function DoctorSignUpPage() {
  const user = await requireAuthenticatedUser();
  if (user?.id) {
    const [doctor, request] = await Promise.all([
      getDoctorByUserId(user.id),
      getDoctorSignupRequestByUserId(user.id),
    ]);

    if (doctor || request?.status === "pending") {
      redirect("/healthcare/doctor");
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee] px-4 py-14 sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center">
        <DoctorPortalSignupForm />
      </section>
    </main>
  );
}
