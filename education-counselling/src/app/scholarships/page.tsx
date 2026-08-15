"use client";

import { useState } from "react";
import { FreeConsultationModal } from "@/features/education-counselling/components/BookingModals";

export default function ScholarshipsPage() {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const globalScholarships = [
    {
      name: "Fulbright Scholarship (USA)",
      type: "Fully Funded",
      coverage: "100% tuition, living stipend, airfare, and health insurance.",
      deadline: "Mid-May (Annual)",
      desc: "For Master's and Ph.D. degrees at top US universities.",
    },
    {
      name: "Chevening Scholarship (UK)",
      type: "Fully Funded",
      coverage: "Full tuition, monthly allowance, return flights, and visa fees.",
      deadline: "Early November (Annual)",
      desc: "For 1-year Master's degrees at leading UK universities.",
    },
    {
      name: "DAAD Scholarships (Germany)",
      type: "Tuition-Free + Stipend",
      coverage: "Zero tuition + €934 - €1,200 monthly allowance and insurance.",
      deadline: "Course-specific (Aug - Oct)",
      desc: "For postgraduate programs across German public universities.",
    },
    {
      name: "Australia Awards (Australia)",
      type: "Fully Funded",
      coverage: "Full tuition, flights, establishment allowance, and living costs.",
      deadline: "April 30 (Annual)",
      desc: "For development-focused Master's degrees in Australia.",
    },
  ];

  return (
    <div className="w-full pt-[80px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-8 sm:py-12 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-6 space-y-1.5">
          <p className="store-kicker">Funding</p>
          <h1 className="store-heading">Global Scholarships</h1>
          <p className="store-subheading">
            Fully funded international awards and institutional grants for Pakistani students.
          </p>
        </div>

        {/* LISTINGS */}
        <div className="space-y-4">
          {globalScholarships.map((sch, idx) => (
            <div
              key={idx}
              className="store-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="store-pill-label">{sch.type}</span>
                  <span className="text-[10.5px] text-red-600 font-normal">Deadline: {sch.deadline}</span>
                </div>

                <h3 className="text-base sm:text-lg font-normal text-neutral-950">
                  {sch.name}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600">{sch.desc}</p>
                <p className="text-xs text-neutral-500">{sch.coverage}</p>
              </div>

              <button
                type="button"
                onClick={() => setConsultModalOpen(true)}
                className="store-pill-outline text-xs shrink-0 self-start md:self-auto"
              >
                Assess Eligibility &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="store-card rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto space-y-3">
          <p className="store-kicker">Need Advice?</p>
          <h3 className="text-base sm:text-lg font-normal text-neutral-950">
            Have your essays and profile evaluated for funding.
          </h3>
          <button
            type="button"
            onClick={() => setConsultModalOpen(true)}
            className="store-button-primary text-xs"
          >
            <span className="btn-label">Book Free Assessment</span>
            <span className="btn-icon">&rarr;</span>
          </button>
        </div>

      </div>

      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </div>
  );
}
