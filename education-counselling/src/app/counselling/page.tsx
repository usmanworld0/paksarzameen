"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, CheckCircle2, Calendar, Star, HelpCircle, ArrowRight } from "lucide-react";
import { PrivateCounsellingModal } from "@/features/education-counselling/components/BookingModals";

export default function CounsellingServicesPage() {
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  return (
    <div className="w-full pt-[90px] min-h-screen bg-slate-50">
      <div className="max-w-[1320px] mx-auto px-[6vw] py-10 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/[0.05] pb-5 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Admissions Advisory</span>
          <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Counselling Services</h1>
          <p className="text-xs text-[#707072] leading-relaxed">
            Get structured guidance for undergraduate admissions or fully funded graduate research programs.
          </p>
        </div>

        {/* UNDERGRAD SERVICES SECTION */}
        <section id="undergrad" className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 space-y-6 scroll-mt-24 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">Pathway 01</span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">Undergraduate Counselling Services</h2>
            </div>
          </div>

          <p className="text-xs text-[#707072] leading-relaxed max-w-3xl">
            Our undergraduate advisory supports high school candidates (A-Levels, F.Sc, High School Diploma) aiming for Bachelor&apos;s degrees in international destinations. We specialize in structuring applications that stand out in highly competitive pools.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 text-xs">
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Profile Development</strong>
              <p className="text-[#707072] leading-relaxed">Help select targeted extra-curricular projects, summer research positions, and internships to build high-strength admissions portfolios.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">College &amp; Budget Matching</strong>
              <p className="text-[#707072] leading-relaxed">Narrow down 15 to 20 universities that fit your budget, standardized score levels, and scholarship requirements.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Essay Drafting &amp; Review</strong>
              <p className="text-[#707072] leading-relaxed">Detailed brainstorming and line-by-line review of the Common App essay, supplementary responses, and personal statements.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Recommendation Letter Strategy</strong>
              <p className="text-[#707072] leading-relaxed">Guide teachers on how to draft impactful evaluations that showcase your research/classroom capabilities.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">SAT / ACT Exam Timelines</strong>
              <p className="text-[#707072] leading-relaxed">Align test-taking dates, mock examinations reviews, and evaluate test-optional waiver eligibilities.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Visa Application Support</strong>
              <p className="text-[#707072] leading-relaxed">Review financial statements, sponsor letters, mock interviews prep, and complete document checklist submissions.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.04] flex justify-end">
            <button
              onClick={() => setPrivateModalOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] px-5 text-xs font-black uppercase tracking-wider text-white transition-colors"
            >
              Book Undergrad Session
            </button>
          </div>
        </section>

        {/* GRADUATE SERVICES SECTION */}
        <section id="graduate" className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 space-y-6 scroll-mt-24 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Pathway 02</span>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">Graduate Counselling Services</h2>
            </div>
          </div>

          <p className="text-xs text-[#707072] leading-relaxed max-w-3xl">
            Tailored for applicants pursuing Master&apos;s (M.S. / M.A. / MBA) or Ph.D. degrees internationally. We focus heavily on research proposal drafting, lab matchings, and securing fully-funded teaching or research assistant positions.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 text-xs">
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Research Matching</strong>
              <p className="text-[#707072] leading-relaxed">Identify faculty advisors and labs matching your research goals. Formulate initial introduction emails to professors.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Statement of Purpose (SOP)</strong>
              <p className="text-[#707072] leading-relaxed">Line-by-line editing to craft a professional SOP highlighting academic milestones, research gaps, and career objectives.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Research Proposal Review</strong>
              <p className="text-[#707072] leading-relaxed">Evaluate scientific drafts, hypotheses, methodology breakdowns, and bibliography formatting (max 3 pages).</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">CV / Resume Optimization</strong>
              <p className="text-[#707072] leading-relaxed">Format academic CVs matching international standards. Highlight publications, lab skills, and thesis works.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">GRE / GMAT Diagnostics</strong>
              <p className="text-[#707072] leading-relaxed">Recommend preparation schedules, identify mock test errors, and determine if waiver waivers apply.</p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/[0.03] p-4 rounded-2xl space-y-2">
              <strong className="text-[#1d1d1f] font-bold block">Interview Training</strong>
              <p className="text-[#707072] leading-relaxed">Conduct mock panels mimicking faculty board and visa officer interviews, with critical response evaluations.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.04] flex justify-end">
            <button
              onClick={() => setPrivateModalOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] px-5 text-xs font-black uppercase tracking-wider text-white transition-colors"
            >
              Book Graduate Session
            </button>
          </div>
        </section>

      </div>

      <PrivateCounsellingModal 
        isOpen={privateModalOpen}
        onClose={() => setPrivateModalOpen(false)}
      />
    </div>
  );
}
