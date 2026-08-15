"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#002E21] text-[#F3F5F0] border-t border-[#BECCAD]/30 font-sans">
      <div className="ivy-container py-16 sm:py-20 space-y-12">
        
        {/* Newsletter & Headline */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center border-b border-[#BECCAD]/20 pb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#BECCAD] font-bold block mb-2">
              Stay Informed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Admissions Intel &amp; Guidance
            </h3>
            <p className="text-sm text-[#BECCAD] mt-2 font-serif">
              Subscribe for critical early action updates, essay strategies, and scholarship deadlines.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to PakSarZameen Admissions Intel.");
            }}
            className="flex items-center gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="h-12 w-full bg-[#002319] border border-[#BECCAD]/40 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#FF5A26]"
            />
            <button
              type="submit"
              className="ivy-btn-orange h-12 px-6 shrink-0 text-xs font-black"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* 4-Column Navigation Tree */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-widest text-white text-sm font-bold border-b border-[#BECCAD]/30 pb-2">
              Admissions
            </h4>
            <ul className="space-y-2 text-[#BECCAD]">
              <li>
                <Link href="/universities" className="hover:text-white transition">
                  Ivy League &amp; Top 50
                </Link>
              </li>
              <li>
                <Link href="/counselling#undergrad" className="hover:text-white transition">
                  College Admissions
                </Link>
              </li>
              <li>
                <Link href="/counselling#graduate" className="hover:text-white transition">
                  Graduate &amp; PhD Mentorship
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="hover:text-white transition">
                  Fulbright &amp; Chevening Aid
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-widest text-white text-sm font-bold border-b border-[#BECCAD]/30 pb-2">
              Tutoring &amp; Tests
            </h4>
            <ul className="space-y-2 text-[#BECCAD]">
              <li>
                <Link href="/tutoring#sat" className="hover:text-white transition">
                  Digital SAT Preparation
                </Link>
              </li>
              <li>
                <Link href="/tutoring#ielts" className="hover:text-white transition">
                  IELTS Academic
                </Link>
              </li>
              <li>
                <Link href="/tutoring#oet" className="hover:text-white transition">
                  OET Clinical Language
                </Link>
              </li>
              <li>
                <Link href="/tutoring" className="hover:text-white transition">
                  Batch Timetables
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-widest text-white text-sm font-bold border-b border-[#BECCAD]/30 pb-2">
              About &amp; Mentors
            </h4>
            <ul className="space-y-2 text-[#BECCAD]">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Advisory Leadership
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Ethics &amp; Zero Commission
                </Link>
              </li>
              <li>
                <Link href="/counselling" className="hover:text-white transition">
                  Admissions Results
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Bahawalpur Office
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading uppercase tracking-widest text-white text-sm font-bold border-b border-[#BECCAD]/30 pb-2">
              Contact Desk
            </h4>
            <ul className="space-y-2 text-[#BECCAD]">
              <li>counselling@paksarzameenwfo.com</li>
              <li>+92 300 1234567</li>
              <li>Model Town B, Bahawalpur, Punjab</li>
              <li>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#FF5A26] font-bold hover:underline mt-1"
                >
                  WhatsApp Direct Desk &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#BECCAD]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BECCAD]">
          <p>
            &copy; {new Date().getFullYear()} PakSarZameen Education Counselling. All rights reserved.
          </p>
          <p className="uppercase tracking-wider text-white font-bold">
            100% Student-First &bull; Zero Commission Quotas
          </p>
        </div>

      </div>
    </footer>
  );
}
