import { HeroBanner } from "@/features/home/components/HeroBanner";
import { ImpactCounters } from "@/features/home/components/ImpactCounters";
import { JoinCTA } from "@/features/home/components/JoinCTA";
import { NewsPreview } from "@/features/home/components/NewsPreview";
import { ProgramsPreview } from "@/features/home/components/ProgramsPreview";
import { WhatIsPSZ } from "@/features/home/components/WhatIsPSZ";
import { getArticles } from "@/lib/services/getArticles";
import { getImpactStats } from "@/lib/services/getImpactStats";
import { getPrograms } from "@/lib/services/getPrograms";

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
