"use client";

import { useState } from "react";
import Link from "next/link";
import { FreeConsultationModal } from "@/features/education-counselling/components/BookingModals";

export default function ScholarshipsPage() {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const globalScholarships = [
    {
      name: "Fulbright Scholarship Program (United States)",
      type: "Government Funded",
      coverage: "100% tuition, textbooks, airfare, living stipend, and health insurance.",
      eligibility: "Pakistani citizens with strong academic history. GRE required.",
      deadline: "Typically mid-May (annually)",
      desc: "Managed by USEFP in Pakistan for fully-funded Master's and Ph.D. programs in the United States.",
    },
    {
      name: "Chevening Scholarships (United Kingdom)",
      type: "Government Funded",
      coverage: "Full university tuition fees, monthly living allowance, economy airfare, and visa fees.",
      eligibility: "Undergraduate degree, 2 years of work experience, and demonstrable leadership potential.",
      deadline: "Typically early November (annually)",
      desc: "UK government global award for 1-year Master's degrees at leading British institutions.",
    },
    {
      name: "Commonwealth Scholarships (United Kingdom)",
      type: "Bilateral Organization",
      coverage: "Full tuition fees, return flights, monthly stipend, and thesis grant.",
      eligibility: "Citizens of Commonwealth nations unable to afford UK study without funding.",
      deadline: "Typically October - December (annually)",
      desc: "Designed for high-achieving individuals focused on development impact in their home nations.",
    },
    {
      name: "DAAD Scholarships (Germany)",
      type: "Government Funded",
      coverage: "Tuition waiver (German public universities are free), monthly stipend of €934 - €1,200, health coverage, and travel costs.",
      eligibility: "Bachelor's degree completed within last 6 years, 2 years relevant experience.",
      deadline: "Varies by course (typically August - October)",
      desc: "Supports postgraduate studies in Development-Related Courses (EPOS) across German universities.",
    },
    {
      name: "Australia Awards Scholarships (Australia)",
      type: "Government Funded",
      coverage: "Full tuition fees, return air travel, establishment allowance, and contribution to living expenses.",
      eligibility: "Pakistani national, 2 years work experience in development sectors.",
      deadline: "Typically April 30 (annually)",
      desc: "Administered by the Department of Foreign Affairs and Trade (DFAT) for Master's studies in Australia.",
    },
  ];

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Financial Aid &amp; Grants</p>
          <h1 className="store-heading">Global Scholarships &amp; Fellowships</h1>
          <p className="store-subheading max-w-2xl">
            Explore fully funded government scholarships, university need-based aid, and international awards for Pakistani students.
          </p>
        </div>

        {/* 3 PILLARS */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="store-card rounded-2xl p-7 space-y-2">
            <span className="store-kicker">01 &bull; Bilateral</span>
            <h3 className="text-base font-normal text-neutral-950">Government Awards</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Highly competitive programs covering full tuition and living expenses (Fulbright, Chevening, DAAD).
            </p>
          </div>

          <div className="store-card rounded-2xl p-7 space-y-2">
            <span className="store-kicker">02 &bull; Institutional</span>
            <h3 className="text-base font-normal text-neutral-950">University Aid</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Need-blind and need-based institutional grants packaged directly by universities via the CSS Profile.
            </p>
          </div>

          <div className="store-card rounded-2xl p-7 space-y-2">
            <span className="store-kicker">03 &bull; External</span>
            <h3 className="text-base font-normal text-neutral-950">Specialized Trusts</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Subject-specific grants for candidates pursuing STEM, sustainability, and healthcare degrees.
            </p>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xs uppercase tracking-[0.24em] text-neutral-400 font-normal">
            Major Government Programs
          </h2>

          <div className="space-y-6">
            {globalScholarships.map((sch, idx) => (
              <div
                key={idx}
                className="store-panel rounded-2xl p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black/20 transition-all"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="store-pill-label">{sch.type}</span>
                    <span className="text-[11px] text-red-600 font-normal">Deadline: {sch.deadline}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-normal leading-tight tracking-[-0.02em] text-neutral-950">
                    {sch.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{sch.desc}</p>

                  <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs text-neutral-700">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">Coverage</span>
                      <p>{sch.coverage}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">Eligibility</span>
                      <p>{sch.eligibility}</p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setConsultModalOpen(true)}
                    className="store-pill-outline text-xs w-full md:w-auto"
                  >
                    Evaluate Eligibility &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="store-card rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <p className="store-kicker">Essay &amp; Statement Mentorship</p>
          <h3 className="store-heading">Need assistance structuring your scholarship applications?</h3>
          <p className="text-xs sm:text-sm leading-7 text-neutral-600">
            Personal statements and statements of purpose carry up to 50% weight in scholarship selection. Schedule a free evaluation of your drafts.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="store-button-primary"
            >
              <span className="btn-label">Book Free Assessment</span>
              <span className="btn-icon">&rarr;</span>
            </button>
          </div>
        </div>

      </div>

      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </div>
  );
}
