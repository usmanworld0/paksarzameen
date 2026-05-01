import type { Metadata } from "next";

import { CompactPageHeader } from "@/components/layout/CompactPageHeader";
import { BloodBankRequestForm } from "@/features/blood-bank/components/BloodBankRequestForm";
import { EmergencyBloodRequest } from "@/features/blood-bank/components/EmergencyBloodRequest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HealthCare Blood Bank",
  description:
    "Blood bank is now a HealthCare subdivision for donor registration, matching, and donor chat.",
};

export default function HealthCareBloodBankPage() {
  return (
    <main className="site-page">
      <CompactPageHeader
        title="Blood Support."
        description="Register requests, match donors, and coordinate quickly."
      />

      <section className="site-section">
        <div className="site-shell">
          <div className="site-grid site-grid--two">
            <section className="site-panel site-panel--rounded">
              <div className="site-panel__body">
                <BloodBankRequestForm />
              </div>
            </section>

            <EmergencyBloodRequest />
          </div>
        </div>
      </section>
    </main>
  );
}
