"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chromeClassName = scrolled
    ? "border-black/8 bg-white/95 text-black backdrop-blur-md shadow-sm"
    : "border-transparent bg-transparent text-white";

  const actionClassName = scrolled
    ? "text-black/80 hover:text-black"
    : "text-white/80 hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] border-b transition-all duration-500 h-[78px] flex items-center ${chromeClassName}`}
    >
      <nav className="w-full max-w-[1320px] mx-auto px-[6vw] flex justify-between items-center">
        {/* Sub-site identifier */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-[12px] font-bold tracking-[0.1em] uppercase ${actionClassName}`}>
            🎓 Counselling Portal
          </span>
        </Link>

        {/* Brand Center Logo */}
        <a
          href="https://paksarzameenwfo.com"
          className="text-center font-normal uppercase leading-none tracking-[0.16em] transition-colors"
          style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)" }}
        >
          PAKSARZAMEEN
        </a>

        {/* Utilities on Right */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://paksarzameenwfo.com/contact"
            className={`text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
          >
            Call Us
          </a>
          <a
            href="https://paksarzameenwfo.com"
            className={`hidden sm:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
          >
            Main Site &rarr;
          </a>
        </div>
      </nav>
    </header>
  );
}
