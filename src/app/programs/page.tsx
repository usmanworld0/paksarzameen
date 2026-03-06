import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { ProgramsHubClient } from "@/features/programs/components/ProgramsHubClient";
import { getPrograms } from "@/lib/services/getPrograms";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore PakSarZameen programs across environmental care, education, health, welfare, and empowerment.",
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Programs | PakSarZameen",
    description:
      "Discover all PSZ departments and initiatives with category filters and searchable previews.",
    url: `${siteConfig.siteUrl}/programs`,
    type: "website",
    images: [
      {
        url: "/images/placeholders/10.png",
        width: 1200,
        height: 800,
        alt: "Programs hub preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programs | PakSarZameen",
    description:
      "Discover all PSZ departments and initiatives with category filters and searchable previews.",
    images: ["/images/placeholders/10.png"],
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <header className="mx-auto w-full max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          Programs Hub
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight tracking-tight gradient-text sm:text-6xl">
          Departments Building Impact Across Communities
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-psz-gray-400 sm:text-lg">
          Browse all core PSZ initiatives, filter by category, and search for
          specific focus areas to understand where change is happening.
        </p>
      </header>
      <ProgramsHubClient programs={programs} />
    </>
  );
}
