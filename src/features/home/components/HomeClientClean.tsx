import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import type { Program } from "@/lib/models/Program";
import { PSZ_CHAPTERS, joinContent, missionCards, storiesContent } from "@/features/home/home.content";
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

const IMPACT_NOTES = [
  "120+ schools supported.",
  "15,000+ consultations delivered.",
  "15 districts reached in 2024.",
  "12,000 families supported after flooding.",
] as const;

export function HomeClientClean({ programs }: HomeClientCleanProps) {
  const featuredPrograms = programs.slice(0, 6);

  return (
    <div className={styles.page}>
      <HomeHeroCarousel />

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
            <p className={styles.sectionLead}>
              PakSarZameen pairs local leadership with steady field work across education, health,
              welfare, and climate action.
            </p>

            <div className={styles.missionGrid}>
              {missionCards.map((card) => (
                <article key={card.title} className={styles.missionCard}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
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
          {featuredPrograms.map((program, index) => (
            <article key={program.id} className={styles.programCard}>
              <p className={styles.programIndex}>{String(index + 1).padStart(2, "0")}</p>
              <p className={styles.programCategory}>{program.category}</p>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <Link href={`/programs/${program.slug}`} className={styles.textLink}>
                View program details
              </Link>
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
          <p className={styles.sectionLead}>
            The Guinness World Records milestone showed what volunteer discipline can do at scale.
          </p>

          <ul className={styles.noteList}>
            {IMPACT_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

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
          {PSZ_CHAPTERS.map((chapter, index) => (
            <article key={chapter.city} className={styles.chapterCard}>
              <p className={styles.chapterIndex}>{String(index + 1).padStart(2, "0")}</p>
              <h3>{chapter.city}</h3>
              <p>{chapter.tagline}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.voiceSection} aria-labelledby="home-voices-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Community Voices</p>
          <h2 id="home-voices-heading" className={styles.sectionTitle}>
            What people say about PSZ.
          </h2>
        </div>

        <div className={styles.quoteGrid}>
          {storiesContent.map((story) => (
            <blockquote key={story.id} className={styles.quoteCard}>
              <p className={styles.quoteText}>{story.quote}</p>
              <footer className={styles.quoteMeta}>
                <span>{story.author}</span>
                <span>{story.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="home-cta-heading">
        <div className={styles.ctaCopy}>
          <p className={styles.inverseEyebrow}>Get Involved</p>
          <h2 id="home-cta-heading" className={styles.inverseTitle}>
            Back work that moves on the ground.
          </h2>
          <p className={styles.inverseText}>{joinContent.text}</p>
        </div>

        <div className={styles.ctaPanel}>
          <p className={styles.ctaLabel}>Emergency coordinators</p>
          <div className={styles.ctaContacts}>
            {siteConfig.emergencyContacts.map((contact) => (
              <a key={contact.phone} href={`tel:${contact.phone}`} className={styles.contactLink}>
                <span>{contact.name}</span>
                <span>{contact.phone}</span>
              </a>
            ))}
          </div>

          <div className={styles.ctaActions}>
            <Link href="/get-involved" className={styles.inversePrimaryButton}>
              {joinContent.volunteerCta}
            </Link>
            <Link href="/contact" className={styles.inverseSecondaryButton}>
              Contact The Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
