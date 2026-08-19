"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Globe2,
} from "lucide-react";

interface ScholarshipItem {
  id: string;
  name: string;
  region: string;
  type: string;
  coverage: string;
  stipend: string;
  deadline: string;
  degreeLevel: string;
  estimatedValue: string;
  desc: string;
  accentColor: string;
}

const SCHOLARSHIPS_DATA: ScholarshipItem[] = [
  {
    id: "fulbright",
    name: "Fulbright Foreign Student Program",
    region: "USA",
    type: "100% Fully Funded",
    coverage: "Full Tuition + Living Stipend + Airfare + J-1 Visa + Health Insurance",
    stipend: "$1,800 – $2,600 / month",
    deadline: "Mid-May (Annual Cycle)",
    degreeLevel: "Master's & PhD",
    estimatedValue: "$180,000+",
    desc: "Flagship US government scholarship enabling high-achieving Pakistani graduates to pursue fully funded degrees across top American research universities.",
    accentColor: "#002868",
  },
  {
    id: "chevening",
    name: "Chevening Scholarships",
    region: "United Kingdom",
    type: "100% Fully Funded",
    coverage: "Full Tuition Fees + Monthly Stipend + Return Economy Flights + Visa",
    stipend: "£1,350 – £1,750 / month",
    deadline: "Early November (Annual)",
    degreeLevel: "1-Year Master's",
    estimatedValue: "£65,000+",
    desc: "The UK Government's global scholarship programme for future leaders, covering 1-year postgraduate master's degrees at Oxford, Cambridge, LSE, and Imperial.",
    accentColor: "#0A1B3A",
  },
  {
    id: "daad",
    name: "DAAD / EPOS & Helmut-Schmidt",
    region: "Germany & Europe",
    type: "Tuition-Free + Stipend",
    coverage: "Zero Tuition + Monthly Allowance + Travel Subsidies + German Language Prep",
    stipend: "€934 – €1,300 / month",
    deadline: "August – October",
    degreeLevel: "Postgraduate & PhD",
    estimatedValue: "€50,000+",
    desc: "Prestigious German Academic Exchange service supporting development, STEM, and public policy master's degrees taught in English at German universities.",
    accentColor: "#003056",
  },
  {
    id: "erasmus",
    name: "Erasmus Mundus Joint Masters",
    region: "Germany & Europe",
    type: "100% Fully Funded",
    coverage: "100% Participation Costs + Living Allowance + Travel & Setup Grants",
    stipend: "€1,400 / month",
    deadline: "December – January",
    degreeLevel: "Joint Master's (EU)",
    estimatedValue: "€60,000+",
    desc: "Elite European Union award allowing scholars to study and live across 2 to 3 different European countries, graduating with joint or double master's degrees.",
    accentColor: "#003399",
  },
  {
    id: "australia-awards",
    name: "Australia Awards Scholarships",
    region: "Australia & Asia",
    type: "100% Fully Funded",
    coverage: "Full Tuition + Return Airfare + Establishment Allowance + Living Contribution",
    stipend: "AUD $2,500 / month",
    deadline: "April 30 (Annual)",
    degreeLevel: "Master's by Coursework",
    estimatedValue: "AUD $130,000+",
    desc: "Long-term development awards administered by the Australian Department of Foreign Affairs across Australia's prestigious Group of Eight (Go8) universities.",
    accentColor: "#004B23",
  },
  {
    id: "oxbridge",
    name: "Gates Cambridge & Rhodes Trust",
    region: "United Kingdom",
    type: "Full Cost + Maintenance",
    coverage: "Full University & College Composition Fees + Maintenance Allowance + Airfare",
    stipend: "£20,000+ / year",
    deadline: "October – December",
    degreeLevel: "Postgraduate & DPhil",
    estimatedValue: "£85,000+",
    desc: "The world's most competitive international graduate awards for exceptional intellectual ability and leadership at the Universities of Cambridge and Oxford.",
    accentColor: "#3F0010",
  },
];

/* High-fidelity Vector SVG Logos */
function ScholarshipLogo({ id }: { id: string }) {
  switch (id) {
    case "fulbright":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fulbright Logo">
          <rect width="120" height="40" rx="4" fill="#002868" />
          <circle cx="20" cy="20" r="12" fill="#001B47" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M20 12L22 17H27L23 20L24.5 25L20 22L15.5 25L17 20L13 17H18L20 12Z" fill="#D4AF37" />
          <text x="38" y="24" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.08em">
            FULBRIGHT
          </text>
        </svg>
      );

    case "chevening":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Chevening Logo">
          <rect width="120" height="40" rx="4" fill="#0A1B3A" />
          <g transform="translate(8, 10)">
            <path d="M12 2L15 8L18 3L21 8L24 2L22 14H14L12 2Z" fill="#D4AF37" />
            <circle cx="18" cy="17" r="1.5" fill="#D4AF37" />
          </g>
          <text x="38" y="24" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="10.5" fontWeight="700" letterSpacing="0.06em">
            CHEVENING
          </text>
        </svg>
      );

    case "daad":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="DAAD Logo">
          <rect width="120" height="40" rx="4" fill="#003056" />
          {/* German flag mini accent bar */}
          <rect x="12" y="10" width="14" height="6" fill="#111111" rx="1" />
          <rect x="12" y="16" width="14" height="6" fill="#DD0000" />
          <rect x="12" y="22" width="14" height="6" fill="#FFCE00" rx="1" />
          <text x="34" y="25" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="900" letterSpacing="0.12em">
            DAAD
          </text>
        </svg>
      );

    case "erasmus":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Erasmus+ Logo">
          <rect width="120" height="40" rx="4" fill="#003399" />
          <g transform="translate(18, 20)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const cx = Math.cos(rad) * 9;
              const cy = Math.sin(rad) * 9;
              return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#FFCC00" />;
            })}
          </g>
          <text x="35" y="24" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.04em">
            Erasmus+
          </text>
        </svg>
      );

    case "australia-awards":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Australia Awards Logo">
          <rect width="120" height="40" rx="4" fill="#004B23" />
          <g transform="translate(10, 8)">
            {/* Southern Cross constellation dots */}
            <circle cx="8" cy="6" r="1.5" fill="#FFD700" />
            <circle cx="16" cy="4" r="1.5" fill="#FFD700" />
            <circle cx="12" cy="14" r="2" fill="#FFD700" />
            <circle cx="6" cy="18" r="1.5" fill="#FFD700" />
            <circle cx="17" cy="19" r="1.2" fill="#FFD700" />
          </g>
          <text x="34" y="19" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="800" letterSpacing="0.04em">
            AUSTRALIA
          </text>
          <text x="34" y="28" fill="#FFD700" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="0.08em">
            AWARDS
          </text>
        </svg>
      );

    case "oxbridge":
      return (
        <svg viewBox="0 0 120 40" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oxbridge Scholarships Logo">
          <rect width="120" height="40" rx="4" fill="#3F0010" />
          {/* Crest Shield */}
          <g transform="translate(12, 9)">
            <path d="M2 2H18V12C18 17 10 21 10 21C10 21 2 17 2 12V2Z" fill="#26000A" stroke="#D4AF37" strokeWidth="1.2" />
            <path d="M5 8H15M5 12H15" stroke="#D4AF37" strokeWidth="1" />
          </g>
          <text x="36" y="19" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="8" fontWeight="800" letterSpacing="0.06em">
            GATES &amp; RHODES
          </text>
          <text x="36" y="28" fill="#D4AF37" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="0.1em">
            OXBRIDGE
          </text>
        </svg>
      );

    default:
      return (
        <div className="h-9 px-3 bg-[#002E21] text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider rounded">
          Scholarship
        </div>
      );
  }
}

interface ScholarshipsShowcaseProps {
  onOpenConsultation?: () => void;
}

export function ScholarshipsShowcase({ onOpenConsultation }: ScholarshipsShowcaseProps) {
  const [selectedRegion, setSelectedRegion] = useState("All Destinations");

  const regions = [
    { label: "All Destinations", count: SCHOLARSHIPS_DATA.length },
    { label: "USA", count: SCHOLARSHIPS_DATA.filter((s) => s.region === "USA").length },
    { label: "United Kingdom", count: SCHOLARSHIPS_DATA.filter((s) => s.region === "United Kingdom").length },
    { label: "Germany & Europe", count: SCHOLARSHIPS_DATA.filter((s) => s.region === "Germany & Europe").length },
    { label: "Australia & Asia", count: SCHOLARSHIPS_DATA.filter((s) => s.region === "Australia & Asia").length },
  ];

  const filteredItems =
    selectedRegion === "All Destinations"
      ? SCHOLARSHIPS_DATA
      : SCHOLARSHIPS_DATA.filter((s) => s.region === selectedRegion);

  return (
    <section id="scholarships" className="py-16 sm:py-24 border-b border-[#BECCAD] bg-[#F3F5F0] scroll-mt-20">
      <div className="ivy-container space-y-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#BECCAD] pb-8">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#BECCAD] text-[#207355] text-[10.5px] font-bold uppercase tracking-[0.2em] font-sans">
              <Award className="h-3.5 w-3.5" />
              Global Prestige Awards &amp; Grants
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-[40px] font-black uppercase text-[#002E21] tracking-tight leading-none">
              International Scholarships Directory
            </h2>
            <p className="text-xs sm:text-base text-[#002E21]/80 font-serif leading-relaxed">
              Curated government-funded scholarships, bilateral research fellowships, and full tuition waivers for ambitious Pakistani scholars.
            </p>
          </div>

          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2.5 bg-[#002E21] hover:bg-[#0f7a47] text-white px-7 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 self-start md:self-auto shadow-xs group"
          >
            <span>Explore All Scholarships</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* INTERACTIVE REGION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {regions.map((r) => {
            const isActive = selectedRegion === r.label;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setSelectedRegion(r.label)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider font-sans whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                  isActive
                    ? "bg-[#002E21] text-white border-[#002E21] shadow-xs"
                    : "bg-white text-[#002E21]/70 border-[#BECCAD] hover:border-[#002E21] hover:text-[#002E21]"
                }`}
              >
                <span>{r.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-[#F3F5F0] text-[#002E21]/60"
                  }`}
                >
                  {r.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE SCHOLARSHIPS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((sch) => (
            <article
              key={sch.id}
              className="bg-white border border-[#BECCAD] p-6 sm:p-7 flex flex-col justify-between hover:border-[#002E21] hover:shadow-lg transition-all duration-300 group relative"
            >
              <div className="space-y-4">
                
                {/* LOGO & BADGES ROW */}
                <div className="flex items-start justify-between gap-3 border-b border-[#BECCAD]/40 pb-4">
                  <div className="bg-white rounded-md p-1 shadow-xs border border-[#BECCAD]/40 shrink-0">
                    <ScholarshipLogo id={sch.id} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-block bg-[#0f7a47] text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider font-sans">
                      {sch.type}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#207355] font-bold font-sans">
                      {sch.degreeLevel}
                    </span>
                  </div>
                </div>

                {/* SCHOLARSHIP TITLE & SUMMARY */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-sans text-[#002E21] group-hover:text-[#0f7a47] transition-colors leading-tight">
                    {sch.name}
                  </h3>
                  <p className="text-xs font-serif text-[#002E21]/75 leading-relaxed line-clamp-3">
                    {sch.desc}
                  </p>
                </div>

                {/* COVERAGE & VALUE METRICS */}
                <div className="bg-[#F3F5F0] border border-[#BECCAD]/60 p-4 space-y-2.5 text-xs font-sans">
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-[#002E21]/60 block tracking-wider mb-0.5">
                      Funding Package
                    </span>
                    <p className="text-xs font-bold text-[#002E21] leading-snug">
                      {sch.coverage}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#BECCAD]/50 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[9.5px] uppercase text-[#002E21]/60 block font-bold">Monthly Stipend</span>
                      <strong className="text-[#0f7a47] font-semibold">{sch.stipend}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase text-[#002E21]/60 block font-bold">Estimated Value</span>
                      <strong className="text-[#002E21] font-semibold">{sch.estimatedValue}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION FOOTER */}
              <div className="pt-4 mt-5 border-t border-[#BECCAD]/40 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-1.5 text-[#002E21]/80">
                  <Clock className="h-3.5 w-3.5 text-[#207355]" />
                  <span className="text-[11px] font-semibold">{sch.deadline}</span>
                </div>

                <Link
                  href="/scholarships"
                  className="inline-flex items-center gap-1 text-[#002E21] hover:text-[#0f7a47] font-bold uppercase text-[11.5px] tracking-wider transition-colors group/link"
                >
                  <span>Explore &amp; Apply</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM EVALUATION BANNER */}
        <div className="bg-white border border-[#BECCAD] p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[#207355] text-[11px] font-bold uppercase tracking-wider font-sans">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free Initial Assessment
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#002E21]">
              Need Personalized Scholarship Shortlisting?
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#002E21]/80 leading-relaxed">
              Our education advisors map your academic transcripts, GRE/SAT scores, and publications to match with target global scholarships.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onOpenConsultation && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="ivy-btn-orange text-xs px-6 py-3.5 font-bold shadow-xs"
              >
                Book 30-Min Assessment
              </button>
            )}
            <Link
              href="/scholarships"
              className="ivy-btn-outline text-xs px-6 py-3.5 font-bold"
            >
              All Global Scholarships &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
