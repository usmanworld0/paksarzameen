"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Check,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { FreeConsultationModal } from "./BookingModals";

interface UniversityDetailClientProps {
  university: any;
}

type TabType = "overview" | "programs" | "undergrad" | "grad" | "tuition" | "scholarships";

export function UniversityDetailClient({ university }: UniversityDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <article className="w-full bg-[#F3F5F0] text-[#002E21] antialiased">
      
      {/* 1. CINEMATIC BANNER */}
      <section className="relative isolate min-h-[45vh] bg-[#002E21] text-white flex items-end pt-24 pb-12 overflow-hidden">
        <Image
          src={university.banner}
          alt={`${university.name} Campus`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002E21] via-[#002E21]/60 to-transparent" />

        <div className="ivy-container relative z-10 space-y-4">
          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#BECCAD] hover:text-white transition font-sans"
          >
            &larr; Back to Directory
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#BECCAD] font-bold font-sans block mb-1">
                {university.country} &bull; Updated: {university.lastUpdated || "Recently"}
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                {university.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 font-sans">
              <div className="bg-[#002319] border border-[#BECCAD]/40 px-3.5 py-1.5 text-xs text-white">
                <span className="text-[#BECCAD] mr-1.5">QS Rank:</span>
                <strong>#{university.ranking?.qs || "N/A"}</strong>
              </div>
              <div className="bg-[#002319] border border-[#BECCAD]/40 px-3.5 py-1.5 text-xs text-white">
                <span className="text-[#BECCAD] mr-1.5">World:</span>
                <strong>#{university.ranking?.world || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTENT SECTION & TABS */}
      <section className="py-12 sm:py-16">
        <div className="ivy-container grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          
          {/* Main Tabs Area */}
          <div className="space-y-6">
            
            {/* Horizontal Tabs */}
            <nav className="flex items-center gap-4 sm:gap-6 border-b border-[#BECCAD] overflow-x-auto pb-px font-sans">
              {[
                { id: "overview", label: "Overview" },
                { id: "programs", label: "Programs" },
                { id: "undergrad", label: "Undergraduate" },
                { id: "grad", label: "Graduate Reqs" },
                { id: "tuition", label: "Tuition & Apply" },
                { id: "scholarships", label: "Scholarships" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#0f7a47] text-[#002E21]"
                      : "border-transparent text-[#002E21]/50 hover:text-[#002E21]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white border border-[#BECCAD] p-6 sm:p-8 space-y-3">
                  <h3 className="font-heading text-xl uppercase font-bold text-[#002E21]">About the Institution</h3>
                  <p className="text-sm font-serif text-[#002E21]/80 leading-relaxed">{university.overview?.about}</p>
                </div>

                <div className="bg-white border border-[#BECCAD] p-6 sm:p-8 space-y-3">
                  <h3 className="font-heading text-xl uppercase font-bold text-[#002E21]">Campus Environment</h3>
                  <p className="text-sm font-serif text-[#002E21]/80 leading-relaxed">{university.overview?.campusLife}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white border border-[#BECCAD] p-5">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block mb-1 font-sans">Total Enrollment</span>
                    <strong className="text-lg font-bold text-[#002E21] font-sans">{university.overview?.population}</strong>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block mb-1 font-sans">International Ratio</span>
                    <strong className="text-lg font-bold text-[#002E21] font-sans">{university.overview?.internationalStudents}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Programs */}
            {activeTab === "programs" && (
              <div className="space-y-6">
                <div className="bg-white border border-[#BECCAD] p-6 sm:p-8 space-y-4">
                  <h4 className="text-base font-bold text-[#002E21] font-sans flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#207355]" />
                    Undergraduate Programs
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm font-serif text-[#002E21]/80">
                    {(university.programs?.undergraduate || []).map((p: string) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#0f7a47] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-[#BECCAD] p-6 sm:p-8 space-y-4">
                  <h4 className="text-base font-bold text-[#002E21] font-sans flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#207355]" />
                    Master&apos;s Degrees
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm font-serif text-[#002E21]/80">
                    {(university.programs?.masters || []).map((p: string) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#0f7a47] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Undergrad Requirements */}
            {activeTab === "undergrad" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">Qualification</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.undergradRequirements?.qualification}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">Grades / GPA</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.undergradRequirements?.gradesGpa}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">English Standard</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.undergradRequirements?.english}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">SAT / ACT</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.undergradRequirements?.satAct}</p>
                  </div>
                </div>

                <div className="bg-white border border-[#BECCAD] p-6 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#002E21] font-sans">
                    Required Documents
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm font-serif text-[#002E21]/80">
                    {(university.undergradRequirements?.documents || university.admission?.documents || []).map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#207355] shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Graduate Requirements */}
            {activeTab === "grad" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">Degree Required</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.gradRequirements?.qualification}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">GPA Minimum</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.gradRequirements?.gradesGpa}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">GRE / GMAT</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.gradRequirements?.greGmat}</p>
                  </div>
                  <div className="bg-white border border-[#BECCAD] p-5 space-y-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#207355] font-bold block font-sans">English Score</span>
                    <p className="text-xs sm:text-sm font-serif text-[#002E21]">{university.gradRequirements?.english}</p>
                  </div>
                </div>

                <div className="bg-white border border-[#BECCAD] p-6 space-y-2 text-xs sm:text-sm font-serif text-[#002E21]/80">
                  <strong className="text-[#002E21] block font-sans">Statement of Purpose (SOP):</strong>
                  <p>{university.gradRequirements?.statementPurpose}</p>
                </div>
              </div>
            )}

            {/* Tab: Tuition & Apply */}
            {activeTab === "tuition" && (
              <div className="space-y-6">
                <div className="bg-white border border-[#BECCAD] p-6 space-y-3 font-sans">
                  <div className="flex justify-between py-2 border-b border-[#BECCAD]">
                    <span className="text-[#002E21]/70 text-xs">Estimated Tuition:</span>
                    <strong className="text-sm font-bold text-[#002E21]">{university.fees?.tuition}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#BECCAD]">
                    <span className="text-[#002E21]/70 text-xs">Living Expenses:</span>
                    <strong className="text-sm font-bold text-[#002E21]">{university.fees?.livingExpenses}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#002E21]/70 text-xs">Priority Deadline:</span>
                    <strong className="text-sm font-bold text-[#0f7a47]">{university.applicationInfo?.priorityDeadline || "November 1"}</strong>
                  </div>
                </div>

                {/* OUTBOUND ACTION BUTTONS */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={university.officialLinks?.undergradRequirements}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white border border-[#BECCAD] p-4 text-xs font-bold text-[#002E21] font-sans hover:border-[#002E21] transition"
                  >
                    <span>Undergraduate Requirements</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#207355]" />
                  </a>

                  <a
                    href={university.officialLinks?.applyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between ivy-btn-orange p-4 text-xs font-black font-sans"
                  >
                    <span>Apply via Official Portal</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </a>
                </div>
              </div>
            )}

            {/* Tab: Scholarships */}
            {activeTab === "scholarships" && (
              <div className="space-y-4">
                {university.scholarships?.available ? (
                  university.scholarships.details.map((sch: any, idx: number) => (
                    <div key={idx} className="bg-white border border-[#BECCAD] p-6 space-y-3">
                      <h4 className="text-base font-bold text-[#002E21] font-sans">{sch.name}</h4>
                      <div className="grid gap-3 sm:grid-cols-2 text-xs font-sans text-[#002E21]/80">
                        <div>
                          <span className="text-[10px] uppercase text-[#207355] font-bold block">Coverage</span>
                          <p>{sch.coverage}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#207355] font-bold block">Deadline</span>
                          <strong className="text-[#0f7a47]">{sch.deadline}</strong>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#BECCAD] p-6 text-center text-xs font-serif text-[#002E21]/60">
                    No specific institutional scholarships recorded. Check general need-based aid packaging.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <aside className="sticky top-28 bg-white border border-[#BECCAD] p-6 space-y-5 shadow-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#207355] font-bold block">Admissions Strategy</span>
              <h3 className="text-base font-bold text-[#002E21] mt-1">Applying to {university.name}?</h3>
              <p className="text-xs font-serif text-[#002E21]/70 mt-1">
                Have your personal statement and activities list evaluated by our consultants.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="ivy-btn-orange w-full text-xs font-black py-3"
            >
              Book 30 minutes free consultation &rarr;
            </button>
          </aside>

        </div>
      </section>

      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </article>
  );
}
