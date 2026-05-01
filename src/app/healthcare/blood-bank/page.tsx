import type { Metadata } from "next";

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
      <section className="site-hero">
        <div className="site-hero__noise" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--left" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--right" aria-hidden="true" />

        <header className="site-hero__inner">
          <h1 className="site-hero__title">Blood Support.</h1>
          <p className="site-hero__body">
            Register requests, match donors, and coordinate quickly.
          </p>
        </header>
      </section>

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
