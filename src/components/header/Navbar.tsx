"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { navLinks } from "@/config/site";

export function Navbar() {
  const [hidden, setHidden]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hide on scroll-down, reveal on scroll-up
      if (y > lastY.current && y > 80) {
        setHidden(true);
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
      <header className={`psz-header ${
        scrolled ? "scrolled" : ""
      } ${
        hidden ? "nav-hidden" : ""
      }`}>
        <div className="blur-bg" />
        <nav>
          <Link href="/" className="nav-logo">
            Pak<span className="green">Sar</span>Zameen
          </Link>

          <div className="nav-links">
            {navLinks.slice(0, 5).map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
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
