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
                {IMPACT_CATS.map((cat) => (
                  <div key={cat.slug} className="mega-cat">
                    <div className="mega-cat-header">
                      <span className="mega-cat-icon" aria-hidden="true"></span>
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
                  <span className="mega-cat-icon" aria-hidden="true"></span>
                  <h4 className="mega-cat-title">Stories of Hope</h4>
                </div>
                <div className="mega-story-cards">
                  {STORIES_OF_HOPE.map((s) => (
                    <Link href={s.href} key={s.name} className="mega-story-card">
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
