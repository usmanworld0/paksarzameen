"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import styles from "./HomeClientClean.module.css";

type HeroSlide = {
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  video: {
    src: string;
    poster: string;
    type: string;
  };
};

const HERO_SLIDES: readonly HeroSlide[] = [
  {
    title: "Act On Ground",
    description: "Volunteer-led work driven by urgency and local trust.",
    primaryCta: {
      label: "Explore Programs",
      href: "/programs",
    },
    secondaryCta: {
      label: "Watch Impact",
      href: "/impact",
    },
    video: {
      src: "/videos/hero_video.webm",
      poster: "/videos/posters/hero-video-poster.webp",
      type: "video/webm",
    },
  },
  {
    title: "Move For Health",
    description: "Blood response and outreach for real communities.",
    primaryCta: {
      label: "Open Blood Support",
      href: "/healthcare/blood-bank",
    },
    secondaryCta: {
      label: "Get Involved",
      href: "/get-involved",
    },
    video: {
      src: "/videos/Info.webm",
      poster: "/videos/posters/info-poster.webp",
      type: "video/webm",
    },
  },
  {
    title: "Build Futures",
    description: "Education, welfare, and climate work that stays close to the ground.",
    primaryCta: {
      label: "See Programs",
      href: "/programs",
    },
    secondaryCta: {
      label: "Read The Story",
      href: "/impact/environmental/gwr",
    },
    video: {
      src: "/videos/programs.webm",
      poster: "/videos/posters/programs-poster.webp",
      type: "video/webm",
    },
  },
  {
    title: "Show Up Ready",
    description: "A community network built to respond with speed and care.",
    primaryCta: {
      label: "Join The Mission",
      href: "/get-involved",
    },
    secondaryCta: {
      label: "Contact Team",
      href: "/contact",
    },
    video: {
      src: "/videos/banner.webm",
      poster: "/videos/posters/banner-poster.webp",
      type: "video/webm",
    },
  },
] as const;

export function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const previousIndexRef = useRef(0);

  const activeSlide = HERO_SLIDES[activeIndex];

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index === activeIndex) {
        if (previousIndexRef.current !== activeIndex) {
          video.currentTime = 0;
        }

        if (isPaused) {
          video.pause();
        } else {
          void video.play().catch(() => {});
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
    previousIndexRef.current = activeIndex;
  }, [activeIndex, isPaused]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const togglePaused = () => {
    setIsPaused((current) => !current);
  };

  return (
    <section className={styles.hero} aria-labelledby="home-hero-heading">
      <div className={styles.heroTrack}>
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.title}
            className={`${styles.heroSlide} ${index === activeIndex ? styles.heroSlideActive : ""}`}
            aria-hidden={index !== activeIndex}
          >
            <video
              ref={(node) => {
                videoRefs.current[index] = node;
              }}
              className={styles.heroVideo}
              poster={slide.video.poster}
              muted
              playsInline
              preload={index === activeIndex ? "auto" : "metadata"}
              onEnded={goToNext}
            >
              <source src={slide.video.src} type={slide.video.type} />
            </video>
            <div className={styles.heroScrim} aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className={styles.heroCenter}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>PakSarZameen</p>
          <h1 id="home-hero-heading" className={styles.heroTitle}>
            {activeSlide.title}
          </h1>
          <p className={styles.heroText}>{activeSlide.description}</p>

          <div className={styles.heroActions}>
            <Link href={activeSlide.primaryCta.href} className={styles.heroPrimaryButton}>
              {activeSlide.primaryCta.label}
            </Link>
            <Link href={activeSlide.secondaryCta.href} className={styles.heroSecondaryButton}>
              {activeSlide.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.heroDots} aria-label="Hero carousel slides">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to hero slide ${index + 1}`}
            aria-pressed={index === activeIndex}
            className={`${styles.heroDot} ${index === activeIndex ? styles.heroDotActive : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className={styles.heroControls}>
        <button
          type="button"
          className={styles.heroControlButton}
          aria-label={isPaused ? "Play hero carousel" : "Pause hero carousel"}
          onClick={togglePaused}
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </button>
        <button
          type="button"
          className={styles.heroControlButton}
          aria-label="Previous hero slide"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={styles.heroControlButton}
          aria-label="Next hero slide"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
