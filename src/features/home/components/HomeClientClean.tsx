"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import type { ImpactStat } from "@/lib/models/ImpactStat";
import type { Program } from "@/lib/models/Program";
import {
  PROGRAM_CARDS,
  PSZ_CHAPTERS,
  HEART_MEMBERS,
  joinContent,
  missionCards,
  storiesContent,
} from "@/features/home/home.content";

import styles from "./HomeClient.module.css";

type HomeClientCleanProps = {
  impactStats: ImpactStat[];
  programs: Program[];
};

function AnimatedNumber({ value, isActive }: { value: number; isActive: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const durationMs = 900;
    const start = performance.now();
    let rafId = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / durationMs, 1);
      setDisplayValue(Math.round(value * progress));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isActive, value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

const VERTICAL_CAROUSEL_IMAGES = [
  "/images/full_team.jpeg",
  "/images/grid.jpeg",
  "/images/WhatsApp Image 2026-03-06 at 4.03.34 PM.jpeg",
  "/images/WhatsApp Image 2026-03-06 at 4.20.53 PM.jpeg",
  "/images/WhatsApp Image 2026-03-06 at 5.08.52 AM.jpeg",
] as const;

const LEGACY_HOME_VIDEOS = [
  {
    src: "/videos/hero_video.webm",
    poster: "/videos/posters/hero-video-poster.webp",
  },
  {
    src: "/videos/banner.webm",
    poster: "/videos/posters/banner-poster.webp",
  },
  {
    src: "/videos/Info.webm",
    poster: "/videos/posters/info-poster.webp",
  },
  {
    src: "/videos/programs.webm",
    poster: "/videos/posters/programs-poster.webp",
  },
] as const;

function getProgramLogoPath(programTitle: string): string {
  const normalized = programTitle.trim().toLowerCase();
  const index = PROGRAM_CARDS.findIndex((card) => card.name.toLowerCase() === normalized);

  return `/images/placeholders/${10 + (index >= 0 ? index : 0)}.png`;
}

function getProgramVisuals(program: Program): { logo: string; illustration: string } {
  const title = program.title.toLowerCase();
  const category = program.category.toLowerCase();

  // Prefer direct title mapping so each service has a stable visual identity.
  if (title.includes("mahkma") || title.includes("shajarkari")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Save the Earth-bro.svg",
    };
  }
  if (title.includes("ehsas") || title.includes("haiwanat")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Cat and dog-cuate.svg",
    };
  }
  if (title.includes("room zia")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Volunteering-pana.svg",
    };
  }
  if (title.includes("dar ul aloom") || title.includes("aloom")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Volunteering-amico.svg",
    };
  }
  if (title.includes("tibi") || title.includes("imdad")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Ambulance-bro.svg",
    };
  }
  if (title.includes("wajood") || title.includes("zan")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Volunteering-cuate.svg",
    };
  }

  if (category.includes("health")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Ambulance-bro.svg",
    };
  }
  if (category.includes("animal")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/animals floating with balloons-amico.svg",
    };
  }
  if (category.includes("environment")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Save the Earth-bro.svg",
    };
  }
  if (category.includes("women")) {
    return {
      logo: getProgramLogoPath(program.title),
      illustration: "/images/svgs/Volunteering-cuate.svg",
    };
  }

  return {
    logo: getProgramLogoPath(program.title),
    illustration: "/images/svgs/Volunteering-amico.svg",
  };
}

export function HomeClientClean({ impactStats, programs }: HomeClientCleanProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const featuredPrograms = useMemo(() => programs.slice(0, 6), [programs]);
  const teamMembers = useMemo(
    () => HEART_MEMBERS.filter((member) => !member.image.toLowerCase().includes("cover")),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const revealItems = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const statsNode = statsRef.current;
    if (!statsNode) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.36,
      }
    );

    observer.observe(statsNode);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.homePage}>
      <header className={styles.hero}>
        <div className={styles.heroArt} data-reveal>
          <div className={`${styles.heroSvgLayer} ${styles.heroSvgPrimary}`}>
            <Image
              src="/images/svgs/Volunteering-amico.svg"
              alt="Volunteers working together"
              fill
              priority
              sizes="(max-width: 768px) 46vw, 22vw"
            />
          </div>
          <div className={`${styles.heroSvgLayer} ${styles.heroSvgTop}`}>
            <Image
              src="/images/svgs/Save the Earth-bro.svg"
              alt="Environmental action"
              fill
              sizes="(max-width: 768px) 30vw, 14vw"
            />
          </div>
          <div className={`${styles.heroSvgLayer} ${styles.heroSvgRight}`}>
            <Image
              src="/images/svgs/Blood donation-rafiki.svg"
              alt="Health outreach"
              fill
              sizes="(max-width: 768px) 28vw, 13vw"
            />
          </div>
          <div className={`${styles.heroSvgLayer} ${styles.heroSvgBottom}`}>
            <Image
              src="/images/svgs/animals floating with balloons-amico.svg"
              alt="Animal welfare"
              fill
              sizes="(max-width: 768px) 30vw, 14vw"
            />
          </div>
          <div className={`${styles.heroSvgLayer} ${styles.heroSvgLeft}`}>
            <Image
              src="/images/svgs/Women's Day protest-bro.svg"
              alt="Women empowerment"
              fill
              sizes="(max-width: 768px) 26vw, 12vw"
            />
          </div>
        </div>
        <div className={styles.heroContent} data-reveal>
          <p className={styles.kicker}>تربیت سے تعلیم</p>
          <h1>Nurturing Character Through Education</h1>
          <p className={styles.urduSupport}>پاکستان میں تعلیم، صحت اور فلاحی خدمات کے لیے</p>
          <p>
            PakSarZameen builds practical support systems through education, health outreach,
            blood coordination, environmental action, and local volunteer networks.
          </p>
          <div className={styles.heroActions}>
            <Link href="/get-involved" className={styles.primaryButton}>
              Join the Mission
            </Link>
            <Link href="/programs" className={styles.secondaryButton}>
              Explore Programs
            </Link>
          </div>
        </div>
        <div className={styles.gwrInline} aria-labelledby="home-gwr-inline" data-reveal>
          <div className={styles.gwrInlineMedia}>
            <video
              className={styles.gwrVideo}
              controls
              preload="metadata"
              playsInline
              poster="/videos/posters/programs-poster.webp"
            >
              <source src="/videos/GWR.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.gwrInlineContent}>
            <p className={styles.sectionEyebrow}>Guinness World Record</p>
            <h2 id="home-gwr-inline">Guinness World Record — community cleanup</h2>
            <Link href="/impact/environmental/gwr" className={styles.primaryButton}>
              Watch the Story
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.founderSection} aria-labelledby="founder-message" data-reveal>
        <div className={styles.founderBackdrop}>
          <Image
            src="/paksarzameen_logo.png"
            alt="PakSarZameen logo backdrop"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.founderOverlay} />
        <div className={styles.founderContentShell}>
          <div className={styles.founderPortraitWrap}>
            <div className={styles.founderPortraitLogoBackdrop} aria-hidden>
              <Image
                src="/paksarzameen_logo.png"
                alt=""
                fill
                sizes="(max-width: 768px) 42vw, 18rem"
              />
            </div>
            <Image
              src="/images/founder.png"
              alt="Abdullah Tanseer"
              fill
              sizes="(max-width: 768px) 42vw, 18rem"
              className={styles.founderPortraitPhoto}
            />
          </div>
          <div className={styles.founderNarrative}>
            <p className={styles.founderEyebrow}>Founder&apos;s Message</p>
            <h2 id="founder-message" className={styles.founderTitle}>Abdullah Tanseer</h2>
            <p className={styles.founderMessage}>
              Community service is not an occasional project for us. It is a long-term promise to
              stand with people through education, healthcare support, and dignified relief.
              PakSarZameen is built on consistent local action that helps neighborhoods become
              stronger, safer, and more hopeful.
            </p>
            <p className={styles.founderSignature}>PakSarZameen Foundation</p>
          </div>
        </div>
      </section>

      

      <section className={styles.aboutSection} aria-labelledby="home-about-heading">
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Adopt a pet-amico.svg"
              alt="Community support illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>About PakSarZameen</p>
          <h2 id="home-about-heading">A calm and practical model for social impact</h2>
        </div>
        <div className={styles.aboutGrid}>
          {missionCards.map((card) => (
            <article key={card.title} className={styles.aboutCard} data-reveal>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.verticalCarouselSection}
        aria-label="Community photo highlights"
        data-reveal
      >
        <div className={styles.verticalCarouselViewport}>
          <div className={styles.verticalCarouselTrack}>
            {[...VERTICAL_CAROUSEL_IMAGES, ...VERTICAL_CAROUSEL_IMAGES].map((imageSrc, index) => (
              <article key={`${imageSrc}-${index}`} className={styles.verticalCarouselItem}>
                <Image
                  src={imageSrc}
                  alt={`PakSarZameen community photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 88vw, 72vw"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={statsRef}
        className={styles.impactSection}
        aria-labelledby="home-impact-heading"
      >
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Blood donation-cuate.svg"
              alt="Impact and support illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Impact Snapshot</p>
          <h2 id="home-impact-heading">Measured progress, delivered with consistency</h2>
        </div>
        <div className={styles.statsGrid}>
          {impactStats.map((stat) => (
            <article key={stat.id} className={styles.statCard} data-reveal>
              <p className={styles.statValue}>
                <AnimatedNumber value={stat.value} isActive={statsVisible} />
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gwrSection} aria-labelledby="home-gwr-heading" data-reveal>
        <div className={styles.gwrMediaFrame}>
          <video
            className={styles.gwrVideo}
            controls
            preload="metadata"
            playsInline
            poster="/videos/posters/programs-poster.webp"
          >
            <source src="/videos/GWR.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.gwrContent}>
          <p className={styles.sectionEyebrow}>Guinness World Recorder</p>
          <h2 id="home-gwr-heading">Guinness World Recorder</h2>
          <p>
            Explore the Guinness World Record story and see how community-led environmental action
            reached global recognition.
          </p>
          <Link href="/impact/environmental/gwr" className={styles.primaryButton}>
            View Full Story
          </Link>
        </div>
      </section>

      <section className={styles.videoCarouselSection} aria-labelledby="home-video-carousel" data-reveal>
        <div className={styles.sectionIntro}>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Blood donation-amico.svg"
              alt="Video highlights illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Video Highlights</p>
          <h2 id="home-video-carousel">Community Video Gallery</h2>
        </div>

        <div className={styles.videoCarouselTrack}>
          {LEGACY_HOME_VIDEOS.map((video) => (
            <article key={video.src} className={styles.videoCarouselCard}>
              <div className={styles.videoFrame}>
                <video
                  className={styles.videoElement}
                  autoPlay
                  muted
                  loop
                  controls
                  preload="metadata"
                  poster={video.poster}
                  playsInline
                >
                  <source src={video.src} type="video/webm" />
                </video>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.chaptersSection} aria-labelledby="home-chapters-heading">
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Volunteering-cuate.svg"
              alt="Chapters network illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Our Chapters</p>
          <h2 id="home-chapters-heading">City chapters driving local action across Pakistan</h2>
        </div>

        <div className={styles.chaptersGrid}>
          {PSZ_CHAPTERS.map((chapter) => (
            <article key={chapter.city} className={styles.chapterCard} data-reveal>
              <span className={styles.chapterAccent} style={{ background: chapter.accent }} aria-hidden />
              <div className={styles.chapterMeta}>
                <p className={styles.chapterCity}>{chapter.city}</p>
                <p className={styles.chapterTagline}>{chapter.tagline}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.programSection} aria-labelledby="home-program-heading">
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Water drop-bro.svg"
              alt="Programs and services illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Programs and Services</p>
          <h2 id="home-program-heading">Focused interventions across urgent social priorities</h2>
        </div>
        <div className={styles.programGrid}>
          {featuredPrograms.map((program) => (
            <article key={program.id} className={styles.programCard} data-reveal>
              <div className={styles.programLogoRow}>
                <div className={styles.programLogoWrap}>
                    <Image
                      src={getProgramVisuals(program).logo}
                      alt={`${program.title} logo`}
                      fill
                      sizes="6.8rem"
                    />
                </div>
                <p className={styles.programCategory}>{program.category}</p>
              </div>
              <div className={styles.programArtWrap}>
                <Image
                  src={getProgramVisuals(program).illustration}
                  alt={`${program.title} illustration`}
                  fill
                  sizes="(max-width: 768px) 84vw, (max-width: 1100px) 42vw, 28vw"
                />
              </div>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <Link href={`/programs/${program.slug}`} className={styles.programLink}>
                View program details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.donateSection} aria-labelledby="home-donate-heading" data-reveal>
        <div className={styles.donateArt}>
          <Image
            src="/images/svgs/Humanitarian Help-bro.svg"
            alt="Humanitarian collaboration"
            fill
            sizes="(max-width: 768px) 80vw, 34vw"
          />
        </div>
        <div className={styles.donateContent}>
          <p className={styles.sectionEyebrow}>Support The Mission</p>
          <h2 id="home-donate-heading">Contribute where your support can move fastest</h2>
          <p>{joinContent.text}</p>
          <div className={styles.heroActions}>
            <Link href="/get-involved" className={styles.primaryButton}>
              {joinContent.volunteerCta}
            </Link>
            <Link href="/blood-bank" className={styles.secondaryButton}>
              24/7 Blood Support
            </Link>
          </div>
          <p className={styles.emergencyNote}>
            Emergency coordinators: {siteConfig.emergencyContacts[0]?.name} and {siteConfig.emergencyContacts[1]?.name}
          </p>
        </div>
      </section>

      <section className={styles.testimonialsSection} aria-labelledby="home-testimonials-heading">
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Blood donation-amico.svg"
              alt="Community voices illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Community Voices</p>
          <h2 id="home-testimonials-heading">How people describe working with PSZ</h2>
        </div>
        <div className={styles.testimonialTrack} data-reveal>
          {storiesContent.map((story) => (
            <article key={story.id} className={styles.testimonialCard}>
              <p className={styles.quote}>{story.quote}</p>
              <p className={styles.author}>{story.author}</p>
              <p className={styles.role}>{story.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.teamSection} aria-labelledby="home-team-heading">
        <div className={styles.sectionIntro} data-reveal>
          <div className={styles.sectionIconWrap}>
            <Image
              src="/images/svgs/Blood donation-rafiki.svg"
              alt="Team collaboration illustration"
              fill
              sizes="3.8rem"
            />
          </div>
          <p className={styles.sectionEyebrow}>Heart of PakSarZameen</p>
          <h2 id="home-team-heading">People behind daily execution and care</h2>
        </div>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <article key={`${member.image}-${index}`} className={styles.teamCard} data-reveal>
              <Image
                src={member.image}
                alt={`PakSarZameen team member ${index + 1}`}
                fill
                sizes="(max-width: 768px) 44vw, (max-width: 1100px) 26vw, 16vw"
                className={styles.teamImage}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
