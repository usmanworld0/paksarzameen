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
    <main className="site-auth">
      <section className="site-auth-shell site-auth-shell--split">
        <div className="site-auth-panel site-auth-panel--dark">
          <div className="site-auth-panel__content">
            <div className="space-y-4">
              <p className="site-auth-badge">Doctor Portal</p>
              <h1 className="site-auth-title">Apply to join the healthcare network.</h1>
              <p className="site-auth-copy">
                Share your clinical background, specialization, and consultation details so the
                admin team can review your application.
              </p>
            </div>

            <div className="site-auth-note">
              Approved doctors receive access to appointments, patient conversations, and the portal dashboard.
            </div>
          </div>
        </div>

        <div className="site-auth-form-wrap">
          <DoctorPortalSignupForm />
        </div>
      </section>
    </main>
  );
}
