"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { NavigationOverlay } from "./NavigationOverlay";
import { navigationEntries } from "./navigation-data";

const NAV_UTILITIES = [
  { label: "Call Us", href: "/contact" },
  { label: "Store", href: "https://store.paksarzameenwfo.com", external: true },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isHome = pathname === "/";
  const darkChrome = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const chromeClassName = darkChrome
    ? "border-transparent bg-transparent text-white"
    : "border-black/8 bg-white/95 text-black backdrop-blur-md";

  const actionClassName = darkChrome ? "text-white/92 hover:text-white" : "text-black/86 hover:text-black";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] border-b transition-all duration-500 ${chromeClassName} ${
          menuOpen ? "pointer-events-none -translate-y-4 opacity-0" : "pointer-events-auto translate-y-0 opacity-100"
        }`}
      >
        <nav className="store-container grid h-[78px] grid-cols-[auto_1fr_auto] items-center gap-4">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className={`group inline-flex items-center gap-3 justify-self-start text-[1.25rem] font-normal tracking-[0.01em] transition-colors duration-300 ${actionClassName}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="psz-navigation-overlay"
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span className={`block h-px w-full origin-center transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45 bg-current" : "bg-current"}`} />
              <span className={`block h-px w-full transition-all duration-300 ${menuOpen ? "scale-x-0 opacity-0 bg-current" : "bg-current"}`} />
              <span className={`block h-px w-full origin-center transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45 bg-current" : "bg-current"}`} />
            </span>
            <span className="relative overflow-hidden">
              <span className={`block transition-all duration-300 ${menuOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>Menu</span>
              <span className={`absolute inset-0 block transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>Close</span>
            </span>
          </button>

          <div className="min-w-0 justify-self-center">
            <Link href="/" aria-label="Paksarzameen home" className="text-center">
              <span
                className={
                  "block truncate font-normal uppercase leading-none tracking-[0.16em] transition-colors duration-300 " +
                  (darkChrome ? "text-white" : "text-black")
                }
                style={{ fontSize: "clamp(1.8rem, 2vw, 2.4rem)" }}
              >
                PAKSARZAMEEN
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-self-end gap-4 sm:gap-6">
            {NAV_UTILITIES.map((item) => (
              item.external ? (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hidden text-[12px] font-normal tracking-[0.01em] transition-colors sm:inline-flex ${actionClassName}`}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`hidden text-[12px] font-normal tracking-[0.01em] transition-colors md:inline-flex ${actionClassName}`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </nav>
      </header>

      <NavigationOverlay
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          window.requestAnimationFrame(() => buttonRef.current?.focus());
        }}
        triggerRef={buttonRef}
        entries={navigationEntries}
      />
    </>
  );
}
