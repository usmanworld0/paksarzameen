"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap, Menu, X, BookOpen } from "lucide-react";

export function Navbar() {
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [tutoringOpen, setTutoringOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] h-[72px] flex items-center transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 border-b border-black/[0.06] shadow-sm backdrop-blur-md" 
          : "bg-white/80 border-b border-black/[0.03] backdrop-blur-md"
      } text-[#1d1d1f]`}
    >
      <nav className="w-full max-w-[1320px] mx-auto px-[6vw] flex items-center justify-between relative">
        {/* Left Column - Subsite identifier */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <GraduationCap className="h-5 w-5 text-[#0f7a47]" />
          <span className="text-[12px] font-black tracking-[0.12em] uppercase text-[#1d1d1f]">
            Counselling
          </span>
        </Link>

        {/* Center Column - Brand Logo */}
        <Link
          href="/"
          className="text-center font-normal uppercase leading-none tracking-[0.18em] text-[#1d1d1f] hover:opacity-75 transition-opacity absolute left-1/2 -translate-x-1/2"
          style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.8rem)" }}
        >
          PAKSARZAMEEN
        </Link>

        {/* Desktop Menu links */}
        <div className="hidden lg:flex items-center gap-6 ml-[15vw] text-xs font-semibold uppercase tracking-wider text-[#707072]">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">Home</Link>
          
          <Link href="/universities" className="hover:text-[#1d1d1f] transition-colors">Universities</Link>

          {/* Counselling Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setCounsellingOpen(true)}
            onMouseLeave={() => setCounsellingOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#1d1d1f] transition-colors uppercase font-semibold">
              Counselling
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${counsellingOpen ? "rotate-185" : ""}`} />
            </button>
            {counsellingOpen && (
              <div className="absolute top-[20px] left-0 w-56 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-xl flex flex-col gap-1 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                <Link
                  href="/counselling#undergrad"
                  className="rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-[#0f7a47] transition"
                >
                  Undergraduate Counselling
                </Link>
                <Link
                  href="/counselling#graduate"
                  className="rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-[#0f7a47] transition"
                >
                  Graduate Counselling
                </Link>
              </div>
            )}
          </div>

          {/* Tutoring Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setTutoringOpen(true)}
            onMouseLeave={() => setTutoringOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#1d1d1f] transition-colors uppercase font-semibold">
              Tutoring
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${tutoringOpen ? "rotate-185" : ""}`} />
            </button>
            {tutoringOpen && (
              <div className="absolute top-[20px] left-0 w-48 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-xl flex flex-col gap-1 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                <Link href="/tutoring#ielts" className="rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-[#0f7a47] transition">
                  IELTS Preparation
                </Link>
                <Link href="/tutoring#oet" className="rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-[#0f7a47] transition">
                  OET Preparation
                </Link>
                <Link href="/tutoring#sat" className="rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-[#0f7a47] transition">
                  SAT Preparation
                </Link>
              </div>
            )}
          </div>

          <Link href="/scholarships" className="hover:text-[#1d1d1f] transition-colors">Scholarships</Link>
          <Link href="/about" className="hover:text-[#1d1d1f] transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-[#1d1d1f] transition-colors">Contact Us</Link>
        </div>

        {/* Right Column - Booking CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/#consultation-form"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#0f7a47] px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-xl transition text-[#1d1d1f]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-[72px] inset-x-0 bg-white border-b border-black/[0.06] shadow-xl py-6 px-[6vw] flex flex-col gap-4 z-[95] lg:hidden animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 text-xs font-black uppercase tracking-wider text-[#707072]">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="hover:text-[#1d1d1f] transition-colors py-1">Home</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/universities" className="hover:text-[#1d1d1f] transition-colors py-1">Universities</Link>
            
            {/* Counselling Links for Mobile */}
            <div className="py-1">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">Counselling Pathways</span>
              <div className="pl-3 flex flex-col gap-2 border-l border-gray-200 mt-1">
                <Link onClick={() => setMobileMenuOpen(false)} href="/counselling#undergrad" className="hover:text-[#1d1d1f] transition-colors py-0.5">Undergraduate</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/counselling#graduate" className="hover:text-[#1d1d1f] transition-colors py-0.5">Graduate</Link>
              </div>
            </div>

            {/* Tutoring Links for Mobile */}
            <div className="py-1">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">Tutoring Prep</span>
              <div className="pl-3 flex flex-col gap-2 border-l border-gray-200 mt-1">
                <Link onClick={() => setMobileMenuOpen(false)} href="/tutoring#ielts" className="hover:text-[#1d1d1f] transition-colors py-0.5">IELTS Prep</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/tutoring#oet" className="hover:text-[#1d1d1f] transition-colors py-0.5">OET Prep</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/tutoring#sat" className="hover:text-[#1d1d1f] transition-colors py-0.5">SAT Prep</Link>
              </div>
            </div>

            <Link onClick={() => setMobileMenuOpen(false)} href="/scholarships" className="hover:text-[#1d1d1f] transition-colors py-1">Scholarships</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/about" className="hover:text-[#1d1d1f] transition-colors py-1">About Us</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/contact" className="hover:text-[#1d1d1f] transition-colors py-1">Contact Us</Link>
          </div>
          
          <div className="pt-4 border-t border-black/[0.06] flex">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/#consultation-form"
              className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-[#0f7a47] text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
