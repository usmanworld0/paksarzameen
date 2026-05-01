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
  const categoryCount = new Set(programs.map((program) => program.category)).size;

  return (
    <main className="site-page">
      <section className="site-hero">
        <div className="site-hero__noise" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--left" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--right" aria-hidden="true" />

        <header className="site-hero__inner">
          <p className="site-hero__eyebrow">Programs</p>
          <h1 className="site-hero__title">Programs.</h1>
          <p className="site-hero__body">
            Explore PSZ work across education, health, welfare, and climate action.
          </p>
          <div className="site-hero__chips">
            <span className="site-chip">{programs.length} active listings</span>
            <span className="site-chip">{categoryCount} focus areas</span>
          </div>
        </header>
      </section>

      <ProgramsHubClient programs={programs} />
    </main>
  );
}
