"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/config/site";
import { impactCategories, impactHopeStories } from "@/content/impact";



/* ── Impact mega-dropdown data ─────────────────────────── */
const IMPACT_CATS = impactCategories;

const STORIES_OF_HOPE = impactHopeStories;
/* ────────────────────────────────────────────────────── */

type Panel = "impact" | null;
const DROPDOWN_LABELS: Record<string, Panel> = { "Impact": "impact" };

type ImpactCategorySlug = (typeof IMPACT_CATS)[number]["slug"];

function ImpactGlyph({ slug }: { slug: ImpactCategorySlug }) {
  if (slug === "environmental") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 14c5.5-8 10-8 14-9-1 4-1 8-9 14-1.6 1.2-3.9.8-5-.9-1.3-1.8-1.4-3.6 0-4.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 16.5c1.2-2.2 3.1-3.8 5.5-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug === "education") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7l8-3 8 3-8 3-8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 9v4c0 1.8 2.2 3.5 5 3.5s5-1.7 5-3.5V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 13v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug === "animal") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="6.2" cy="8" r="1.6" fill="currentColor" />
        <circle cx="10.1" cy="5.8" r="1.6" fill="currentColor" />
        <circle cx="13.9" cy="5.8" r="1.6" fill="currentColor" />
        <circle cx="17.8" cy="8" r="1.6" fill="currentColor" />
        <path d="M8 14.2c0-2.1 1.9-3.7 4-3.7s4 1.6 4 3.7c0 2.1-1.8 3.9-4 3.9s-4-1.8-4-3.9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4c3 3.2 4.8 6.2 4.8 8.4 0 2.7-2.1 4.9-4.8 4.9s-4.8-2.2-4.8-4.9C7.2 10.2 9 7.2 12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10.2 13.7c.9.8 2.6.8 3.6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18.2v2.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActivePanel(null);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActivePanel(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Hide navbar on product detail pages
  if (pathname.startsWith("/commonwealth-lab/products/")) {
    return null;
  }

  return (
    <>
      <header
        className={`psz-header always-white-bg ${scrolled ? "scrolled" : ""} ${hidden ? "nav-hidden" : ""} light-text`}
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
            {navLinks
              .filter((link) => link.label !== "Paksarzameen Store")
              .map((link) => {
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
                  className={`nav-link${isActive ? " nav-link-active" : ""}${isBloodBank ? " nav-link-bloodbank" : ""}`}
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
              aria-expanded={menuOpen}
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
                {IMPACT_CATS.map((cat, index) => (
                  <div key={cat.slug} className={`mega-cat mega-cat--tone-${(index % 5) + 1}`}>
                    <div className="mega-cat-header">
                      <span className="mega-cat-icon" aria-hidden="true">
                        <ImpactGlyph slug={cat.slug} />
                      </span>
                      <h4 className="mega-cat-title">{cat.title}</h4>
                    </div>
                    <ul className="mega-cat-list">
                      {cat.items.map((item) => {
                        return (
                          <li key={item.href}>
                            <Link href={item.href}>
                              {item.title}
                            </Link>
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
                  <span className="mega-cat-icon mega-cat-icon--story" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 8.5A3.5 3.5 0 0 1 9.5 5h5A3.5 3.5 0 0 1 18 8.5v7A3.5 3.5 0 0 1 14.5 19h-5A3.5 3.5 0 0 1 6 15.5v-7Z" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <h4 className="mega-cat-title">Stories of Hope</h4>
                </div>
                <div className="mega-story-cards">
                  {STORIES_OF_HOPE.map((s, index) => (
                    <Link href={s.href} key={s.name} className={`mega-story-card mega-story-card--tone-${(index % 5) + 1}`}>
                      <div className="mega-story-img-wrap">
                        {s.image ? (
                          <Image
                            src={s.image.src}
                            alt={s.image.alt}
                            width={56}
                            height={56}
                            className="mega-story-img"
                          />
                        ) : (
                          <div className="mega-story-fallback" aria-hidden="true">
                            {s.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
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
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__panel">
          <div className="mobile-menu__intro">
            <span className="mobile-menu__eyebrow">PakSarZameen</span>
            <p className="mobile-menu__title">
              Community-led work across education, health, blood support, the
              environment, and welfare.
            </p>
          </div>

          <div className="mobile-menu__links">
            {navLinks
              .filter((link) => link.label !== "Paksarzameen Store")
              .map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={link.label === "Blood Bank" ? "mobile-menu__link mobile-menu__link--accent" : "mobile-menu__link"}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          <div className="mobile-menu__actions">
            <a
              href={siteConfig.commonwealthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu__store"
            >
              Visit Paksarzameen Store
            </a>
            <Link
              href="/get-involved"
              className="mobile-menu__cta"
              onClick={() => setMenuOpen(false)}
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>

      
    </>
  );
}
