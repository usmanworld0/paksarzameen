"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { installClientFetchProxy } from "../../../lib/api";

const DoctorDashboard = dynamic(
  () => import("../../../features/healthcare/components/DoctorDashboard").then((m) => m.DoctorDashboard),
  { ssr: false }
);

export default function HealthCareDoctorPageClient() {
  useEffect(() => {
    installClientFetchProxy();
  }, []);

  // The original server-side redirect is intentionally not duplicated here; the client components
  // call the same APIs and will render the appropriate state based on backend responses.
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-screen-2xl space-y-6">
        {/* We render the dashboard component which will fetch doctor profile; if no doctor exists the UI shows the relevant status card or messages. */}
        <DoctorDashboard />
      </section>
    </main>
  );
}
