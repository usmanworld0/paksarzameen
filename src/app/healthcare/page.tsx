import type { Metadata } from "next";
import { HealthCareHubProfessional } from "@/features/healthcare/components/HealthCareHubProfessional";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HealthCare",
  description:
    "HealthCare section with quick medical AI answers, doctor appointments, patient-doctor chat, and blood bank services.",
};

export default function HealthCarePage() {
  return (
    <main className="min-h-screen bg-white">
      <HealthCareHubProfessional />
    </main>
  );
}
