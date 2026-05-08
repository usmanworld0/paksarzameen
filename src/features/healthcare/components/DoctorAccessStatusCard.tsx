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
    <main className="min-h-screen bg-[#f3f3ee] px-[5%] pb-20 pt-24">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctor Portal</p>
          <h1 className="mt-3 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
            {isPending
              ? "Your application is under review."
              : isDeclined
                ? "Your application was declined."
                : "Doctor access has not been requested yet."}
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
            {isPending
              ? "An admin needs to approve your doctor account before the dashboard and scheduling tools open up."
              : isDeclined
                ? "You can update your details and submit the request again for another review."
                : "Create a doctor application first, and once the admin approves it, this route will open the full doctor dashboard."}
          </p>

          <div className="mt-5 rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
            <p className="text-sm font-medium text-[#707072]">
              <span className="font-semibold text-[#111111]">Account:</span> {userEmail}
            </p>
            {request ? (
              <>
                <p className="mt-2 text-sm font-medium text-[#707072]">
                  <span className="font-semibold text-[#111111]">Status:</span> {request.status}
                </p>
                <p className="mt-2 text-sm font-medium text-[#707072]">
                  <span className="font-semibold text-[#111111]">Submitted:</span>{" "}
                  {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.reviewedAt ? (
                  <p className="mt-2 text-sm font-medium text-[#707072]">
                    <span className="font-semibold text-[#111111]">Reviewed:</span>{" "}
                    {new Date(request.reviewedAt).toLocaleString()}
                  </p>
                ) : null}
                {request.adminNote ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">Admin note</p>
                    <p className="mt-1 text-sm font-medium text-amber-900">{request.adminNote}</p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!isPending ? (
              <Link
                href="/healthcare/doctor/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
              >
                {isDeclined ? "Update and Resubmit" : "Apply as Doctor"}
              </Link>
            ) : null}
            <Link
              href="/healthcare/doctor/sign-in"
              className="inline-flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
            >
              Go to Sign In
            </Link>
            <DoctorPortalLogoutButton className="inline-flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30" />
          </div>
        </div>
      </section>
    </main>
  );
}
