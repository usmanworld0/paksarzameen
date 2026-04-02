import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/* eslint-disable react/no-unescaped-entities */

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

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero" data-scroll-section="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About PakSarZameen</h1>
          <p className="about-hero-subtitle">
            Local action. Lasting dignity.
            <span className="about-hero-subtitle-line">Nurturing character through education.</span>
          </p>
        </div>
      </section>

      <section className="about-minimal-intro">
        <div className="about-minimal-intro__inner">
          <p className="about-minimal-intro__lead">
            PakSarZameen is a Bahawalpur-rooted movement working across education,
            health, welfare, and environmental care.
          </p>
          <div className="about-minimal-grid">
            <div className="about-minimal-card">
              <h3>Mission</h3>
              <p>Build practical pathways to dignity for underserved communities.</p>
            </div>
            <div className="about-minimal-card">
              <h3>Vision</h3>
              <p>A just Pakistan where opportunity and care are shared.</p>
            </div>
            <div className="about-minimal-card">
              <h3>Method</h3>
              <p>Volunteer-driven programs shaped by real local needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-content">
          <h2>Build With Us</h2>
          <p>
            Join programs, volunteer your time, or partner with us to create measurable local impact.
          </p>
          <div className="about-cta-links">
            <Link href="/get-involved" className="cta-btn cta-btn-primary">
              Get Involved
            </Link>
            <Link href="/contact" className="cta-btn cta-btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
