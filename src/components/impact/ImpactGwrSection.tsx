"use client";

import { useEffect, useRef } from "react";
import styles from "./impact-gwr.module.css";

export default function ImpactGwrSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Fade-in on scroll
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible);
        });
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Load Instagram embed script if not present
    if (typeof window === "undefined") return;
    if ((window as any).instgrm) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "//www.instagram.com/embed.js";
    document.body.appendChild(s);
  }, []);

  return (
    <section className={styles.section} ref={rootRef} aria-labelledby="impact-gwr-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="impact-gwr-title">Our Global Impact</h2>
          <p className={styles.subtitle}>Recognized by Guinness World Records and Featured in Media</p>
        </header>

        <div className={styles.grid}>
          <article className={styles.card} aria-labelledby="gwr-title">
            <div className={styles.cardHead}>
              <div className={styles.icon} aria-hidden>
                {/* Guinness icon (simple trophy/award) */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l2.2 4.5L19 8l-3.6 2.9L16.4 16 12 13.7 7.6 16l1-5.1L5 8l4.8-1.5L12 2z" fill="#D4AF37"/>
                </svg>
              </div>
              <div>
                <h3 id="gwr-title" className={styles.cardTitle}>Largest Sapling Word Record</h3>
                <p className={styles.cardSource}><strong>Source:</strong> Guinness World Records</p>
              </div>
            </div>

            <p className={styles.cardBody}>
              Our initiative achieved a Guinness World Record by creating the largest word formed using plant
              saplings.
            </p>

            <a
              className={styles.cta}
              href="/impact/gwr"
            >
              Read More
            </a>
          </article>

          <article className={styles.card} aria-labelledby="news-title">
            <div className={styles.cardHead}>
              <div className={styles.icon} aria-hidden>
                {/* News icon */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="14" rx="2" stroke="#0f7a47" strokeWidth="1.5" fill="#eaf8ef"/>
                  <path d="M7 8h10" stroke="#0f7a47" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 id="news-title" className={styles.cardTitle}>Young Pakistanis Set Unique World Record Using 3000 Plant Saplings</h3>
                <p className={styles.cardSource}><strong>Source:</strong> ProPakistani</p>
              </div>
            </div>

            <p className={styles.cardBody}>
              Our work has been featured in national media highlighting innovation and environmental impact.
            </p>

            <a
              className={styles.cta}
              href="https://propakistani.pk/2023/07/12/young-pakistani-men-set-unique-world-record-using-3000-plant-saplings/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Article
            </a>
          </article>

          <aside className={`${styles.card} ${styles.embedCard}`} aria-label="Instagram post embed">
            <div className={styles.cardHead}>
              <div className={styles.icon} aria-hidden>
                {/* Instagram icon */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="#E1306C"/>
                  <circle cx="12" cy="12" r="3.2" fill="#fff"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.cardTitle}>Instagram</h3>
                <p className={styles.cardSource}><strong>Source:</strong> @paksarzameen.wfo</p>
              </div>
            </div>

            <div className={styles.embedWrap}>
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/C9HQIpmuAod/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                data-testid="ig-embed"
                style={{ background: "#FFF", border: 0 }}
                dangerouslySetInnerHTML={{
                  __html: `
                    <div style="padding:16px; text-align:center;">
                      <a href="https://www.instagram.com/p/C9HQIpmuAod/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit">View this post on Instagram</a>
                    </div>
                  `,
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
