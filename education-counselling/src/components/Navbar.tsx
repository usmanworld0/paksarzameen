"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { FreeConsultationModal } from "@/features/education-counselling/components/BookingModals";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-[#F3F5F0] text-[#002E21] border-b border-[#BECCAD] transition-all duration-300">
        <div className="ivy-container flex h-[72px] sm:h-[84px] items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col shrink-0">
            <span className="font-heading text-lg sm:text-2xl font-black tracking-tight text-[#002E21] leading-none uppercase">
              PAKSARZAMEEN
            </span>
            <span className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.24em] text-[#207355] font-bold font-sans mt-0.5">
              Education Counselling
            </span>
          </Link>

          {/* Desktop Navigation Links (Ivy Coach style) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-[#002E21] font-sans">
            
            <div className="relative group py-6">
              <Link href="/about" className="flex items-center gap-1 hover:text-[#207355] transition">
                <span>About</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-[100%] left-0 w-64 bg-[#F3F5F0] border border-[#BECCAD] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 space-y-1">
                <Link href="/about" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  Our Leadership &amp; Ethics
                </Link>
                <Link href="/counselling" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  Why Hire Our Counselors
                </Link>
                <Link href="/universities" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  Admissions Results
                </Link>
              </div>
            </div>

            <div className="relative group py-6">
              <Link href="/counselling" className="flex items-center gap-1 hover:text-[#207355] transition">
                <span>Admissions</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-[100%] left-0 w-72 bg-[#F3F5F0] border border-[#BECCAD] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 space-y-1">
                <Link href="/counselling#undergrad" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  College Admissions Counseling
                </Link>
                <Link href="/counselling#graduate" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  Graduate &amp; PhD Mentorship
                </Link>
                <Link href="/scholarships" className="block px-3 py-2 text-xs font-semibold text-[#002E21] hover:bg-white transition">
                  Global Scholarships (Fulbright/DAAD)
                </Link>
              </div>
            </div>

            <Link href="/tutoring" className="hover:text-[#207355] transition py-6">
              Tutoring
            </Link>

            <Link href="/universities" className="hover:text-[#207355] transition py-6">
              Universities
            </Link>

            <Link href="/contact" className="hover:text-[#207355] transition py-6">
              Contact
            </Link>
          </nav>

          {/* Right: Search & Orange GET STARTED CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#002E21] hover:text-[#207355] transition"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 stroke-[2]" />
            </button>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="ivy-btn-orange text-xs sm:text-[13px] px-4 sm:px-6 py-2.5 sm:py-3 font-black"
            >
              Get Started
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 text-[#002E21] hover:text-black transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 stroke-[2]" />}
            </button>
          </div>

        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#BECCAD] bg-[#F3F5F0] py-3 px-4 animate-fade-in">
            <div className="ivy-container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/universities?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Harvard, Oxford, Stanford, programs, or test requirements..."
                  className="ivy-control text-xs sm:text-sm h-10"
                  autoFocus
                />
                <button type="submit" className="ivy-btn-dark text-xs h-10 px-5 shrink-0">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-[#BECCAD] bg-[#F3F5F0] px-6 py-6 space-y-4 animate-fade-in font-sans">
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              About Us
            </Link>
            <Link
              href="/counselling"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              Admissions Counseling
            </Link>
            <Link
              href="/universities"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              Universities Directory
            </Link>
            <Link
              href="/tutoring"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              SAT &amp; IELTS Tutoring
            </Link>
            <Link
              href="/scholarships"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              Scholarships &amp; Aid
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-[#002E21] py-1.5 border-b border-[#BECCAD]"
            >
              Contact Office
            </Link>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setConsultModalOpen(true);
              }}
              className="ivy-btn-orange w-full text-center text-xs py-3 mt-4"
            >
              Complimentary Consultation
            </button>
          </div>
        )}
      </header>

      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </>
  );
}
