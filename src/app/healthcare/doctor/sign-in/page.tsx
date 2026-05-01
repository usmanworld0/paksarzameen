import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { getDoctorByUserId, getDoctorSignupRequestByUserId } from "@/services/healthcare/core-service";
import { DoctorPortalSignInForm } from "@/features/healthcare/components/DoctorPortalSignInForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doctor Sign In",
  description: "Doctor portal sign in for the healthcare dashboard and appointment management.",
};

export default async function DoctorSignInPage() {
  const user = await requireAuthenticatedUser();
  if (user?.id) {
    const [doctor, request] = await Promise.all([
      getDoctorByUserId(user.id),
      getDoctorSignupRequestByUserId(user.id),
    ]);

    if (doctor || request) {
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
              <h1 className="site-auth-title">Clinical access for approved practitioners.</h1>
              <p className="site-auth-copy">
                Sign in to manage appointments, review patient context, and operate from the
                doctor dashboard.
              </p>
            </div>

            <div className="site-auth-note">
              If you do not have a doctor account yet, submit your application first and wait for approval.
            </div>
          </div>
        </div>

        <div className="site-auth-form-wrap">
          <DoctorPortalSignInForm />
        </div>
      </section>
    </main>
  );
}
