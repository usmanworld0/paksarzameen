"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  X,
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Phone,
  MessageCircle,
  ChevronRight,
  Sparkles,
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
  const darkChrome = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
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

  const chromeClassName = darkChrome
    ? "border-transparent bg-transparent text-white"
    : "border-black/8 bg-white/95 text-black backdrop-blur-md";

  const actionClassName = darkChrome
    ? "text-white/90 hover:text-white"
    : "text-black/80 hover:text-black";

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
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${chromeClassName}`}
      >
        <nav className="store-container grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-3">
          
          {/* Left: Menu & Search */}
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`inline-flex items-center gap-2.5 text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
              aria-label="Open menu"
            >
              <Menu className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`hidden items-center gap-2.5 text-[12px] font-normal tracking-[0.01em] transition-colors sm:inline-flex ${actionClassName}`}
              aria-label="Open search"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Search</span>
            </button>
          </div>

          {/* Center: Brand Name */}
          <div className="justify-self-center min-w-0">
            <Link href="/" aria-label="PakSarZameen Counselling Home" className="text-center block">
              <span
                className={
                  "block font-normal uppercase leading-none tracking-[0.12em] transition-colors duration-300 truncate " +
                  (darkChrome ? "text-white" : "text-black")
                }
                style={{ fontSize: "clamp(0.9rem,1.5vw,1.15rem)" }}
              >
                PAKSARZAMEEN Education Counselling
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-5">
            <Link
              href="/universities"
              className={`hidden md:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
            >
              Universities
            </Link>

            <Link
              href="/tutoring"
              className={`hidden lg:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
            >
              Tutoring
            </Link>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-normal uppercase tracking-[0.16em] transition-all duration-300 ${
                darkChrome
                  ? "border-white/35 bg-white/10 text-white hover:bg-white/20"
                  : "border-black/15 bg-black text-white hover:bg-neutral-800"
              }`}
            >
              Free Assessment
            </button>
          </div>
        </nav>
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
          className={`h-full w-[min(92vw,620px)] overflow-y-auto bg-white px-7 pb-10 pt-7 text-black shadow-[30px_0_80px_rgba(0,0,0,0.24)] transition-transform duration-500 sm:px-9 ${
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
          <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-3">
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-black/45 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, courses, or pathways"
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/42"
              />
            </div>
          </div>

          {/* Categorized Menu */}
          <nav className="mt-8 space-y-8">
            {filteredSections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[10px] font-normal uppercase tracking-[0.28em] text-neutral-400">
                  {sec.title}
                </h4>
                <ul className="space-y-2.5">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between text-[15px] font-normal text-neutral-900 transition-colors hover:text-black"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Quick Actions Footer */}
          <div className="mt-12 border-t border-black/10 pt-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setConsultModalOpen(true);
                }}
                className="store-button-primary w-full py-3.5"
              >
                <span className="btn-label">Book Free Consultation</span>
                <span className="btn-icon">&rarr;</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[12px] text-neutral-500 pt-2">
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
