import type { Metadata } from "next";
import { BloodBankRequestForm } from "@/features/blood-bank/components/BloodBankRequestForm";
import { EmergencyBloodRequest } from "@/features/blood-bank/components/EmergencyBloodRequest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HealthCare Blood Bank",
  description: "Blood bank is now a HealthCare subdivision for donor registration, matching, and donor chat.",
};

export default function HealthCareBloodBankPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fcf7_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
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
