"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { installClientFetchProxy } from "@/lib/api";

const HealthCareHubProfessional = dynamic(() => import("@/features/healthcare/components/HealthCareHubProfessional").then((m) => m.HealthCareHubProfessional), { ssr: false });

export default function HealthCarePageClient() {
  useEffect(() => {
    installClientFetchProxy();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-28 sm:pt-32">
      <HealthCareHubProfessional />
    </main>
  );
}
