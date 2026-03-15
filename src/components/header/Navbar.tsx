"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/config/site";



/* ── Impact mega-dropdown data ─────────────────────────── */
const IMPACT_CATS = [
  {
    slug: "environmental",
    icon: "",
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
    icon: "",
    title: "Animal Welfare Impact",
    items: [
      "Cat Feeding Points",
      "Stray Dog Collar Project",
      "Data Assessment & Research",
    ],
  },
  {
    slug: "education",
    icon: "",
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
    icon: "",
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

  // Determine if background is dark based on pathname
  // Only homepage has a dark background; all other pages have white/light backgrounds
  const isDarkBg = pathname === "/";

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
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Hide navbar on product detail pages
  if (pathname.startsWith("/commonwealth-lab/products/")) {
    return null;
  }

  return (
    <>
      <header
        className={`psz-header ${scrolled ? "scrolled" : ""} ${hidden ? "nav-hidden" : ""} ${isDarkBg ? "dark-text" : "light-text"}`}
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
            {navLinks.map((link) => {
              const panel = DROPDOWN_LABELS[link.label];
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const isBloodBank = link.label === "Blood Bank";
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
                  style={
                    isBloodBank
                      ? {
                          color: "#ffd9d9",
                          border: "1px solid rgba(255, 115, 115, 0.55)",
                          borderRadius: "999px",
                          padding: "0.35rem 0.95rem",
                          background: "rgba(139, 0, 0, 0.33)",
                          fontWeight: 700,
                        }
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="nav-actions">
            <Link
              href={siteConfig.commonwealthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-commonwealth-btn"
            >
              Paksarzameen Store
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
                      {cat.items.map((item) => {
                        const isBloodItem = /24\/?7|Availability of Blood/i.test(item);
                        return (
                          <li key={item}>
                            {isBloodItem ? (
                              <Link
                                href="/blood-bank"
                                style={{ color: "#ffcccc", fontWeight: 800 }}
                              >
                                {item}
                              </Link>
                            ) : (
                              <Link href="/impact">{item}</Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Stories of Hope */}
              <div className="mega-stories-row">
                <div className="mega-stories-header">
                  <span className="mega-cat-icon" aria-hidden="true"></span>
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
        {pathname !== "/" ? (
          <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
            <p style={{ color: "#ffb4b4", fontSize: "1.1rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Emergency Contacts
            </p>
            {siteConfig.emergencyContacts.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone}`}
                style={{ color: "#ffffff", display: "block", fontSize: "1.25rem", marginTop: "0.45rem" }}
              >
                {contact.name}: {contact.phone}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {pathname !== "/" ? (
        <div
          style={{
            background: "linear-gradient(90deg, rgba(123, 8, 8, 0.96), rgba(65, 7, 7, 0.96))",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            padding: "0.52rem 5%",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <strong style={{ color: "#ffe5e5", fontSize: "1.2rem" }}>Emergency contacts:</strong>
          {siteConfig.emergencyContacts.map((contact) => (
            <a
              key={contact.phone}
              href={`tel:${contact.phone}`}
              style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.2rem" }}
            >
              {contact.name}: {contact.phone}
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}
