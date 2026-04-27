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

export function DoctorAccessStatusCard({ userEmail, request }: DoctorAccessStatusCardProps) {
  const isPending = request?.status === "pending";
  const isDeclined = request?.status === "declined";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6fbf7_0%,_#edf5ef_100%)] px-4 pb-20 pt-24 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Doctor Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            {isPending
              ? "Your application is under review."
              : isDeclined
                ? "Your application was declined."
                : "Doctor access has not been requested yet."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {isPending
              ? "An admin needs to approve your doctor account before the dashboard and scheduling tools open up."
              : isDeclined
                ? "You can update your details and submit the request again for another review."
                : "Create a doctor application first, and once the admin approves it, this route will open the full doctor dashboard."}
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Account:</span> {userEmail}
            </p>
            {request ? (
              <>
                <p className="mt-2">
                  <span className="font-semibold text-slate-900">Status:</span> {request.status}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-slate-900">Submitted:</span>{" "}
                  {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.reviewedAt ? (
                  <p className="mt-2">
                    <span className="font-semibold text-slate-900">Reviewed:</span>{" "}
                    {new Date(request.reviewedAt).toLocaleString()}
                  </p>
                ) : null}
                {request.adminNote ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                    <p className="text-xs font-semibold uppercase tracking-wide">Admin note</p>
                    <p className="mt-1 text-sm">{request.adminNote}</p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!isPending ? (
              <Link
                href="/healthcare/doctor/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isDeclined ? "Update and Resubmit" : "Apply as Doctor"}
              </Link>
            ) : null}
            <Link
              href="/healthcare/doctor/sign-in"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Go to Sign In
            </Link>
            <DoctorPortalLogoutButton className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700" />
          </div>
        </div>
      </section>
    </main>
  );
}
