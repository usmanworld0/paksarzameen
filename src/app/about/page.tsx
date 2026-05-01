import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us: Mission, Vision And Community Work In Pakistan",
  description:
    "Learn about PakSarZameen, a community development organization in Pakistan rooted in justice, compassion, education, health support, environmental action, and sustainable social impact.",
  keywords: [
    ...siteConfig.seo.keywords,
    "about paksarzameen",
    "organization mission pakistan",
    "community development bahawalpur",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About PakSarZameen | Mission, Vision And Community Work",
    description:
      "Meet the story, mission, and values behind PakSarZameen's education, health, environmental, and welfare work in Pakistan.",
    url: `${siteConfig.siteUrl}/about`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen Bahawalpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PakSarZameen | Mission, Vision And Community Work",
    description:
      "Meet the story, mission, and values behind PakSarZameen's education, health, environmental, and welfare work in Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

const principles = [
  {
    title: "Mission",
    text: "Build practical pathways to dignity for underserved communities.",
  },
  {
    title: "Vision",
    text: "A just Pakistan where opportunity and care are shared.",
  },
  {
    title: "Method",
    text: "Volunteer-led programs shaped around local needs and measurable outcomes.",
  },
];

export default function AboutPage() {
  return (
    <main className="site-page">
      <section className="site-hero">
        <div className="site-hero__noise" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--left" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--right" aria-hidden="true" />

        <header className="site-hero__inner">
          <p className="site-hero__eyebrow">About PSZ</p>
          <h1 className="site-hero__title">About PakSarZameen.</h1>
          <p className="site-hero__body">
            Bahawalpur-rooted community work across education, healthcare, welfare, and environmental action.
          </p>
          <div className="site-hero__chips">
            <span className="site-chip">Bahawalpur rooted</span>
            <span className="site-chip">Volunteer led</span>
          </div>
        </header>
      </section>

      <section className="site-section">
        <div className="site-grid site-grid--three">
          {principles.map((item) => (
            <article key={item.title} className="site-card site-card--soft site-card--rounded">
              <div className="site-card__body">
                <p className="site-card__eyebrow">{item.title}</p>
                <h2 className="site-card__title">{item.title}</h2>
                <p className="site-card__text">{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="site-panel site-panel--rounded site-panel--inverted mt-6">
          <div className="site-panel__body">
            <p className="site-eyebrow">Build with us</p>
            <h2 className="site-heading mt-4 text-white">Local action that stays useful.</h2>
            <p className="site-copy mt-4 max-w-[56rem] text-white/76">
              Join, volunteer, or partner with PSZ to support practical community work.
            </p>
            <div className="site-form-actions mt-6">
              <Link href="/get-involved" className="site-button">
                Get Involved
              </Link>
              <Link href="/contact" className="site-button-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
