"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";
import { PrivateCounsellingModal } from "@/features/education-counselling/components/BookingModals";

export default function CounsellingServicesPage() {
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-16">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Admissions Advisory</p>
          <h1 className="store-heading">Counselling Services &amp; Pathways</h1>
          <p className="store-subheading max-w-2xl">
            Get structured guidance for undergraduate admissions or fully funded graduate research programs worldwide.
          </p>
        </div>

        {/* UNDERGRADUATE SECTION */}
        <section id="undergrad" className="store-card rounded-2xl p-8 sm:p-12 space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="store-pill-label">Pathway 01</span>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-950 tracking-[-0.02em]">
              Undergraduate Counselling Services
            </h2>
          </div>

          <p className="text-sm sm:text-base leading-8 text-neutral-600 max-w-3xl">
            Our undergraduate advisory supports high school candidates (A-Levels, F.Sc, High School Diploma) aiming for Bachelor&apos;s degrees in international destinations. We specialize in structuring applications that stand out in competitive applicant pools.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Profile Development</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Strategic extra-curricular planning, research projects, and leadership initiatives to build competitive portfolios.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">College &amp; Budget Matching</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Targeting 15 to 20 universities matching your academic transcripts, budget, and scholarship requirements.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Essay Drafting &amp; Review</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Detailed brainstorming and line-by-line editing of the Common App essay, UCAS statement, and supplements.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Teacher Recommendations</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Guidance on acquiring impactful teacher evaluations highlighting your academic curiosity.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">SAT &amp; Testing Timelines</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Test date schedules, mock diagnostics, and evaluating test-optional waiver eligibilities.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Visa Guidance</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sponsor documentation verification, student visa appointment preparation, and mock interview practice.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-black/6 flex justify-end">
            <button
              type="button"
              onClick={() => setPrivateModalOpen(true)}
              className="store-button-primary"
            >
              <span className="btn-label">Book Undergrad Session</span>
              <span className="btn-icon">&rarr;</span>
            </button>
          </div>
        </section>

        {/* GRADUATE SECTION */}
        <section id="graduate" className="store-card rounded-2xl p-8 sm:p-12 space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="store-pill-label">Pathway 02</span>
            <h2 className="text-xl sm:text-2xl font-normal text-neutral-950 tracking-[-0.02em]">
              Graduate Counselling &amp; Lab Placement
            </h2>
          </div>

          <p className="text-sm sm:text-base leading-8 text-neutral-600 max-w-3xl">
            Tailored for applicants pursuing Master&apos;s (M.S. / M.A. / MBA) or Ph.D. degrees internationally. We focus heavily on research proposal drafting, lab matchings, and securing fully-funded teaching or research assistant positions.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Faculty Lab Matching</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Identify prospective research supervisors and formulate initial cold introduction emails.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Statement of Purpose (SOP)</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Line-by-line editorial feedback highlighting your research milestones and career trajectory.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Research Proposal Review</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Scientific draft evaluation, hypotheses framing, methodology breakdowns, and bibliography checks.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Academic CV Formatting</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Structure academic resumes highlighting publications, conference presentations, and technical tools.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">GRE / GMAT Diagnostic</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Study schedule roadmap and test waiver evaluation based on candidate work profile.
              </p>
            </div>
            <div className="store-panel rounded-xl p-5 space-y-2">
              <strong className="block text-sm font-normal text-neutral-950">Interview Preparation</strong>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Mock faculty interview panels with critical technical and behavioral review.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-black/6 flex justify-end">
            <button
              type="button"
              onClick={() => setPrivateModalOpen(true)}
              className="store-button-primary"
            >
              <span className="btn-label">Book Graduate Session</span>
              <span className="btn-icon">&rarr;</span>
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
