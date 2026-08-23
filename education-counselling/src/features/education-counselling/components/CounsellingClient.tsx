"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Check,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { DbStore } from "@/lib/db";
import { TunnelHero } from "./TunnelHero";
import { ScholarshipsShowcase } from "./ScholarshipsShowcase";
import {
  FreeConsultationModal,
  CourseApplicationModal,
  PrivateCounsellingModal,
} from "./BookingModals";

interface CounsellingClientProps {
  initialStore: DbStore;
}

export function CounsellingClient({ initialStore }: CounsellingClientProps) {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const universities = initialStore.universities || [];
  const featuredUnis = universities.slice(0, 6);
  const mentors = initialStore.mentors || [];
  const tutoringCourses = initialStore.tutoring || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set("search", searchKeyword.trim());
    if (selectedCountry !== "All") params.set("country", selectedCountry);
    if (selectedLevel !== "All") params.set("level", selectedLevel);
    router.push(`/universities?${params.toString()}`);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry",
          studentName: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone || "Direct Homepage Form",
          description: inquiryMsg,
        }),
      });
      if (res.ok) {
        setInquirySuccess(true);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryPhone("");
        setInquiryMsg("");
      }
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setInquiryLoading(false);
    }
  };



  const pressLogos = [
    "The New York Times",
    "The Wall Street Journal",
    "The Washington Post",
    "CNN",
    "ABC Nightline",
    "The Atlantic",
    "BBC News",
    "Dawn News",
  ];

  return (
    <div className="w-full bg-[#F3F5F0] text-[#002E21] antialiased">
      
      {/* 1. 3D PERSPECTIVE TUNNEL HERO (IVY COACH LOOK & PALETTE) */}
      <TunnelHero
        universities={universities}
        onBookConsultation={() => setConsultModalOpen(true)}
      />

{/* 1.5. ADMISSIONS PATHWAYS: MINIMAL & EDITORIAL */}
      <section className="border-b border-[#BECCAD] bg-[#F3F5F0] overflow-hidden">
        {/* Subtle Marquee Accent */}
        <div className="border-b border-[#BECCAD]/60 bg-white/70 py-2.5 overflow-hidden select-none">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#002E21]/70 font-sans">
            <span>• Undergraduate Admissions</span>
            <span>• Common App &amp; UCAS Advisory</span>
            <span>• Graduate &amp; Doctoral Mentorship</span>
            <span>• Research Placements &amp; Lab Matching</span>
            <span>• Statement of Purpose Editorial</span>
            <span>• Global Merit &amp; Need-Based Scholarships</span>
            <span>• Undergraduate Admissions</span>
            <span>• Common App &amp; UCAS Advisory</span>
            <span>• Graduate &amp; Doctoral Mentorship</span>
            <span>• Research Placements &amp; Lab Matching</span>
            <span>• Statement of Purpose Editorial</span>
            <span>• Global Merit &amp; Need-Based Scholarships</span>
          </div>
        </div>

        {/* Dual Cards Grid */}
        <div className="ivy-container py-12 sm:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* UNDERGRADUATE ADMISSIONS CARD */}
            <Link
              href="/counselling#undergrad"
              className="group block bg-white border border-[#BECCAD] p-8 sm:p-10 transition-all duration-300 hover:border-[#002E21] hover:shadow-md relative"
            >
              <div className="flex items-center justify-between border-b border-[#BECCAD]/50 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#207355]" />
                  <span className="text-[10.5px] uppercase tracking-[0.22em] text-[#207355] font-bold font-sans">
                    01 / Undergraduate
                  </span>
                </div>
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#F3F5F0] text-[#002E21] group-hover:bg-[#002E21] group-hover:text-white transition-colors duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#002E21] tracking-tight group-hover:text-[#207355] transition-colors">
                  Undergraduate Admissions
                </h3>
                <p className="text-xs sm:text-sm font-serif text-[#002E21]/80 leading-relaxed">
                  Strategic profile development, line-by-line essay editing, and financial aid packaging for Bachelor&apos;s candidates targeting top-tier global universities.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#BECCAD]/40 flex items-center justify-between text-xs font-sans">
                <span className="text-[11px] text-[#002E21]/60 font-medium">
                  Common App • UCAS • Ivy League • Aid
                </span>
                <span className="font-bold uppercase tracking-wider text-[#002E21] group-hover:text-[#207355] inline-flex items-center gap-1">
                  Learn More <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </span>
              </div>
            </Link>

            {/* GRADUATE ADMISSIONS CARD */}
            <Link
              href="/counselling#graduate"
              className="group block bg-white border border-[#BECCAD] p-8 sm:p-10 transition-all duration-300 hover:border-[#002E21] hover:shadow-md relative"
            >
              <div className="flex items-center justify-between border-b border-[#BECCAD]/50 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#207355]" />
                  <span className="text-[10.5px] uppercase tracking-[0.22em] text-[#207355] font-bold font-sans">
                    02 / Graduate &amp; PhD
                  </span>
                </div>
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#F3F5F0] text-[#002E21] group-hover:bg-[#002E21] group-hover:text-white transition-colors duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#002E21] tracking-tight group-hover:text-[#207355] transition-colors">
                  Graduate &amp; PhD Mentorship
                </h3>
                <p className="text-xs sm:text-sm font-serif text-[#002E21]/80 leading-relaxed">
                  Academic laboratory matching, research proposal positioning, and Statement of Purpose editorial for Master&apos;s and Doctoral candidates.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#BECCAD]/40 flex items-center justify-between text-xs font-sans">
                <span className="text-[11px] text-[#002E21]/60 font-medium">
                  Faculty Outreach • SOP • Funded Placements
                </span>
                <span className="font-bold uppercase tracking-wider text-[#002E21] group-hover:text-[#207355] inline-flex items-center gap-1">
                  Learn More <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>


{/* 7. SEARCH & DIRECTORY OF UNIVERSITIES */}
      <section className="py-16 sm:py-24 border-b border-[#BECCAD]">
        <div className="ivy-container space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BECCAD] pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] text-[#207355] font-bold font-sans">
                Explore Institutions
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#002E21] mt-1">
                Featured Global Universities
              </h2>
            </div>
            <Link href="/universities" className="text-xs font-bold uppercase tracking-wider text-[#002E21] hover:text-[#207355] transition">
              Full Directory &rarr;
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-[#BECCAD] p-4 grid gap-3 sm:grid-cols-[1fr_180px_180px_auto] items-center"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search Harvard, Toronto, Oxford, or major..."
                className="ivy-control pl-10 text-xs sm:text-sm"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="ivy-control text-xs sm:text-sm"
              >
                <option value="All">All Countries</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Europe">Europe / Germany</option>
              </select>
            </div>

            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="ivy-control text-xs sm:text-sm"
              >
                <option value="All">All Degrees</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate (MS/PhD)</option>
              </select>
            </div>

            <button
              type="submit"
              className="ivy-btn-orange text-xs px-6 h-12 shrink-0 font-bold"
            >
              Search
            </button>
          </form>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredUnis.map((uni) => (
              <article key={uni.slug} className="bg-white border border-[#BECCAD] flex flex-col justify-between hover:border-[#002E21] transition shadow-xs">
                <Link href={`/universities/${uni.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={uni.banner}
                    alt={uni.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#002E21] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-sans">
                    QS #{uni.ranking.qs}
                  </div>
                  {uni.scholarships?.available && (
                    <div className="absolute top-3 right-3 bg-[#0f7a47] text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider font-sans">
                      Scholarship
                    </div>
                  )}
                </Link>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#207355] font-bold block mb-1 font-sans">
                      {uni.country}
                    </span>
                    <h3 className="text-base font-bold text-[#002E21] font-sans">
                      {uni.name}
                    </h3>
                    <p className="text-xs font-serif text-[#002E21]/70 line-clamp-2 mt-1.5">
                      {uni.overview?.about}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#BECCAD] flex items-center justify-between text-xs font-sans">
                    <span className="text-[#002E21]/70">Tuition: <strong>{uni.fees?.tuition}</strong></span>
                    <Link href={`/universities/${uni.slug}`} className="text-[#0f7a47] font-bold hover:underline">
                      Profile &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* 2. GLOBAL SCHOLARSHIPS & FELLOWSHIPS SHOWCASE (INTERACTIVE WITH LOGOS) */}
      <ScholarshipsShowcase
        onOpenConsultation={() => setConsultModalOpen(true)}
      />

      {/* 5. IN THE PRESS (MEDIA TICKER) */}
      <section className="bg-white py-12 border-b border-[#BECCAD]">
        <div className="ivy-container space-y-6">
          <p className="text-center text-[11px] uppercase tracking-[0.28em] text-[#002E21]/60 font-bold font-sans">
            In The Press &amp; Media Mentions
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#002E21]">
            {pressLogos.map((logo, idx) => (
              <span key={idx} className="border-b border-[#002E21]/30 pb-0.5">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FORMER ADMISSIONS OFFICERS & MENTORS */}
      <section className="py-16 sm:py-24 border-b border-[#BECCAD]">
        <div className="ivy-container space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BECCAD] pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] text-[#207355] font-bold font-sans">
                Our Advisory Team
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#002E21] mt-1">
                Admissions Consultants &amp; Mentors
              </h2>
            </div>
            <Link href="/about" className="text-xs font-bold uppercase tracking-wider text-[#002E21] hover:text-[#207355] transition">
              Meet All Mentors &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m: any) => (
              <div
                key={m.id}
                className="bg-white border border-[#BECCAD] p-6 flex flex-col justify-between space-y-4 hover:border-[#002E21] transition"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden border border-[#BECCAD]/60">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#002E21] font-sans">{m.name}</h3>
                    <p className="text-xs text-[#207355] font-bold font-sans">{m.role}</p>
                    <p className="text-[11px] text-[#002E21]/60 font-sans">{m.organization}</p>
                  </div>

                  <p className="text-xs font-serif text-[#002E21]/80 leading-relaxed line-clamp-3">
                    &ldquo;{m.bio}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#BECCAD] flex justify-end">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#0f7a47] hover:underline"
                  >
                    LinkedIn Profile &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. TUTORING PROGRAMS (SAT, IELTS, OET) */}
      <section className="py-16 sm:py-24 border-b border-[#BECCAD]">
        <div className="ivy-container space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-[#207355] font-bold font-sans">
              Test Preparation
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#002E21]">
              Standardized Test Tutoring
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {tutoringCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-[#BECCAD] p-6 flex flex-col justify-between space-y-4 hover:border-[#002E21] transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-sans">
                    <span className="bg-[#F3F5F0] border border-[#BECCAD] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#002E21]">
                      {course.format}
                    </span>
                    <span className="text-xs text-[#207355] font-bold">{course.duration}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#002E21] font-sans">
                    {course.name}
                  </h3>

                  <p className="text-xs font-serif text-[#002E21]/80 leading-relaxed min-h-[48px]">
                    {course.description}
                  </p>

                  <div className="space-y-1 pt-3 border-t border-[#BECCAD] text-xs font-sans">
                    <div className="flex justify-between">
                      <span className="text-[#002E21]/60">Timings:</span>
                      <strong className="text-[#002E21]">{course.schedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#002E21]/60">Tuition:</span>
                      <strong className="text-[#002E21]">{course.fee}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#BECCAD]">
                  <a
                    href={`https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20want%20to%20register%20for%20the%20${encodeURIComponent(course.name)}%20tutoring%20batch.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ivy-btn-dark w-full text-center text-xs py-3"
                  >
                    Register via WhatsApp &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. BOTTOM CTA: TOWARD THE CONQUEST OF ADMISSION */}
      <section className="bg-[#002E21] text-white py-16 sm:py-24">
        <div className="ivy-container max-w-3xl space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              TOWARD THE <span className="underline-accent">CONQUEST</span> OF ADMISSION
            </h2>
            <p className="text-sm sm:text-base text-[#BECCAD] font-serif max-w-xl mx-auto">
              If you&apos;re interested in PakSarZameen&apos;s admissions counseling, fill out our consultation form below.
            </p>
          </div>

          <div className="bg-white text-[#002E21] border border-[#BECCAD] p-6 sm:p-10 shadow-xl">
            {inquirySuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#207355] mx-auto" />
                <h3 className="text-xl font-bold font-sans">Consultation Request Received</h3>
                <p className="text-xs font-serif text-neutral-600 max-w-sm mx-auto">
                  Our senior advisory coordinator will contact you to schedule your complimentary session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 font-sans">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#002E21] block mb-1">
                      Student Full Name*
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Usman Khan"
                      className="ivy-control text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#002E21] block mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="usman@example.com"
                      className="ivy-control text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#002E21] block mb-1">
                    WhatsApp Phone Number*
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="ivy-control text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#002E21] block mb-1">
                    Target Universities / Grades / Questions
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Tell us about your current academic standing, target schools, and testing status..."
                    className="ivy-control text-xs py-2.5 h-auto"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="ivy-btn-orange w-full py-4 text-xs font-black uppercase tracking-wider"
                >
                  {inquiryLoading ? "Submitting..." : "Submit Consultation Request"}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Modals Mount */}
      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
      <CourseApplicationModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
      />
      <PrivateCounsellingModal
        isOpen={privateModalOpen}
        onClose={() => setPrivateModalOpen(false)}
      />
    </div>
  );
}
