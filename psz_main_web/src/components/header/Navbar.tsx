"use client";

import Link from "next/link";
import { useState } from "react";

import { MobileNav } from "@/components/header/MobileNav";
import { navLinks, siteConfig } from "@/config/site";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-psz-forest/10 bg-psz-cream/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-psz-forest sm:text-2xl"
        >
          PakSarZameen
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-psz-charcoal transition-all hover:bg-psz-forest/10 hover:text-psz-forest"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={siteConfig.commonwealthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center rounded-full border border-psz-sand/80 bg-psz-forest px-4 py-2 text-sm font-semibold text-psz-cream shadow-soft transition-all hover:-translate-y-px hover:bg-psz-charcoal"
            >
              {siteConfig.commonwealthLabel}
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-psz-forest/20 bg-white/80 text-psz-forest md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <MobileNav
          isOpen={isOpen}
          links={navLinks}
          commonwealthLabel={siteConfig.commonwealthLabel}
          commonwealthUrl={siteConfig.commonwealthUrl}
          onNavigate={() => setIsOpen(false)}
        />
      </div>
    </header>
  );
}
