import Link from "next/link";
import Image from "next/image";

import type { Program } from "@/lib/models/Program";
import { PSZ_CHAPTERS, missionCards } from "@/features/home/home.content";
import { HomeHeroCarousel } from "@/features/home/components/HomeHeroCarousel";

import styles from "./HomeClientClean.module.css";

type HomeClientCleanProps = {
  programs: Program[];
};

const HOME_METRICS = [
  { value: "50,000+", label: "Lives impacted" },
  { value: "120+", label: "Schools powered" },
  { value: "15,000+", label: "Medical consultations" },
  { value: "3,000+", label: "Families empowered" },
] as const;

const HERO_MEDIA_IMAGES = [
  {
    src: "/images/WhatsApp%20Image%202026-03-06%20at%205.08.52%20AM.jpeg",
    alt: "PakSarZameen community field moment",
    eyebrow: "CEO & Founder",
    title: "Abdullah Tanseer",
    position: "center 38%",
  },
  {
    src: "/images/WhatsApp%20Image%202026-03-06%20at%204.03.34%20PM.jpeg",
    alt: "PakSarZameen team and outreach moment",
    eyebrow: "Guinness World Record",
    title: "Holder",
    position: "center 62%",
  },
] as const;

const PROGRAM_LOGOS: Readonly<Record<string, string>> = {
  "mahkma-shajarkari": "/images/optimized/placeholders/10-md.webp",
  "ehsas-ul-haiwanat": "/images/optimized/placeholders/11-md.webp",
  "room-zia": "/images/optimized/placeholders/12-md.webp",
  "dar-ul-aloom": "/images/optimized/placeholders/14-md.webp",
  "tibi-imdad": "/images/optimized/placeholders/13-md.webp",
  "wajood-e-zan": "/images/optimized/placeholders/15-md.webp",
};

export function HomeClientClean({ programs }: HomeClientCleanProps) {
  const featuredPrograms = programs.slice(0, 6);

  return (
    <div className={styles.page}>
      <HomeHeroCarousel />

      <section className={styles.mediaShowcaseSection} aria-label="PakSarZameen featured media">
        <div className={styles.mediaPair}>
          {HERO_MEDIA_IMAGES.map((image) => (
            <figure key={image.src} className={styles.mediaTile}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                className={styles.mediaTileImage}
                style={{ objectPosition: image.position }}
                priority
              />
              <figcaption className={styles.mediaCaption}>
                <p className={styles.mediaCaptionEyebrow}>{image.eyebrow}</p>
                <h2 className={styles.mediaCaptionTitle}>{image.title}</h2>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.mediaVideoIntro}>
          <p className={styles.mediaVideoEyebrow}>Core Team 2026</p>
        </div>

        <div className={styles.mediaVideoFrame}>
          <video
            className={styles.mediaVideo}
            src="/images/members/IMG_6394.MP4"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        </div>
      </section>

      <section className={styles.metricBand} aria-label="PakSarZameen headline metrics">
        {HOME_METRICS.map((metric) => (
          <article key={metric.label} className={styles.metricCard}>
            <p className={styles.metricValue}>{metric.value}</p>
            <p className={styles.metricLabel}>{metric.label}</p>
          </article>
        ))}
      </section>

      <section className={styles.editorialSection} aria-labelledby="home-about-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>About PakSarZameen</p>
          <h2 id="home-about-heading" className={styles.sectionTitle}>
            Practical community work, built to last.
          </h2>
        </div>

        <div className={styles.editorialGrid}>
          <div className={styles.editorialCopy}>
            <div className={styles.missionGrid}>
              {missionCards.map((card) => (
                <article key={card.title} className={styles.missionCard}>
                  <h3>{card.title}</h3>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.editorialMedia}>
            <Image
              src="/images/optimized/grid.webp"
              alt="PakSarZameen community moments across events and outreach"
              fill
              sizes="(max-width: 960px) 100vw, 48vw"
              className={styles.sectionImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.programSection} aria-labelledby="home-programs-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Programs</p>
          <h2 id="home-programs-heading" className={styles.sectionTitle}>
            Programs built around urgent community needs.
          </h2>
        </div>

        <div className={styles.programGrid}>
          {featuredPrograms.map((program) => (
            <article key={program.id} className={styles.programCard}>
              {PROGRAM_LOGOS[program.slug] ? (
                <div className={styles.programLogoWrap}>
                  <Image
                    src={PROGRAM_LOGOS[program.slug]}
                    alt={`${program.title} program logo`}
                    width={96}
                    height={96}
                    className={styles.programLogo}
                  />
                </div>
              ) : null}
              <p className={styles.programCategory}>{program.category}</p>
              <h3>{program.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.featureSection} aria-labelledby="home-feature-heading">
        <div className={styles.featureMedia}>
          <Image
            src="/images/optimized/whatsapp-image-2026-03-06-at-4-03-34-pm.webp"
            alt="PakSarZameen team receiving recognition for environmental action"
            fill
            sizes="(max-width: 960px) 100vw, 48vw"
            className={styles.sectionImage}
          />
        </div>

        <div className={styles.featureCopy}>
          <p className={styles.sectionEyebrow}>Impact Story</p>
          <h2 id="home-feature-heading" className={styles.sectionTitle}>
            Recognition matters when it comes from real work.
          </h2>

          <Link href="/impact/environmental/gwr" className={styles.primaryButton}>
            Read The Record Story
          </Link>
        </div>
      </section>

      <section className={styles.chapterSection} aria-labelledby="home-chapters-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Chapters</p>
          <h2 id="home-chapters-heading" className={styles.sectionTitle}>
            Local chapters, city by city.
          </h2>
        </div>

        <div className={styles.chapterGrid}>
          {PSZ_CHAPTERS.map((chapter) => (
            <article key={chapter.city} className={styles.chapterCard}>
              <h3>{chapter.city}</h3>
              <p>{chapter.tagline}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
