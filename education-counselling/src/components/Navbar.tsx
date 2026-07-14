"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-[90] h-[64px] flex items-center border-b border-black/[0.06] bg-white/80 backdrop-blur-md text-[#1d1d1f]"
    >
      <nav className="w-full max-w-[1320px] mx-auto px-[6vw] grid grid-cols-3 items-center">
        {/* Left Column - Subsite identifier */}
        <Link href="/" className="justify-self-start flex items-center hover:opacity-70 transition-opacity">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
            🎓 Counselling Portal
          </span>
        </Link>

        {/* Center Column - Brand Logo */}
        <a
          href="https://paksarzameenwfo.com"
          className="justify-self-center text-center font-normal uppercase leading-none tracking-[0.16em] text-[#1d1d1f] hover:opacity-70 transition-opacity"
          style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}
        >
          PAKSARZAMEEN
        </a>

        {/* Right Column - Utilities */}
        <div className="justify-self-end flex items-center gap-6">
          <a
            href="https://paksarzameenwfo.com/contact"
            className="text-[11px] font-medium tracking-[0.02em] text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            Call Us
          </a>
          <a
            href="https://paksarzameenwfo.com"
            className="hidden sm:inline-flex text-[11px] font-medium tracking-[0.02em] text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            Main Site &rarr;
          </a>
        </div>
      </nav>
    </header>
  );
}
