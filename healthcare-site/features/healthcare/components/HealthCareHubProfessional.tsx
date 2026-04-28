"use client";

import dynamic from "next/dynamic";
export { HealthCareHubProfessional };

const Component = dynamic(() => import("../../../../src/features/healthcare/components/HealthCareHubProfessional").then((m) => m.HealthCareHubProfessional), { ssr: false });

function HealthCareHubProfessional(props: any) {
  return <Component {...props} />;
}
