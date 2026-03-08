"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/config/site";

/* ── About PSZ mega-dropdown data ────────────────────── */
const ABOUT_PANELS = [
  {
    slug: "story",
    icon: "🏛️",
    title: "Our Story",
    desc: "Guinness World Record–holding NGO, founded in 2021 with 436 trees in Bahawalpur — one per student in the Child Protection Bureau dormitories.",
    href: "/about",
  },
  {
    slug: "mission",
    icon: "🎯",
    title: "Mission",
    desc: "Alleviate poverty by empowering marginalized communities through digital markets, entrepreneurial capacity building, and character-centred education.",
    href: "/about#mission",
  },
  {
    slug: "vision",
    icon: "🌟",
    title: "Vision",
    desc: "A compassionate society where impoverished communities achieve dignity and prosperity through ethical enterprise and responsible generations.",
    href: "/about#vision",
  },
  {
    slug: "objective",
    icon: "📌",
    title: "Objective",
    desc: "Create sustainable opportunities for livelihood, education, and social development through ethical entrepreneurship and dignified community welfare.",
    href: "/about#objective",
  },
];

/* ── Impact mega-dropdown data ─────────────────────────── */
const IMPACT_CATS = [
  {
    slug: "environmental",
    icon: "🌿",
    title: "Environmental Impact",
    items: [
      "GWR",
      "Miawuaki Forest",
      "South Punjab Green Book Initiative",
      "LCOY",
      "COP in My City",
      "Data Assessment & Research",
    ],
  },
  {
    slug: "animal",
    icon: "🐾",
    title: "Animal Welfare Impact",
    items: [
      "Cat Feeding Points",
      "Stray Dog Collar Project",
      "Data Assessment & Research",
    ],
  },
  {
    slug: "education",
    icon: "📚",
    title: "Educational Empowerment Impact",
    items: [
      "Pakistan's Only Transgender School",
      "Pakistan's First Blind Parliamentary Debating Team",
      "Career Counselling & University Applications",
      "Enrollment Rate & Data Assessment",
    ],
  },
  {
    slug: "health",
    icon: "❤️",
    title: "Community Health Impact",
    items: [
      "24/7 Availability of Blood",
      "Monthly Free Medical/Blood Camps",
      "Data Assessment & Research",
    ],
  },
];

const STORIES_OF_HOPE = [
  {
    name: "Zain Hashim",
    role: "Pakistan's First Blind Anchor",
    image: "/images/members/1.png",
  },
  {
    name: "Sahiba Jehan",
    role: "Pakistan's First Transgender Police Officer",
    image: "/images/members/2.png",
  },
];
/* ────────────────────────────────────────────────────── */

type Panel = "impact" | null;
const DROPDOWN_LABELS: Record<string, Panel> = { "Impact": "impact" };

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 80) {
        setHidden(true);
        setActivePanel(null);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`psz-header ${scrolled ? "scrolled" : ""} ${hidden ? "nav-hidden" : ""}`}
        onMouseLeave={() => setActivePanel(null)}
      >
        <div className="blur-bg" />
        <nav>
          <Link href="/" className="nav-logo">
            <Image
              src="/paksarzameen_logo.png"
              alt="PakSarZameen"
              width={40}
              height={40}
              priority
              className="nav-logo-img"
            />
            Pak<span className="green">Sar</span>Zameen
          </Link>

          <div className="nav-links">
            {navLinks.slice(0, 6).map((link) => {
              const panel = DROPDOWN_LABELS[link.label];
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              if (panel) {
                const isOpen = activePanel === panel;
                return (
                  <div
                    key={link.label}
                    className="nav-dropdown-wrapper"
                    onMouseEnter={() => setActivePanel(panel)}
                  >
                    <Link
                      href={link.href}
                      className={`nav-dropdown-trigger${isOpen ? " active" : ""}${isActive ? " nav-link-active" : ""}`}
                    >
                      {link.label}
                      <svg
                        className={`nav-chevron${isOpen ? " open" : ""}`}
                        width="10" height="6" viewBox="0 0 10 6"
                        fill="currentColor" aria-hidden="true"
                      >
                        <path d="M0 0l5 6 5-6z" />
                      </svg>
                    </Link>
                  </div>
                );
              }
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={`nav-link${isActive ? " nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <Link href="/commonwealth-lab" className="nav-commonwealth-btn">
              Commonwealth Lab
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2h10v4m0-4L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <button
              type="button"
              className={`nav-toggle ${menuOpen ? "open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((p) => !p)}
            >
              <div className="bar1" />
              <div className="bar2" />
            </button>
          </div>
        </nav>

        {/* ══ Impact Mega Dropdown ══════════════════════════ */}
        <div
          className={`nav-mega-panel${activePanel === "impact" ? " open" : ""}`}
          onMouseEnter={() => setActivePanel("impact")}
          aria-hidden={activePanel !== "impact"}
        >
          <div className="mega-inner">

            {/* ── Left: intro ── */}
            <div className="mega-left">
              <span className="mega-eyebrow">Explore</span>
              <h3 className="mega-heading">Impact</h3>
              <p className="mega-tagline">
                Measuring the real change we create across Pakistan&apos;s
                communities — environmental, social, and human.
              </p>
              <Link href="/impact" className="mega-view-all">
                View all impact →
              </Link>
            </div>

            {/* ── Right: categories + stories ── */}
            <div className="mega-right">

              {/* 4 category columns */}
              <div className="mega-cats-grid">
                {IMPACT_CATS.map((cat) => (
                  <div key={cat.slug} className="mega-cat">
                    <div className="mega-cat-header">
                      <span className="mega-cat-icon" aria-hidden="true">{cat.icon}</span>
                      <h4 className="mega-cat-title">{cat.title}</h4>
                    </div>
                    <ul className="mega-cat-list">
                      {cat.items.map((item) => (
                        <li key={item}>
                          <Link href="/impact">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Stories of Hope */}
              <div className="mega-stories-row">
                <div className="mega-stories-header">
                  <span className="mega-cat-icon" aria-hidden="true">✨</span>
                  <h4 className="mega-cat-title">Stories of Hope</h4>
                </div>
                <div className="mega-story-cards">
                  {STORIES_OF_HOPE.map((s) => (
                    <Link href="/impact" key={s.name} className="mega-story-card">
                      <div className="mega-story-img-wrap">
                        <Image
                          src={s.image}
                          alt={s.name}
                          width={56}
                          height={56}
                          className="mega-story-img"
                        />
                      </div>
                      <div className="mega-story-info">
                        <strong>{s.name}</strong>
                        <span>{s.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* ════════════════════════════════════════════════ */}

      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
