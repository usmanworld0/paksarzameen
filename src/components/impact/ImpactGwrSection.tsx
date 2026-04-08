"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import InstagramEmbed from "@/components/InstagramEmbed";
import styles from "./impact-gwr.module.css";
import { environmentalStories } from "@/content/impact/environmental";

const gwrStory = environmentalStories.environmentalGwr;

export default function ImpactGwrSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const featureVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const videos = [heroVideoRef.current, featureVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    videos.forEach((video) => {
      if (isVisible) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [isVisible]);

  const quickFacts = gwrStory.quickFacts.slice(0, 3);
  const highlights = gwrStory.highlights.slice(0, 3);
  const storyImages = gwrStory.gallery?.slice(0, 4) ?? [];
  const instagramPosts = gwrStory.media?.slice(0, 2) ?? [];
  const storyVideos = [
    {
      src: "/images/impact/GWR/Largest donation of saplings in 24 hours - Documentary 4k fixed.mp4",
      label: "Documentary cut",
      description: "A calm, grounded look at the scale and coordination behind the record.",
      poster: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.27.29 AM.jpeg",
      ref: heroVideoRef,
    },
    {
      src: "/images/impact/GWR/Takmeel - Largest saplings word.mp4",
      label: "Campaign reel",
      description: "A tighter, more rhythmic view of the sapling word in motion.",
      poster: "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.26.46 AM.jpeg",
      ref: featureVideoRef,
    },
  ] as const;

  return (
    <section className={styles.section} ref={rootRef} aria-labelledby="impact-gwr-title">
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Guinness World Record</p>
          <h1 id="impact-gwr-title" className={styles.title}>
            Largest Sapling Word.
          </h1>
          <p className={styles.intro}>A public record built from saplings, volunteers, and a single visible idea.</p>
          <p className={styles.summary}>
            Recognition mattered, but the real story is the scale, discipline, and collective energy behind it.
          </p>

          <div className={styles.pillRow}>
            {highlights.map((item) => (
              <span key={item.label} className={styles.pill}>
                <strong>{item.value}</strong>
                <em>{item.label}</em>
              </span>
            ))}
          </div>

          <div className={styles.actionRow}>
            <Link href={gwrStory.cta.href} className={styles.primaryAction}>
              {gwrStory.cta.label}
            </Link>
            {gwrStory.secondaryCta ? (
              <Link href={gwrStory.secondaryCta.href} className={styles.secondaryAction}>
                {gwrStory.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className={styles.heroMedia}>
          <div className={styles.heroVideoFrame}>
            <video
              ref={heroVideoRef}
              className={styles.heroVideo}
              src={storyVideos[0].src}
              poster={storyVideos[0].poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
            <div className={styles.heroOverlayCopy}>
              <span>Documentary cut</span>
              <strong>The record at its widest scale.</strong>
            </div>
          </div>

          <div className={styles.factGrid}>
            {quickFacts.map((fact) => (
              <article key={fact.label} className={styles.factCard}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.videoSection} aria-labelledby="gwr-motion-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionEyebrow}>In motion</p>
          <h2 id="gwr-motion-title">The record, from another angle.</h2>
          <p>A second cut keeps the pace and shows the shape of the work without extra noise.</p>
        </div>

        <div className={styles.videoGrid}>
          {storyVideos.slice(1, 2).map((video) => (
            <article key={video.label} className={styles.videoCard}>
              <div className={styles.videoFrame}>
                <video
                  ref={video.ref}
                  className={styles.video}
                  src={video.src}
                  poster={video.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              </div>
              <div className={styles.videoMeta}>
                <p>{video.label}</p>
                <span>{video.description}</span>
              </div>
            </article>
          ))}

          <article className={styles.noteCard}>
            <p className={styles.noteLabel}>Impact in one line</p>
            <h3>Visible, collective, memorable.</h3>
            <p>
              The record becomes stronger when it feels public, simple, and easy to remember.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.instagramSection} aria-labelledby="gwr-instagram-title">
        <div className={styles.sectionHeadingCompact}>
          <p className={styles.sectionEyebrow}>Instagram</p>
          <h2 id="gwr-instagram-title">Shared back in real time.</h2>
          <p>Two posts from the campaign, kept inside the story instead of buried below it.</p>
        </div>

        <div className={styles.instagramGrid}>
          {instagramPosts.map((item) => (
            <article key={item.permalink} className={styles.instagramCard}>
              <div className={styles.instagramMeta}>
                <p>{item.title}</p>
                <span>{item.description}</span>
              </div>
              <InstagramEmbed permalink={item.permalink} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gallerySection} aria-labelledby="gwr-gallery-title">
        <div className={styles.sectionHeadingCompact}>
          <p className={styles.sectionEyebrow}>Field frames</p>
          <h2 id="gwr-gallery-title">A few still moments.</h2>
        </div>

        <div className={styles.galleryGrid}>
          {storyImages.map((image, index) => (
            <figure key={`${image.src}-${index}`} className={styles.galleryItem}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.closure}>
        <div>
          <p className={styles.sectionEyebrow}>Why it matters</p>
          <h2>{gwrStory.closing.title}</h2>
        </div>
        <p>{gwrStory.closing.body}</p>
      </section>
    </section>
  );
}
