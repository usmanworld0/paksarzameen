"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import styles from "./NewsPaperShowcase.module.css";

export interface NewsSheetData {
  id: string;
  numeral: string;
  masthead: string;
  subhead: string;
  date: string;
  issue: string;
  kicker: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
  link: string;
  linkLabel: string;
}

const NEWS_SHEETS: NewsSheetData[] = [
  {
    id: "95k-saplings",
    numeral: "95K",
    masthead: "PAKSARZAMEEN",
    subhead: "ENVIRONMENTAL FOUNDATION",
    date: "DECEMBER 2022",
    issue: "THE WORLD RECORD • NO. 01",
    kicker: "ENVIRONMENTAL IMPACT",
    title: "Bahawalpur Sets World Record with 95,000 Saplings Planted in 24 Hours.",
    paragraph1:
      "Bahawalpur's divisional administration entered The Guinness Book of World Records by distributing and planting 95,000 saplings within a single 24-hour period across 13 city hubs in collaboration with university youth.",
    paragraph2:
      "A dedicated verification centre at Government Sadiq Dane High School processed records for Guinness representatives, mobilizing students, educators, and citizens across a nine-mile radius.",
    image: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.26.46 AM.jpeg",
    link: "/news/bahawalpur-world-record-tree-plantation",
    linkLabel: "Read Full Dispatch",
  },
  {
    id: "takmeel-formation",
    numeral: "3,296",
    masthead: "PAKSARZAMEEN",
    subhead: "FEAT OF INGENUITY",
    date: "JULY 2023",
    issue: "SPECIAL BULLETIN • NO. 02",
    kicker: "LIVING WORD FORMATION",
    title: "Young Pakistani Men Set Unique World Record with 3,000+ Saplings.",
    paragraph1:
      "Abdullah Tanseer and Haider Mustafa Qureshi from Bahawalpur created the world's largest planted word formation using 3,296 indigenous saplings to spell out the word 'TAKMEEL' over 1,200 square feet.",
    paragraph2:
      "The project was executed in partnership with Takmeel Square and the Department of Forestry to ensure indigenous biodiversity and environmental permanence.",
    image: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.27.29 AM.jpeg",
    link: "/news/young-pakistani-world-record-sapling-formation",
    linkLabel: "Explore Record Story",
  },
  {
    id: "literature-festival",
    numeral: "2016",
    masthead: "PAKSARZAMEEN",
    subhead: "CULTURE & EDUCATION",
    date: "NOVEMBER 2016",
    issue: "COMMUNITY PRESS • NO. 03",
    kicker: "LITERARY MOVEMENT",
    title: "Children's Literature Festival Promotes Reading & Vibrant Society.",
    paragraph1:
      "Sustainable efforts to promote literature for children are key to building vibrant infrastructure essential for establishing an equality-based society in Bahawalpur.",
    paragraph2:
      "The district administration institutionalized book reading across schools and established a specialized Oxford University Press section at the historic central library.",
    image: "/images/placeholders/14.png",
    link: "/news/childrens-literature-festival-bahawalpur",
    linkLabel: "Read Feature Article",
  },
  {
    id: "tibi-imdad",
    numeral: "2026",
    masthead: "PAKSARZAMEEN",
    subhead: "HEALTHCARE BUREAU",
    date: "FEBRUARY 2026",
    issue: "PUBLIC HEALTH • NO. 04",
    kicker: "PREVENTIVE OUTREACH",
    title: "Tibi Imdad Hosts Preventive Health & Diagnostic Screenings.",
    paragraph1:
      "Local clinicians and volunteers delivered comprehensive blood pressure checks, nutrition guidance, and urgent referrals for follow-up care for underserved families.",
    paragraph2:
      "Operating hand-in-hand with the Regional Blood Center network to ensure 24/7 emergency donor mobilization and compassionate care across South Punjab.",
    image: "/images/WhatsApp Image 2026-03-06 at 5.07.22 AM.jpeg",
    link: "/news/tibi-imdad-preventive-health-outreach",
    linkLabel: "Read Health Report",
  },
  {
    id: "press-archive",
    numeral: "NEWS",
    masthead: "PAKSARZAMEEN",
    subhead: "OFFICIAL PRESS ARCHIVE",
    date: "YEAR 2026",
    issue: "FIELD DISPATCHES • NO. 05",
    kicker: "COMMUNITY NOTICE",
    title: "Explore the Complete Archive of Field Reports & News Dispatches.",
    paragraph1:
      "Every milestone achieved by PakSarZameen is driven by grassroots volunteers, educational alliances, and community trust across Pakistan.",
    paragraph2:
      "Visit our full newsroom to explore all announcements, media coverage, documentary reels, and open opportunities to collaborate with our team.",
    image: "/images/full_team.jpeg",
    link: "/news",
    linkLabel: "Visit Newsroom & Archive",
  },
];

export function NewsPaperShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const sheetsRef = useRef<(HTMLElement | null)[]>([]);

  const goToSheet = useCallback((targetIndex: number) => {
    if (isAnimatingRef.current) return;
    const clampedIndex = Math.max(0, Math.min(NEWS_SHEETS.length - 1, targetIndex));
    if (clampedIndex === activeIndex) return;

    isAnimatingRef.current = true;
    const currentIndex = activeIndex;
    setActiveIndex(clampedIndex);

    if (clampedIndex > currentIndex) {
      // Flip forward: lift and swing top sheets away
      for (let i = currentIndex; i < clampedIndex; i++) {
        const sheet = sheetsRef.current[i];
        if (!sheet) continue;

        const delay = (i - currentIndex) * 0.12;

        gsap.to(sheet, {
          rotateY: -115,
          x: -120,
          y: -20,
          scale: 0.92,
          opacity: 0,
          duration: 0.75,
          ease: "power2.inOut",
          delay,
          onComplete: () => {
            if (i === clampedIndex - 1) {
              isAnimatingRef.current = false;
            }
          },
        });
      }
    } else {
      // Flip back: swing previous sheets back onto the stack
      for (let i = currentIndex - 1; i >= clampedIndex; i--) {
        const sheet = sheetsRef.current[i];
        if (!sheet) continue;

        const delay = (currentIndex - 1 - i) * 0.12;

        gsap.to(sheet, {
          rotateY: 0,
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "power2.inOut",
          delay,
          onComplete: () => {
            if (i === clampedIndex) {
              isAnimatingRef.current = false;
            }
          },
        });
      }
    }
  }, [activeIndex]);

  // Initial set for sheets z-index stack
  useEffect(() => {
    sheetsRef.current.forEach((sheet, idx) => {
      if (!sheet) return;
      gsap.set(sheet, {
        zIndex: NEWS_SHEETS.length - idx,
        rotateY: idx < activeIndex ? -115 : 0,
        x: idx < activeIndex ? -120 : 0,
        opacity: idx < activeIndex ? 0 : 1,
      });
    });
  }, [activeIndex]);

  return (
    <section id="home-news" className={styles.newspaperSection} aria-labelledby="news-heading">
      {/* Section Header */}
      <header className={styles.headerWrap} data-reveal>
        <span className={styles.sectionLabelLight}>Field Updates &amp; Media</span>
        <h2 id="news-heading" className={styles.sectionHeaderLight}>News &amp; Features</h2>
        <p className={styles.sectionDescLight}>
          Browse our printed field broadsheet chronicling world records and grassroots dispatches.
        </p>
      </header>

      {/* 3D Flippable Physical Stack Wrapper */}
      <div className={styles.stackOuterWrapper} data-reveal>
        {/* Left Arrow (Previous Sheet) */}
        <button
          type="button"
          onClick={() => goToSheet(activeIndex - 1)}
          disabled={activeIndex === 0}
          className={styles.sideArrow}
          aria-label="Previous News Sheet"
          title="Previous Sheet"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Physical Newspaper Stage with Underlay Tilted Sheets */}
        <div className={styles.newspaperStage}>
          {/* Tilted Stack Underlay Layers */}
          <div className={`${styles.pileLayer} ${styles.pileLayer1}`} />
          <div className={`${styles.pileLayer} ${styles.pileLayer2}`} />
          <div className={`${styles.pileLayer} ${styles.pileLayer3}`} />

          {/* Interactive Sheets Stack */}
          <div className={styles.sheetsStack}>
            {NEWS_SHEETS.map((item, index) => (
              <article
                key={item.id}
                ref={(el) => { sheetsRef.current[index] = el; }}
                onClick={() => {
                  if (index === activeIndex) {
                    if (activeIndex < NEWS_SHEETS.length - 1) {
                      goToSheet(activeIndex + 1);
                    } else {
                      goToSheet(0);
                    }
                  }
                }}
                className={styles.newspaperSheet}
              >
                {/* Top Masthead & Dateline Bar */}
                <div className={styles.sheetHeader}>
                  <div className={styles.mastheadRow}>
                    <h3 className={styles.mainMasthead}>{item.masthead}</h3>
                    <p className={styles.subMasthead}>{item.subhead}</p>
                  </div>

                  <div className={styles.datelineBar}>
                    <span>{item.date}</span>
                    <span>{item.issue}</span>
                  </div>
                </div>

                {/* Middle Area: Big Numeral + High-Impact Hero Visual */}
                <div className={styles.sheetMiddle}>
                  <span className={styles.bigNumeral}>{item.numeral}</span>
                  <div className={styles.heroVisualFrame}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 820px) 90vw, 680px"
                      className={styles.heroImage}
                    />
                  </div>
                </div>

                {/* Bottom 3-Column Editorial Grid */}
                <div className={styles.sheetBottomColumns}>
                  {/* Column 1: Kicker & Main Headline */}
                  <div className={styles.colLeft}>
                    <span className={styles.colKicker}>{item.kicker}</span>
                    <h4 className={styles.colHeadline}>{item.title}</h4>
                  </div>

                  {/* Column 2: Editorial Paragraph 1 */}
                  <div className={styles.colMiddle}>
                    <p className={styles.colText}>{item.paragraph1}</p>
                  </div>

                  {/* Column 3: Paragraph 2 & Action Link */}
                  <div className={styles.colRight}>
                    <p className={styles.colText}>{item.paragraph2}</p>
                    <Link
                      href={item.link}
                      className={styles.colLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.linkLabel} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Arrow (Next Sheet) */}
        <button
          type="button"
          onClick={() => goToSheet(activeIndex + 1)}
          disabled={activeIndex >= NEWS_SHEETS.length - 1}
          className={styles.sideArrow}
          aria-label="Next News Sheet"
          title="Next Sheet"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Bottom Compact Controls Bar */}
      <footer className={styles.bottomControlsRow} data-reveal>
        <span className={styles.statusLabel}>
          Sheet {activeIndex + 1} of {NEWS_SHEETS.length}: {NEWS_SHEETS[activeIndex].kicker}
        </span>

        <div className={styles.dotsRow}>
          {NEWS_SHEETS.map((item, dotIdx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSheet(dotIdx)}
              className={`${styles.dotBtn} ${activeIndex === dotIdx ? styles.dotBtnActive : ""}`}
              aria-label={`Go to sheet ${dotIdx + 1}`}
            />
          ))}
        </div>

        <Link href="/news" className={styles.archiveLinkPill}>
          All News &rarr;
        </Link>
      </footer>
    </section>
  );
}
