import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PakSarZameen — a Guinness World Record-holding NGO rooted in justice, compassion, and community-first development across Pakistan.",
  openGraph: {
    title: "PSZ | About",
    description:
      "Learn about PakSarZameen — a Guinness World Record-holding NGO rooted in justice, compassion, and community-first development across Pakistan.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PSZ | About",
    description:
      "Learn about PakSarZameen — a Guinness World Record-holding NGO rooted in justice, compassion, and community-first development across Pakistan.",
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero" data-scroll-section="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Our Story</h1>
          <p className="about-hero-subtitle">
            Rooted in principles of justice, compassion, and sustainable community care
          </p>
        </div>
      </section>

      {/* About Us - Detailed Section */}
      <section className="about-detailed">
        <div className="about-detailed-container">
          <div className="about-detailed-header">
            <h2>Who We Are</h2>
            <p className="about-intro">
              PakSarZameen is a Guinness World Record-holding institute founded in 2021 with a symbolic act of environmental and social commitment.
            </p>
          </div>

          <div className="about-content-grid">
            {/* Founding Story */}
            <div className="about-content-block">
              <div className="content-block-number">01</div>
              <h3>Our Founding</h3>
              <p>
                We began in 2021 with the planting of 436 trees at the Child Protection Bureau in Bahawalpur—one tree for each student residing in the Bureau's dormitories. This initiative marked the beginning of a broader mission to nurture both communities and the environment, embodying our commitment to meaningful, symbolic action grounded in compassion.
              </p>
            </div>

            {/* Historical Inspiration */}
            <div className="about-content-block">
              <div className="content-block-number">02</div>
              <h3>Our Inspiration</h3>
              <p>
                PakSarZameen draws philosophical inspiration from Medina during 634–644 CE, a period recognized for its principles of justice, public welfare, and ethical economic stewardship. The institution of the Bayt al-Mal ensured wealth was responsibly distributed to the vulnerable, reflecting the belief that economic resources must serve society's most marginalized members.
              </p>
            </div>

            {/* Our Approach */}
            <div className="about-content-block">
              <div className="content-block-number">03</div>
              <h3>Our Approach</h3>
              <p>
                Guided by principles of compassion and justice, PakSarZameen promotes a model of development rooted in empowerment. While inspired by the ethical governance of Umar ibn al-Khattab, we serve people without discrimination based on religion, ethnicity, gender, or background—reviving the spirit of responsible community care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Objective */}
      <section className="about-pillars">
        <div className="pillars-container">
          {/* Mission */}
          <div id="mission" className="pillar-card mission-card fade-in-section">
            <div className="pillar-icon">🎯</div>
            <h3 className="pillar-title">Mission</h3>
            <p className="pillar-text">
              To alleviate poverty by empowering socially and economically marginalized communities through access to digital markets and by harnessing entrepreneurial potential, capacity building, sustainable initiatives and nurturing character in the youth as the foundation of meaningful education.
            </p>
          </div>

          {/* Vision */}
          <div id="vision" className="pillar-card vision-card fade-in-section">
            <div className="pillar-icon">🌟</div>
            <h3 className="pillar-title">Vision</h3>
            <p className="pillar-text">
              A compassionate and just society where impoverished communities achieve dignity and prosperity through ethical enterprise, access to digital markets, sustainable resource use, and character-centered education that nurtures responsible and socially conscious generations.
            </p>
          </div>

          {/* Objective */}
          <div id="objective" className="pillar-card objective-card fade-in-section">
            <div className="pillar-icon">📌</div>
            <h3 className="pillar-title">Objective</h3>
            <p className="pillar-text">
              To uplift socially and economically marginalized communities by creating sustainable opportunities for livelihood, education, and social development through ethical entrepreneurship, digital market access, capacity building, and community welfare initiatives that nurture dignity, compassion, and responsible citizenship.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="values-container">
          <h2 className="values-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">⚖️</div>
              <h4>Justice</h4>
              <p>Equitable treatment and ethical practices in all endeavors</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💚</div>
              <h4>Compassion</h4>
              <p>Empathy-driven action that honors human dignity</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>Community</h4>
              <p>Collaborative development rooted in local wisdom</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🌱</div>
              <h4>Sustainability</h4>
              <p>Long-term impact that benefits future generations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta-content">
          <h2>Ready to Join Our Mission?</h2>
          <p>
            Be part of our vision to transform lives across Pakistan through actionable compassion, ethical enterprise, and sustainable community development.
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
