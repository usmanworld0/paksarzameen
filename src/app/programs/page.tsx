import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { ProgramsHubClient } from "@/features/programs/components/ProgramsHubClient";
import { getPrograms } from "@/lib/services/getPrograms";

export const metadata: Metadata = {
  title: "Programs: Education, Health, Environment And Welfare",
  description:
    "Explore PakSarZameen programs across education, health, environmental action, animal welfare, women empowerment, and community support in Pakistan.",
  keywords: [
    ...siteConfig.seo.keywords,
    "programs pakistan",
    "community development programs pakistan",
    "education health environment welfare",
  ],
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Programs | PakSarZameen Community Development Work",
    description:
      "Browse PakSarZameen's education, health, environment, women empowerment, and welfare programs with searchable previews.",
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
    title: "Programs | PakSarZameen Community Development Work",
    description:
      "Browse PakSarZameen's education, health, environment, women empowerment, and welfare programs with searchable previews.",
    images: ["/images/placeholders/10.png"],
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <div className="programs-hero-section">
        <div className="programs-hero-overlay" />
        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
            Programs Hub
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            PakSarZameen Projects And Programs
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-100 sm:text-base lg:max-w-3xl lg:text-lg">
            Explore our community development programs in education, health,
            environmental action, animal welfare, women empowerment, and social
            care. Filter by category and follow the areas where PSZ is working
            on the ground.
          </p>
        </header>
      </div>
      <ProgramsHubClient programs={programs} />
    </>
  );
}
