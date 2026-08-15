"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

import { NavigationOverlay } from "./NavigationOverlay";
import { navigationEntries } from "./navigation-data";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMenuOpen(true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] h-[70px] border-b border-[#e5e5e5] bg-[#f8f8f8]/95 backdrop-blur-md text-[#1a1a1a] transition-all">
        <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Primary Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Awwwards-style Brand Mark */}
            <Link
              href="/"
              aria-label="PakSarZameen home"
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/paksarzameen_logo.png"
                alt="PakSarZameen"
                width={130}
                height={40}
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
                priority
              />
            </Link>

            {/* Navigation links group */}
            <nav className="flex items-center gap-5 lg:gap-6 text-[14px] font-medium tracking-tight text-[#222222]">
              {/* Menu (Explore-style) Button */}
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="group inline-flex items-center gap-1 text-[14px] font-medium text-[#111111] transition-colors hover:text-black"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="psz-navigation-overlay"
              >
                <span>Menu</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[#555] transition-transform duration-200 ${menuOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`} />
              </button>

              {/* Direct Route Links (Dog, Health, Store, Education) */}
              <Link
                href="/dog-adoption"
                className="hidden transition-colors hover:text-black sm:inline-block"
              >
                Dog
              </Link>

              <Link
                href="/healthcare"
                className="hidden transition-colors hover:text-black sm:inline-block"
              >
                Health
              </Link>

              <a
                href={siteConfig.commonwealthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden transition-colors hover:text-black md:inline-block"
              >
                Store
              </a>

              <a
                href="https://education.paksarzameenwfo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 transition-colors hover:text-black md:inline-flex"
              >
                <span>Education</span>
                <span className="rounded-[4px] bg-[#111111] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wider text-white">
                  New
                </span>
              </a>

              <Link
                href="/impact"
                className="hidden transition-colors hover:text-black lg:inline-block"
              >
                Impact
              </Link>
            </nav>
          </div>

          {/* Center: Search by Inspiration Input */}
          <div className="hidden lg:flex flex-1 max-w-[340px] xl:max-w-[420px] mx-6">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full items-center rounded-[8px] bg-[#e8e8e8] px-3.5 py-2 text-[13.5px] transition-all hover:bg-[#e0e0e0] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#111111]/20 focus-within:shadow-sm"
            >
              <Search className="mr-2.5 h-4 w-4 text-[#777777] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setMenuOpen(true);
                }}
                placeholder="Search by Inspiration"
                className="w-full bg-transparent text-[13.5px] text-[#111111] outline-none placeholder:text-[#777777]"
              />
            </form>
          </div>

          {/* Right: Auth-style links and Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 text-[14px] font-medium text-[#222222]">
            <Link
              href="/contact"
              className="hidden transition-colors hover:text-black sm:inline-block"
            >
              Contact
            </Link>

            <Link
              href="/volunteer"
              className="hidden transition-colors hover:text-black md:inline-block"
            >
              Volunteer
            </Link>

            {/* Solid Dark Pill Button (like Be Pro) */}
            <Link
              href="/impact"
              className="inline-flex items-center justify-center rounded-[8px] bg-[#1a1a1a] px-3.5 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-black"
            >
              Our Work
            </Link>

            {/* Outlined Pill Button (like Submit Website) */}
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center rounded-[8px] border border-[#1a1a1a] bg-transparent px-3.5 py-2 text-[13.5px] font-medium text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
            >
              Get Involved
            </Link>
          </div>
        </div>
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
