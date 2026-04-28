"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { installClientFetchProxy } from "@/lib/api";

const BloodBankRequestForm = dynamic(
  () => import("../../../../../src/features/blood-bank/components/BloodBankRequestForm").then((m) => m.BloodBankRequestForm),
  { ssr: false }
);

const EmergencyBloodRequest = dynamic(
  () => import("../../../../../src/features/blood-bank/components/EmergencyBloodRequest").then((m) => m.EmergencyBloodRequest),
  { ssr: false }
);

export default function HealthCareBloodBankPageClient() {
  useEffect(() => {
    installClientFetchProxy();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fcf7_0%,_#edf5ef_100%)] px-[4%] pb-20 pt-28">
      <section className="mx-auto max-w-screen-2xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">HealthCare / Blood Bank</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Emergency Blood Support</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Register blood requests, find compatible donors, and chat directly with donors for urgent coordination.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Donor Registration & Request</h2>
          <div className="mt-4">
            <BloodBankRequestForm />
          </div>
        </section>

        <EmergencyBloodRequest />
      </section>
    </main>
  );
}
