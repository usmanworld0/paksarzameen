"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { installClientFetchProxy } from "../../../../lib/api";

const DoctorPortalSignInForm = dynamic(
  () => import("../../../../features/healthcare/components/DoctorPortalSignInForm").then((m) => m.DoctorPortalSignInForm),
  { ssr: false }
);

export default function DoctorSignInPage() {
  useEffect(() => {
    installClientFetchProxy();
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,99,62,0.2),_transparent_42%),linear-gradient(160deg,_#f6fbf7_0%,_#edf5ef_52%,_#e8f0ea_100%)] px-4 py-14 sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center">
        <DoctorPortalSignInForm />
      </section>
    </main>
  );
}
