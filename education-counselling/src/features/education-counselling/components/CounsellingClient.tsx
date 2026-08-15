"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  CheckCircle2,
} from "lucide-react";
import { DbStore } from "@/lib/db";
import { TunnelHero } from "./TunnelHero";
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

  // Search filter states
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Modal states
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  // Quick inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
          phone: "Web Inquiry Form",
          description: inquiryMsg,
        }),
      });
      if (res.ok) {
        setInquirySuccess(true);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryMsg("");
      }
    } catch {
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const faqs = [
    {
      q: "Does PakSarZameen charge initial consultation fees?",
      a: "No. Our initial 30-minute profile assessment and eligibility evaluation is 100% free of charge for students and families.",
    },
    {
      q: "Do you guarantee student visas or university admissions?",
      a: "No ethical counsellor can guarantee admission or visa issuance, as final decisions lie strictly with university admission boards and embassy officers. We build the highest-strength academic applications to maximize selection probability.",
    },
    {
      q: "What countries and universities do you cover?",
      a: "We advise on leading universities across the United States (Ivy League & Top 50), United Kingdom (Russell Group), Canada (U15), Australia (Group of Eight), Europe (DAAD Germany & Scandinavian public tuition waivers), the Middle East, and East Asia.",
    },
    {
      q: "Can you assist with need-based financial aid and external scholarships?",
      a: "Yes. We specialize in CSS Profile submissions, university institutional aid packages, and premier government awards including the US Fulbright, UK Chevening, Commonwealth, and German DAAD programs.",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Noor",
      degree: "B.S. Computer Science",
      destination: "University of Toronto, Canada",
      quote: "The personalized guidance on my supplemental essays and high school profile structure was invaluable. I secured admission with an entrance scholarship.",
      rating: 5,
    },
    {
      name: "Ahmed Raza",
      degree: "M.S. Mechanical Engineering",
      destination: "TU Munich, Germany (DAAD)",
      quote: "PakSarZameen helped me refine my research proposal and connect with the right faculty lab in Germany. I was awarded full DAAD funding.",
      rating: 5,
    },
    {
      name: "Zainab Malik",
      degree: "Digital SAT & Common App",
      destination: "Harvard College, USA",
      quote: "The SAT tutoring methodology and line-by-line personal statement reviews transformed my application. Highly transparent and supportive advisors.",
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-white text-[#111111] antialiased">
      
      {/* 1. 3D PERSPECTIVE TUNNEL HERO (STORE DESIGN ENHANCED) */}
      <TunnelHero
        universities={universities}
        onBookConsultation={() => setConsultModalOpen(true)}
      />

      {/* 2. MINIMALIST SEARCH PANEL */}
      <section id="search-section" className="relative z-20 -mt-6 sm:-mt-8 scroll-mt-24">
        <div className="store-container">
          <form
            onSubmit={handleSearchSubmit}
            className="store-panel rounded-2xl p-4 sm:p-5 grid gap-3 sm:grid-cols-[1fr_180px_180px_auto] items-center"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search university name, country, or major..."
                className="store-control pl-10 text-xs sm:text-sm placeholder:text-neutral-400"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="store-control text-xs sm:text-sm font-normal text-neutral-800"
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
                className="store-control text-xs sm:text-sm font-normal text-neutral-800"
              >
                <option value="All">All Degrees</option>
                <option value="Undergraduate">Undergraduate (Bachelors)</option>
                <option value="Graduate">Graduate (Masters / PhD)</option>
              </select>
            </div>

            <button
              type="submit"
              className="store-button-primary h-12 px-6 rounded-xl"
            >
              <span className="btn-label">Search</span>
              <span className="btn-icon">&rarr;</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. FEATURED UNIVERSITIES SECTION (STORE CARD GRID) */}
      <section className="store-section">
        <div className="store-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-10 gap-3 border-b border-black/6">
            <div>
              <p className="store-kicker">Global Institution Profiles</p>
              <h2 className="mt-1.5 store-heading">Featured Global Universities</h2>
            </div>
            <Link
              href="/universities"
              className="store-link-inline self-start sm:self-auto"
            >
              View All Universities &rarr;
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredUnis.map((uni) => (
              <article key={uni.slug} className="group flex h-full flex-col">
                <Link
                  href={`/universities/${uni.slug}`}
                  className="relative block overflow-hidden rounded-xl border border-black/6 bg-neutral-100"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={uni.banner}
                      alt={uni.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-white/35 bg-white/86 px-2.5 py-0.5 text-[8.5px] font-normal uppercase tracking-[0.16em] text-neutral-950 backdrop-blur-md">
                        QS #{uni.ranking.qs}
                      </span>
                      {uni.scholarships.available && (
                        <span className="rounded-full border border-white/35 bg-neutral-950 px-2.5 py-0.5 text-[8.5px] font-normal uppercase tracking-[0.16em] text-white">
                          Scholarship Available
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <p className="text-[9.5px] font-normal uppercase tracking-[0.18em] text-white/80">
                        📍 {uni.country}
                      </p>
                      <h3 className="mt-0.5 text-[1.05rem] font-normal leading-snug tracking-[-0.02em] text-white truncate">
                        {uni.name}
                      </h3>
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex flex-col justify-between flex-1 space-y-2.5 px-1">
                  <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-neutral-600 line-clamp-2">
                    {uni.overview?.about}
                  </p>

                  <div className="pt-2 border-t border-black/6 flex items-center justify-between text-xs text-neutral-700">
                    <div>
                      <span className="text-neutral-400 block text-[9.5px] uppercase tracking-wider">Tuition Est.</span>
                      <strong className="font-normal text-neutral-900">{uni.fees.tuition}</strong>
                    </div>
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="store-link-inline font-normal text-[10px]"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADVISORY PATHWAYS (EDITORIAL SPLIT PANELS) */}
      <section className="store-section-soft border-y border-black/6">
        <div className="store-container">
          <div className="text-center max-w-xl mx-auto pb-10 sm:pb-14">
            <p className="store-kicker">Specialized Advisory</p>
            <h2 className="mt-1.5 store-heading">Structured Counselling Services</h2>
            <p className="mt-2.5 store-subheading">
              Tailored assistance designed to maximize candidate competitiveness at every academic phase.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Undergraduate Panel */}
            <div className="store-card rounded-2xl p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="store-pill-label">Pathway 01</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">High School &bull; A-Levels</span>
                </div>

                <h3 className="text-[1.3rem] sm:text-[1.55rem] font-normal leading-snug tracking-[-0.03em] text-neutral-950">
                  Undergraduate Admissions Advisory
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600">
                  End-to-end guidance for high school graduates targeting Bachelor&apos;s degrees in the US, UK, Canada, and Australia.
                </p>

                <ul className="space-y-2 pt-2 text-xs sm:text-sm text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Common App, UCAS, and direct university portal strategy</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Personal Statement &amp; supplemental essay brainstorming</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Extra-curricular profile building &amp; honours formatting</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>CSS Profile &amp; international financial aid filings</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-black/6 flex items-center justify-between">
                <Link
                  href="/counselling#undergrad"
                  className="store-link-inline text-[10px]"
                >
                  Learn More &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setPrivateModalOpen(true)}
                  className="store-pill-outline text-xs"
                >
                  Book 1-on-1 Session
                </button>
              </div>
            </div>

            {/* Graduate Panel */}
            <div className="store-card rounded-2xl p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="store-pill-label">Pathway 02</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Masters &bull; Ph.D. &bull; Labs</span>
                </div>

                <h3 className="text-[1.3rem] sm:text-[1.55rem] font-normal leading-snug tracking-[-0.03em] text-neutral-950">
                  Graduate Mentorship &amp; Lab Placement
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600">
                  Specialized support for Master&apos;s and Doctoral candidates seeking fully funded research assistantships and grants.
                </p>

                <ul className="space-y-2 pt-2 text-xs sm:text-sm text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Faculty supervisor matching &amp; cold outreach correspondence</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Statement of Purpose (SOP) line-by-line editorial review</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Research proposal structuring &amp; academic CV formatting</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                    <span>Fulbright, DAAD, &amp; Chevening scholarship mentoring</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-black/6 flex items-center justify-between">
                <Link
                  href="/counselling#graduate"
                  className="store-link-inline text-[10px]"
                >
                  Learn More &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setPrivateModalOpen(true)}
                  className="store-pill-outline text-xs"
                >
                  Book Research Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEST PREPARATION (TUTORING COURSES) */}
      <section className="store-section">
        <div className="store-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-10 gap-3 border-b border-black/6">
            <div>
              <p className="store-kicker">Standardized Testing</p>
              <h2 className="mt-1.5 store-heading">Tutoring &amp; Test Preparation</h2>
            </div>
            <Link href="/tutoring" className="store-link-inline self-start sm:self-auto">
              View Tutoring Schedules &rarr;
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
            {tutoringCourses.map((course) => (
              <div
                key={course.id}
                className="store-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="store-pill-label">{course.format}</span>
                    <span className="text-xs text-neutral-500">{course.duration}</span>
                  </div>

                  <h3 className="text-[1.2rem] font-normal leading-snug tracking-[-0.02em] text-neutral-950">
                    {course.name}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 min-h-[50px]">
                    {course.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-black/6 text-xs text-neutral-700">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Timings:</span>
                      <strong className="font-normal text-neutral-900 text-right truncate max-w-[170px]">{course.schedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Tuition Fee:</span>
                      <strong className="font-normal text-neutral-900">{course.fee}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/6">
                  <a
                    href={`https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(course.name)}%20batch.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-button-secondary w-full text-center"
                  >
                    Register via WhatsApp &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MENTORS & ETHICAL PHILOSOPHY (ABOUT SECTION) */}
      <section className="store-section-soft border-y border-black/6">
        <div className="store-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.3fr] items-center">
            
            <div className="space-y-5">
              <p className="store-kicker">The PakSarZameen Standard</p>
              <h2 className="store-heading">
                Advising with radical transparency, ethics, and zero commission bias.
              </h2>
              
              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600">
                <p>
                  PakSarZameen was created to dismantle the deceptive commercial agency model. We do not sell quotas to low-tier private colleges. We work exclusively to position ambitious Pakistani students for top global institutions matching their true academic potential.
                </p>
                <p>
                  Our advisory team consists of alumni and graduates who have walked the same path, offering direct feedback on personal essays, lab correspondence, and visa applications.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
                <Link href="/about" className="store-button-primary">
                  <span className="btn-label">Read Full Mission</span>
                  <span className="btn-icon">&rarr;</span>
                </Link>
                <Link href="/contact" className="store-pill-outline text-xs">
                  Visit Bahawalpur Office
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {mentors.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="store-card rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-normal text-neutral-950 truncate">{m.name}</h4>
                      <p className="text-[11px] text-neutral-500 truncate">{m.role}</p>
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-600 line-clamp-3">
                      &ldquo;{m.bio}&rdquo;
                    </p>
                  </div>

                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-wider text-blue-600 hover:underline pt-2 border-t border-black/6"
                  >
                    LinkedIn Profile &rarr;
                  </a>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. STUDENT VOICES & TESTIMONIALS */}
      <section className="store-section">
        <div className="store-container">
          <div className="text-center max-w-xl mx-auto pb-10 sm:pb-14">
            <p className="store-kicker">Student Outcomes</p>
            <h2 className="mt-1.5 store-heading">Success Stories</h2>
            <p className="mt-2 store-subheading">
              Read how our candidates secured admissions and full funding at elite institutions.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="store-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-black/6">
                  <strong className="block text-sm font-normal text-neutral-950">{t.name}</strong>
                  <span className="block text-[11px] text-emerald-800">{t.degree}</span>
                  <span className="block text-[10px] text-neutral-500">{t.destination}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="store-section-soft border-t border-black/6">
        <div className="store-container max-w-[840px]">
          <div className="text-center pb-10">
            <p className="store-kicker">Information Center</p>
            <h2 className="mt-1.5 store-heading">Frequently Asked Questions</h2>
          </div>

          <div className="border-t border-black/10 divide-y divide-black/10">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left text-sm sm:text-base font-normal text-neutral-950"
                  >
                    <span className="pr-3">{faq.q}</span>
                    <span className="text-lg leading-none text-neutral-400 shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600 pr-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CONTACT & INQUIRY BANNER */}
      <section className="store-section border-t border-black/6 bg-white">
        <div className="store-container">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            
            <div className="space-y-5">
              <p className="store-kicker">Ready to Start?</p>
              <h2 className="store-heading">Book your initial direct assessment.</h2>
              <p className="text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600">
                Speak directly with an academic counsellor to evaluate your transcripts, test scores, and study abroad budget.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-button-primary"
                >
                  <span className="btn-label">WhatsApp Advisory Desk</span>
                  <span className="btn-icon">&rarr;</span>
                </a>
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(true)}
                  className="store-pill-outline text-xs"
                >
                  Book 30-Min Call
                </button>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="store-card rounded-2xl p-6 sm:p-9">
              <h3 className="text-lg sm:text-xl font-normal leading-snug text-neutral-950 mb-1.5">
                Send a Direct Inquiry
              </h3>
              <p className="text-xs text-neutral-500 mb-5">
                Leave your query and our team will get back to you within 24 hours.
              </p>

              {inquirySuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-700 mx-auto" />
                  <strong className="block text-sm font-normal text-neutral-950">Inquiry Received</strong>
                  <p className="text-xs text-neutral-600">We have recorded your details and will reply via email.</p>
                  <button
                    type="button"
                    onClick={() => setInquirySuccess(false)}
                    className="store-pill-outline text-xs mt-2"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Your Full Name"
                      className="store-control text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="Your Email Address"
                      className="store-control text-xs"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder="Your academic background &amp; questions..."
                      className="store-control text-xs py-3 h-auto"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="store-button-primary w-full py-3 text-xs"
                  >
                    <span className="btn-label">{inquiryLoading ? "Submitting..." : "Send Message"}</span>
                    <span className="btn-icon">&rarr;</span>
                  </button>
                </form>
              )}
            </div>

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
