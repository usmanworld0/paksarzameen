import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { ProgramsHubClient } from "@/features/programs/components/ProgramsHubClient";
import { getPrograms } from "@/lib/services/getPrograms";

export const metadata: Metadata = {
  title: "Projects by PakSarzameen",
  description:
    "Explore PakSarzameen projects and programs across environmental care, education, health, welfare, and empowerment.",
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Projects by PakSarzameen",
    description:
      "Discover all PakSarzameen departments and initiatives with category filters and searchable previews.",
    url: `${siteConfig.siteUrl}/programs`,
    type: "website",
    images: [
      {
        url: "/images/placeholders/10.png",
        width: 1200,
        height: 800,
        alt: "PakSarZameen volunteers working in community projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by PakSarzameen",
    description:
      "Discover all PakSarzameen departments and initiatives with category filters and searchable previews.",
    images: ["/images/placeholders/10.png"],
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <div className="programs-hero-section">
        <div className="programs-hero-overlay" />
        <header className="mx-auto w-full max-w-screen-xl px-[5%] pt-32 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
            Programs Hub
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            PakSarZameen Projects And Programs
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-100 sm:text-lg">
            Browse all core PSZ initiatives, filter by category, and search for
            specific focus areas to understand where change is happening.
          </p>
        </header>
      </div>
      <ProgramsHubClient programs={programs} />
    </>
  );
}
