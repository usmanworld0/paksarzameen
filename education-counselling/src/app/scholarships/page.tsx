"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Clock, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { FreeConsultationModal } from "@/features/education-counselling/components/BookingModals";

export default function ScholarshipsPage() {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const globalScholarships = [
    {
      name: "Fulbright Scholarship Program (United States)",
      type: "Government Funded",
      coverage: "100% tuition fee, textbooks, airfare, monthly stipend, and health insurance.",
      eligibility: "Pakistani citizens with strong academic history. GRE score is required.",
      deadline: "Typically mid-May (annually)",
      desc: "One of the most prestigious fully funded master's and PhD programs in the world, managed by USEFP in Pakistan.",
    },
    {
      name: "Chevening Scholarships (United Kingdom)",
      type: "Government Funded",
      coverage: "Full university tuition fees, monthly living allowance, economy airfare, and visa fees.",
      eligibility: "Undergraduate degree, 2 years of work experience, and demonstrable leadership potential.",
      deadline: "Typically early November (annually)",
      desc: "UK government's global scholarship program, funded by the FCDO and partner organizations, for 1-year Master's degrees.",
    },
    {
      name: "Commonwealth Scholarships (United Kingdom)",
      type: "External Organization",
      coverage: "Full tuition fees, airfare, monthly living allowance, and thesis grants.",
      eligibility: "Citizens of Commonwealth nations, unable to afford study in the UK without the grant.",
      deadline: "Typically October - December (annually)",
      desc: "Aimed at individuals who could contribute to the development of their home countries upon graduation.",
    },
    {
      name: "DAAD Scholarships (Germany)",
      type: "Government Funded",
      coverage: "Tuition waiver (German public universities are free), monthly stipend of €934 - €1,200, health coverage, and travel costs.",
      eligibility: "Bachelor's degree completed within last 6 years, 2 years of relevant professional experience.",
      deadline: "Varies by course (typically August - October)",
      desc: "Supports postgraduate studies in Development-Related Postgraduate Courses (EPOS) in Germany.",
    },
    {
      name: "Australia Awards Scholarships (Australia)",
      type: "Government Funded",
      coverage: "Full tuition fees, return air travel, establishment allowance, and contribution to living expenses (CLE).",
      eligibility: "Pakistani national, 2 years of work experience in development sectors.",
      deadline: "Typically April 30 (annually)",
      desc: "Long-term development awards administered by the Department of Foreign Affairs and Trade (DFAT).",
    },
  ];

  return (
    <div className="w-full pt-[90px] min-h-screen bg-slate-50">
      <div className="max-w-[1320px] mx-auto px-[6vw] py-10 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-black/[0.05] pb-5 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Financial Aid Packaging</span>
          <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Global Scholarship Pathways</h1>
          <p className="text-xs text-[#707072] leading-relaxed">
            Discover fully funded government scholarships, university grants, and need-based financial aid for Pakistani candidates.
          </p>
        </div>

        {/* GUIDELINE SECTION */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-black/[0.04] bg-white p-6 space-y-2">
            <span className="text-xl font-bold text-[#0f7a47]">01</span>
            <strong className="text-sm font-bold text-[#111111] block">Government Programs</strong>
            <p className="text-xs text-[#707072] leading-relaxed">
              Highly competitive, fully-funded awards covering all expenses. Requires strong academic transcripts, SOPs, and community leadership work.
            </p>
          </div>
          <div className="rounded-3xl border border-black/[0.04] bg-white p-6 space-y-2">
            <span className="text-xl font-bold text-[#0f7a47]">02</span>
            <strong className="text-sm font-bold text-[#111111] block">Institutional Grants</strong>
            <p className="text-xs text-[#707072] leading-relaxed">
              Need-blind or need-based aid packaging provided directly by universities (e.g. Ivy League schools). Covers demonstrated financial shortfalls.
            </p>
          </div>
          <div className="rounded-3xl border border-black/[0.04] bg-white p-6 space-y-2">
            <span className="text-xl font-bold text-[#0f7a47]">03</span>
            <strong className="text-sm font-bold text-[#111111] block">External Organizations</strong>
            <p className="text-xs text-[#707072] leading-relaxed">
              Bilateral development programs, corporate trusts, and NGOs offering study grants to candidates pursuing targeted STEM/Social impact degrees.
            </p>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-[#111111] tracking-tight uppercase border-b border-black/[0.04] pb-3">
            Major Government &amp; Bilateral Scholarships
          </h2>

          <div className="grid gap-6">
            {globalScholarships.map((sch, idx) => (
              <div 
                key={idx}
                className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-6 hover:shadow-md transition"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-green-50 text-[#0f7a47] rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      {sch.type}
                    </span>
                    <span className="text-[10px] text-red-600 font-bold">
                      Deadline: {sch.deadline}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#111111] tracking-tight">{sch.name}</h3>
                  <p className="text-xs text-[#707072] leading-relaxed">{sch.desc}</p>
                  
                  <div className="grid gap-3 sm:grid-cols-2 text-xs pt-2">
                    <div>
                      <strong className="text-[#1d1d1f] block font-bold">Financial Coverage:</strong>
                      <span className="text-[#707072]">{sch.coverage}</span>
                    </div>
                    <div>
                      <strong className="text-[#1d1d1f] block font-bold">Eligibility Pre-requisites:</strong>
                      <span className="text-[#707072]">{sch.eligibility}</span>
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 self-end sm:self-center">
                  <button 
                    onClick={() => setConsultModalOpen(true)}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] px-5 text-xs font-black uppercase tracking-wider text-white transition-colors"
                  >
                    Evaluate Eligibility
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-[#081c10] text-[#c9decb] p-8 text-center space-y-4">
          <h3 className="text-xl font-black text-white tracking-tight">Need help structuring your scholarship applications?</h3>
          <p className="text-xs text-[#a2b5a4] max-w-lg mx-auto leading-relaxed">
            Personal Statements and Statements of Purpose carry up to 50% weight in scholarship selections. Schedule a free session to evaluate your essay outline.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setConsultModalOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white hover:bg-gray-100 px-6 text-xs font-black uppercase tracking-wider text-[#111111] transition"
            >
              Get Free Evaluation
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
