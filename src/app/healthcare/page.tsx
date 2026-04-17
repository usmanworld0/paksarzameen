import type { Metadata } from "next";
import { HealthCareHub } from "@/features/healthcare/components/HealthCareHub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HealthCare",
  description:
    "HealthCare section with quick medical AI answers, doctor appointments, patient-doctor chat, and blood bank services.",
};

export default function HealthCarePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#eef6ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">HealthCare</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Integrated Care Platform</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Ask medical quick questions, book doctor appointments, and access blood bank donor services in one unified healthcare experience.
          </p>
        </header>

        <HealthCareHub />
      </section>
    </main>
  );
}
