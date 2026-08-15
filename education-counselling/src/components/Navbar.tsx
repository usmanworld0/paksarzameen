"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import { FreeConsultationModal } from "@/features/education-counselling/components/BookingModals";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === "/";
  // The home hero is now a light-themed wireframe tunnel, so we keep dark text with backdrop blur for readability
  const isTransparent = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuOpen) return;
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navBackground = scrolled || !isHome
    ? "border-b border-black/8 bg-white/95 text-black backdrop-blur-md shadow-xs"
    : "border-b border-black/5 bg-white/80 text-black backdrop-blur-xs";

  const menuSections = [
    {
      title: "Universities & Search",
      links: [
        { label: "All Featured Universities", href: "/universities" },
        { label: "United States (Ivy League & Top 50)", href: "/universities?search=United+States" },
        { label: "United Kingdom (Russell Group)", href: "/universities?search=United+Kingdom" },
        { label: "Canada & Australia", href: "/universities?search=Canada" },
        { label: "Europe & Germany (DAAD)", href: "/universities?search=Europe" },
      ],
    },
    {
      title: "Counselling Pathways",
      links: [
        { label: "Undergraduate Admissions Advisory", href: "/counselling#undergrad" },
        { label: "Graduate & PhD Lab Matchings", href: "/counselling#graduate" },
        { label: "Common App & SOP Review", href: "/counselling#undergrad" },
        { label: "Visa Filing & Mock Interviews", href: "/counselling#undergrad" },
      ],
    },
    {
      title: "Test Tutoring Programs",
      links: [
        { label: "IELTS Academic Preparation", href: "/tutoring#ielts" },
        { label: "OET Clinical English", href: "/tutoring#oet" },
        { label: "Digital SAT Preparation", href: "/tutoring#sat" },
      ],
    },
    {
      title: "Scholarships & Organization",
      links: [
        { label: "Global Scholarships (Fulbright, Chevening, DAAD)", href: "/scholarships" },
        { label: "About PakSarZameen & Advisory Ethics", href: "/about" },
        { label: "Meet Our Mentors", href: "/about" },
        { label: "Office Location & Contact", href: "/contact" },
      ],
    },
  ];

  const filteredSections = menuSections.map((sec) => ({
    ...sec,
    links: sec.links.filter((l) =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((sec) => sec.links.length > 0);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBackground}`}
      >
        <div className="store-container flex h-[68px] sm:h-[76px] items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Menu & Search */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-normal tracking-[0.01em] text-neutral-900 hover:text-black transition"
              aria-label="Open menu"
            >
              <Menu className="h-[18px] w-[18px] stroke-[1.5]" />
              <span className="font-normal">Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-normal tracking-[0.01em] text-neutral-600 hover:text-black transition"
              aria-label="Open search"
            >
              <Search className="h-[16px] w-[16px] stroke-[1.5]" />
              <span>Search</span>
            </button>
          </div>

          {/* Center: Brand Name (Responsive & never overlapping) */}
          <div className="min-w-0 flex-1 px-2 text-center">
            <Link href="/" aria-label="PakSarZameen Counselling Home" className="inline-block max-w-full truncate">
              {/* Short on mobile, full on tablet+ */}
              <span className="sm:hidden text-[11px] font-normal uppercase tracking-[0.14em] text-neutral-950 truncate block">
                PAKSARZAMEEN
              </span>
              <span className="hidden sm:inline-block text-[13px] md:text-[14.5px] font-normal uppercase tracking-[0.12em] text-neutral-950 truncate">
                PAKSARZAMEEN Education Counselling
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/universities"
              className="hidden lg:inline-flex text-[12px] font-normal tracking-[0.01em] text-neutral-600 hover:text-black transition"
            >
              Universities
            </Link>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-black text-white px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.14em] hover:bg-neutral-800 transition whitespace-nowrap"
            >
              <span className="hidden sm:inline">Free Assessment</span>
              <span className="sm:hidden">Assessment</span>
            </button>
          </div>

        </div>
      </header>

      {/* Slide-out Luxury Drawer */}
      <div
        className={`fixed inset-0 z-[70] transition-all duration-500 ${
          menuOpen
            ? "pointer-events-auto bg-black/48 backdrop-blur-[1.5px]"
            : "pointer-events-none bg-black/0"
        }`}
        aria-hidden={!menuOpen}
      >
        <aside
          ref={drawerRef}
          className={`h-full w-[min(92vw,580px)] overflow-y-auto bg-white px-6 sm:px-9 pb-10 pt-7 text-black shadow-[30px_0_80px_rgba(0,0,0,0.24)] transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 text-[13px] font-normal tracking-[0.01em] text-black hover:opacity-60 transition"
            >
              <X className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Close</span>
            </button>

            <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-400">
              Navigation Menu
            </span>
          </div>

          {/* Search Box */}
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-3">
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-black/45 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, courses, or pathways..."
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/42"
              />
            </div>
          </div>

          {/* Categorized Menu */}
          <nav className="mt-8 space-y-7">
            {filteredSections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h4 className="text-[10px] font-normal uppercase tracking-[0.28em] text-neutral-400">
                  {sec.title}
                </h4>
                <ul className="space-y-2">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between py-1 text-[14px] sm:text-[15px] font-normal text-neutral-900 transition-colors hover:text-black"
                      >
                        <span className="break-words">{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Quick Actions Footer */}
          <div className="mt-10 border-t border-black/10 pt-6 space-y-4">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setConsultModalOpen(true);
              }}
              className="store-button-primary w-full py-3.5 text-xs"
            >
              <span className="btn-label">Book Free Consultation</span>
              <span className="btn-icon">&rarr;</span>
            </button>

            <div className="flex items-center justify-between text-[11px] sm:text-[12px] text-neutral-500 pt-1">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                WhatsApp Desk &rarr;
              </a>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-black transition">
                Office Coordinates
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </>
  );
}
