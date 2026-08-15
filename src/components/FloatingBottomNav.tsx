"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const SECTIONS = [
  { id: "home-hero", label: "Overview" },
  { id: "home-problem", label: "About" },
  { id: "home-solution", label: "What We Do" },
  { id: "departments-heading", label: "Departments" },
  { id: "home-team", label: "Team" },
  { id: "home-outreach", label: "Directory" },
] as const;

export function FloatingBottomNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home-hero");

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      
      const sections = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return { id: sec.id, top: 0, bottom: 0 };
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        return { id: sec.id, top, bottom };
      });

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].top) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  if (!isHome) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Floating section navigation"
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 flex items-center gap-3 pointer-events-auto"
    >
      {/* Back to Top Square Button (like Awwwards [ ↑ ]) */}
      <button
        type="button"
        onClick={scrollToTop}
        className="hidden sm:flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-[#1f1f1f] text-white shadow-xl transition-all hover:bg-black hover:scale-105 active:scale-95"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Main Awwwards Dock Container */}
      <div className="flex items-center gap-1 sm:gap-2 rounded-[14px] bg-[#1f1f1f] p-1.5 sm:px-3 sm:py-2 text-[13px] font-medium text-white shadow-[0_12px_44px_rgba(0,0,0,0.4)] transition-all">
        {/* Brand Monogram */}
        <button
          type="button"
          onClick={scrollToTop}
          className="px-2 transition-opacity hover:opacity-80 flex items-center justify-center"
        >
          <Image
            src="/paksarzameen_logo.png"
            alt="PakSarZameen"
            width={48}
            height={20}
            style={{ height: "20px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        </button>

        {/* Section Links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className={`rounded-[8px] px-2.5 sm:px-3.5 py-2 text-[12.5px] sm:text-[13px] transition-all duration-200 ${
                  isActive
                    ? "text-white font-semibold bg-white/10"
                    : "text-[#999999] hover:text-white"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Right CTA Button (like Awwwards [ Visit Sotd. ]) */}
        <Link
          href="/get-involved"
          className="ml-1 inline-flex items-center justify-center rounded-[10px] bg-white px-4 sm:px-5 py-2 text-[13px] font-semibold text-[#111111] transition-all hover:bg-[#e4e4e4] active:scale-95"
        >
          Join PSZ
        </Link>
      </div>
    </aside>
  );
}
