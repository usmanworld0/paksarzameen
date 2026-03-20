import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/* eslint-disable react/no-unescaped-entities */

export const metadata: Metadata = {
  title: "About Us: Mission, Vision And Community Work In Pakistan",
  description:
    "Learn about PakSarZameen, a community development NGO in Pakistan rooted in justice, compassion, education, health support, environmental action, and sustainable social impact.",
  keywords: [
    ...siteConfig.seo.keywords,
    "about paksarzameen",
    "ngo mission pakistan",
    "community development bahawalpur",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About PakSarZameen NGO | Mission, Vision And Community Work",
    description:
      "Meet the story, mission, and values behind PakSarZameen's education, health, environmental, and welfare work in Pakistan.",
    url: `${siteConfig.siteUrl}/about`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen NGO Bahawalpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PakSarZameen NGO | Mission, Vision And Community Work",
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
            A community development NGO in Pakistan rooted in justice, compassion, and sustainable community care
          </p>
        </div>
      </section>

      <section className="about-detailed">
        <div className="about-detailed-container">
          <div className="about-detailed-header">
            <h2>Who We Are</h2>
            <p className="about-intro">
              PakSarZameen is a Bahawalpur-based NGO founded in 2021 through a
              symbolic act of environmental and social care, and it has grown
              into a platform for education, health, welfare, and volunteer-led
              community development across Pakistan.
            </p>
          </div>

          <div className="about-content-grid">
            <div className="about-content-block">
              <div className="content-block-number">01</div>
              <h3>How We Began</h3>
              <p>
                Our journey began in 2021 with the planting of 436 trees at the
                Child Protection Bureau in Bahawalpur, one tree for each student
                living in the Bureau's dormitories. That first act shaped our
                belief that meaningful change begins when service is both
                practical and deeply symbolic.
              </p>
            </div>

            <div className="about-content-block">
              <div className="content-block-number">02</div>
              <h3>What Inspires Us</h3>
              <p>
                PakSarZameen draws inspiration from traditions of justice,
                public welfare, and ethical stewardship. We believe resources,
                knowledge, and opportunity should move toward those who need
                them most, and that institutions should serve communities with
                humility and responsibility.
              </p>
            </div>

            <div className="about-content-block">
              <div className="content-block-number">03</div>
              <h3>How We Work</h3>
              <p>
                Guided by compassion and dignity, we build programs that respond
                to real local needs. Our work is rooted in empowerment,
                volunteer collaboration, and practical service, with long-term
                pathways for education, wellbeing, livelihoods, and shared civic
                care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-pillars">
        <div className="pillars-container">
          <div id="mission" className="pillar-card mission-card fade-in-section">
            <div className="pillar-icon"></div>
            <h3 className="pillar-title">Mission</h3>
            <p className="pillar-text">
              Empower marginalized communities through ethical enterprise,
              digital market access, capacity building, and education rooted in
              character and dignity.
            </p>
          </div>

          <div id="vision" className="pillar-card vision-card fade-in-section">
            <div className="pillar-icon"></div>
            <h3 className="pillar-title">Vision</h3>
            <p className="pillar-text">
              A just society where every community achieves dignity and
              prosperity through ethical enterprise, sustainable development,
              and education that nurtures responsible, conscious generations.
            </p>
          </div>

          <div
            id="objective"
            className="pillar-card objective-card fade-in-section"
          >
            <div className="pillar-icon"></div>
            <h3 className="pillar-title">Objective</h3>
            <p className="pillar-text">
              Create sustainable pathways for livelihood, education, and social
              development through ethical entrepreneurship, community welfare
              initiatives, and programs that uphold dignity.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="values-container">
          <h2 className="values-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Justice</h4>
              <p>Equitable treatment and ethical practice in every initiative.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Compassion</h4>
              <p>Action that meets people with empathy and protects dignity.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Community</h4>
              <p>Collaborative development rooted in local trust and wisdom.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Sustainability</h4>
              <p>Long-term solutions that support future generations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-content">
          <h2>Ready to Join Our Mission?</h2>
          <p>
            Be part of our work to transform lives across Pakistan through
            actionable compassion, ethical enterprise, and sustainable community
            development.
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
