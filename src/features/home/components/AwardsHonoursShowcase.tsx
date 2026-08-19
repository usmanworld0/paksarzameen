"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Volume2, VolumeX } from "lucide-react";
import styles from "./AwardsHonoursShowcase.module.css";
import homeStyles from "./HomeClient.module.css";

export interface AwardItem {
  id: string;
  tag: string;
  badgeTitle: string;
  title: string;
  description: string;
  mediaType: "video" | "image";
  videoSrc?: string;
  imageSrc: string;
  stats: { label: string; value: string }[];
  link: string;
}

const AWARDS_DATA: AwardItem[] = [
  {
    id: "takmeel-gwr",
    tag: "World Record",
    badgeTitle: "Guinness World Records™",
    title: "Guinness World Record — Takmeel Sapling Formation",
    description:
      "Certified by Guinness World Records for creating the world's largest word formation using 3,296 indigenous saplings over 1,200 sq. ft. in Bahawalpur in collaboration with Takmeel Square.",
    mediaType: "video",
    videoSrc: "/images/impact/GWR/Takmeel - Largest saplings word.mp4",
    imageSrc: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.27.29 AM.jpeg",
    stats: [
      { label: "Saplings", value: "3,296" },
      { label: "Area", value: "1,200 sq ft" },
      { label: "Location", value: "Bahawalpur" },
    ],
    link: "/impact/environmental/gwr",
  },
  {
    id: "saplings-24h",
    tag: "World Record",
    badgeTitle: "Guinness World Records™",
    title: "95,000 Saplings in 24 Hours",
    description:
      "Entered The Guinness Book of World Records by distributing and planting 95,000 native saplings in a historic 24-hour civic campaign across 13 city hubs in Bahawalpur.",
    mediaType: "video",
    videoSrc: "/images/impact/GWR/Largest donation of saplings in 24 hours - Documentary 4k fixed.mp4",
    imageSrc: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.26.46 AM.jpeg",
    stats: [
      { label: "Planted", value: "95,000" },
      { label: "Timeframe", value: "24 Hours" },
      { label: "Points", value: "13 Hubs" },
    ],
    link: "/news/bahawalpur-world-record-tree-plantation",
  },
  {
    id: "climate-leadership",
    tag: "National Honor",
    badgeTitle: "Global Climate Forum",
    title: "Youth Climate & Environmental Leadership",
    description:
      "Official recognition for pioneering grassroots climate action through COP in My City, LCOY delegations, and regional urban greening empowering youth across Pakistan.",
    mediaType: "image",
    imageSrc: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.26.30 AM.jpeg",
    stats: [
      { label: "Youth", value: "1,200+ Leaders" },
      { label: "Scope", value: "National" },
      { label: "Focus", value: "COP / LCOY" },
    ],
    link: "/impact/environmental",
  },
];

export function AwardsHonoursShowcase() {
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    "takmeel-gwr": true,
    "saplings-24h": true,
  });

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMutedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="home-awards" className={styles.awardsSection} aria-labelledby="awards-heading">
      {/* Consistent Section Header */}
      <div className={styles.awardsHeader} data-reveal>
        <span className={homeStyles.sectionLabel}>Recognition &amp; Impact</span>
        <h2 id="awards-heading" className={homeStyles.appleSectionHeader}>Awards &amp; Honours</h2>
        <p className={homeStyles.appleSectionDesc}>
          Celebrating grassroots milestones, national recognition, and world records shaped by community dedication across Pakistan.
        </p>
      </div>

      {/* Visual Media Cards Grid */}
      <div className={styles.awardsGrid} data-reveal>
        {AWARDS_DATA.map((item) => (
          <Link key={item.id} href={item.link} className={styles.awardCard}>
            {/* Visual Media Window with Video / Image */}
            <div className={styles.mediaContainer}>
              {item.mediaType === "video" && item.videoSrc ? (
                <>
                  <video
                    src={item.videoSrc}
                    poster={item.imageSrc}
                    autoPlay
                    loop
                    muted={mutedStates[item.id] ?? true}
                    playsInline
                    preload="metadata"
                    className={styles.mediaElement}
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleMute(item.id, e)}
                    className={styles.soundBtn}
                    aria-label={mutedStates[item.id] ? "Unmute video" : "Mute video"}
                    title={mutedStates[item.id] ? "Unmute video" : "Mute video"}
                  >
                    {mutedStates[item.id] ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </>
              ) : (
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 820px) 100vw, 400px"
                  className={styles.mediaElement}
                />
              )}

              <div className={styles.mediaOverlay} />

              {/* Floating Badge */}
              <div className={styles.badgePill}>
                <Award size={12} />
                <span>{item.badgeTitle}</span>
              </div>
            </div>

            {/* Card Information */}
            <div className={styles.cardBody}>
              <div className={styles.tagRow}>
                <span className={styles.categoryTag}>{item.tag}</span>
              </div>

              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>

              {/* Quick stats pills */}
              <div className={styles.statsBar}>
                {item.stats.map((st) => (
                  <div key={st.label} className={styles.statPill}>
                    <span>{st.label}:</span>
                    <strong>{st.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <span className={styles.cardAction}>
              Explore Story &amp; Proof &rarr;
            </span>
          </Link>
        ))}
      </div>

      {/* Section CTA */}
      <div className={styles.awardsFooter} data-reveal>
        <Link href="/impact" className={styles.sectionCtaLink}>
          Explore all awards &amp; impact stories &rarr;
        </Link>
      </div>
    </section>
  );
}
