import type { Metadata } from "next";

import { HeroBanner } from "@/features/home/components/HeroBanner";
import { ImpactCounters } from "@/features/home/components/ImpactCounters";
import { JoinCTA } from "@/features/home/components/JoinCTA";
import { NewsPreview } from "@/features/home/components/NewsPreview";
import { ProgramsPreview } from "@/features/home/components/ProgramsPreview";
import { WhatIsPSZ } from "@/features/home/components/WhatIsPSZ";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/services/getArticles";
import { getImpactStats } from "@/lib/services/getImpactStats";
import { getPrograms } from "@/lib/services/getPrograms";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover PakSarZameen's mission, core programs, impact metrics, and latest field updates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PakSarZameen | Building Community Wealth",
    description:
      "Explore the PSZ mission platform featuring programs, measurable impact, and community stories.",
    url: siteConfig.siteUrl,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen homepage hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSarZameen | Building Community Wealth",
    description:
      "Explore the PSZ mission platform featuring programs, measurable impact, and community stories.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default async function HomePage() {
  const [programs, impactStats, articles] = await Promise.all([
    getPrograms(),
    getImpactStats(),
    getArticles(),
  ]);

  const featuredPrograms = programs.slice(0, 4);
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      <HeroBanner />
      <WhatIsPSZ />
      <ProgramsPreview programs={featuredPrograms} />
      <ImpactCounters stats={impactStats} />
      <JoinCTA />
      <NewsPreview articles={latestArticles} />
    </>
  );
}
