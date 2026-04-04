import type { Metadata } from "next";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ProgramsHubClient } from "@/features/programs/components/ProgramsHubClient";
import { getPrograms } from "@/lib/services/getPrograms";
import { PROGRAM_CARDS } from "@/features/home/home.content";

import styles from "./ProgramsPage.module.css";

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
  const heroPrograms = programs.slice(0, 5);

  function getProgramLogoIndex(programTitle: string): number {
    const programCard = PROGRAM_CARDS.find(
      (card) => card.name.toLowerCase() === programTitle.toLowerCase(),
    );
    return programCard ? PROGRAM_CARDS.indexOf(programCard) : 0;
  }

  return (
    <section className={styles.page}>
      <div className={styles.heroWrap}>
        <header className={styles.heroContent}>
          <p className={styles.eyebrow}>Programs Hub</p>
          <h1 className={styles.title}>
            PakSarZameen Projects And Programs
          </h1>
          <p className={styles.description}>
            Explore our community development programs in education, health,
            environmental action, animal welfare, women empowerment, and social
            care. Filter by category and follow the areas where PSZ is working
            on the ground.
          </p>
        </header>

        <div className={styles.heroCards} aria-hidden="true">
          {heroPrograms.map((program, index) => (
            <article
              key={program.id}
              className={`${styles.heroCard} ${styles[`tone${(index % 5) + 1}` as const]}`}
            >
              <div className={styles.heroCardImageWrap}>
                <Image
                  src={`/images/placeholders/${10 + getProgramLogoIndex(program.title)}.png`}
                  alt=""
                  fill
                  sizes="220px"
                  className={styles.heroCardImage}
                />
              </div>
              <div className={styles.heroCardText}>
                <p>{program.title}</p>
                <span>{program.category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProgramsHubClient programs={programs} />
    </section>
  );
}
