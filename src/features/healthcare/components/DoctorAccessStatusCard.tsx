"use client";

import Link from "next/link";

import { DoctorPortalLogoutButton } from "@/features/healthcare/components/DoctorPortalLogoutButton";

type DoctorSignupRequest = {
  requestId: string;
  email: string;
  fullName: string;
  specialization: string | null;
  bio: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
  status: "pending" | "approved" | "declined";
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

type DoctorAccessStatusCardProps = {
  userEmail: string;
  request: DoctorSignupRequest | null;
};

export function DoctorAccessStatusCard({
  userEmail,
  request,
}: DoctorAccessStatusCardProps) {
  const isPending = request?.status === "pending";
  const isDeclined = request?.status === "declined";

  return (
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell--narrow">
          <header className="site-detail__hero">
            <p className="site-eyebrow">Doctor Portal</p>
            <h1 className="site-display mt-4 max-w-[12ch]">
              {isPending
                ? "Your Application Is Under Review."
                : isDeclined
                  ? "Your Application Was Declined."
                  : "Doctor Access Has Not Been Requested Yet."}
            </h1>
            <p className="site-copy mt-4">
              {isPending
                ? "An admin needs to approve your doctor account before the dashboard and scheduling tools open up."
                : isDeclined
                  ? "You can update your details and submit the request again for another review."
                  : "Create a doctor application first and this route will open the full doctor dashboard once it is approved."}
            </p>
          </header>

          <section className="site-panel mt-6">
            <div className="site-panel__body">
              <div className="site-meta-row">
                <span>Account: {userEmail}</span>
                {request ? <span>Status: {request.status}</span> : null}
              </div>

              {request ? (
                <div className="site-stack mt-5">
                  <p className="site-copy site-copy--sm">
                    Submitted: {new Date(request.createdAt).toLocaleString()}
                  </p>
                  {request.reviewedAt ? (
                    <p className="site-copy site-copy--sm">
                      Reviewed: {new Date(request.reviewedAt).toLocaleString()}
                    </p>
                  ) : null}
                  {request.adminNote ? (
                    <div className="site-callout">{request.adminNote}</div>
                  ) : null}
                </div>
              ) : null}

              <div className="site-form-actions mt-6">
                {!isPending ? (
                  <Link href="/healthcare/doctor/sign-up" className="site-button">
                    {isDeclined ? "Update And Resubmit" : "Apply As Doctor"}
                  </Link>
                ) : null}
                <Link href="/healthcare/doctor/sign-in" className="site-button-secondary">
                  Go To Sign In
                </Link>
                <DoctorPortalLogoutButton className="site-button-secondary" />
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
