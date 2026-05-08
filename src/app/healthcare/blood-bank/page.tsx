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
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Healthcare / Blood Bank</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Blood Bank
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Register blood requests, find compatible donors, and chat directly with donors for urgent coordination.
          </p>
        </div>
      </header>

      <div className="px-[5%] py-10">
        <div className="mx-auto max-w-screen-xl space-y-8">
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <div className="border-b border-[#E5E5E5] pb-4 mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Donor Registration</p>
              <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Donor Registration &amp; Request</h2>
            </div>
            <BloodBankRequestForm />
          </div>

          <EmergencyBloodRequest />
        </div>
      </div>
    </main>
  );
}
