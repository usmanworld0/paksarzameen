"use client";

import { useState } from "react";
import { PrivateCounsellingModal } from "@/features/education-counselling/components/BookingModals";

export default function CounsellingServicesPage() {
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  return (
    <div className="w-full pt-[80px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-8 sm:py-12 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-6 space-y-1.5">
          <p className="store-kicker">Advisory</p>
          <h1 className="store-heading">Counselling Services</h1>
          <p className="store-subheading">
            Structured guidance for undergraduate admissions and graduate research assistantships.
          </p>
        </div>

        {/* UNDERGRADUATE */}
        <section id="undergrad" className="store-card rounded-2xl p-6 sm:p-10 space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2.5">
            <span className="store-pill-label">Bachelors</span>
            <h2 className="text-xl font-normal text-neutral-950">
              Undergraduate Admissions
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600">
            For high school and college graduates targeting Bachelor&apos;s degrees in the US, UK, Canada, and Australia.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Profile Building</strong>
              <p className="text-[11.5px] text-neutral-600">Extra-curricular positioning &amp; honors formatting.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">College Matching</strong>
              <p className="text-[11.5px] text-neutral-600">Best-fit university selection according to budget.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Essay Review</strong>
              <p className="text-[11.5px] text-neutral-600">Line-by-line Common App &amp; UCAS statement review.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Financial Aid</strong>
              <p className="text-[11.5px] text-neutral-600">CSS Profile &amp; international grant filings.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Testing Plan</strong>
              <p className="text-[11.5px] text-neutral-600">SAT schedules and test-optional evaluation.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Visa Prep</strong>
              <p className="text-[11.5px] text-neutral-600">Document checklists and mock interview practice.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/6 flex justify-end">
            <button
              type="button"
              onClick={() => setPrivateModalOpen(true)}
              className="store-button-primary text-xs"
            >
              <span className="btn-label">Book Undergrad Session</span>
              <span className="btn-icon">&rarr;</span>
            </button>
          </div>
        </section>

        {/* GRADUATE */}
        <section id="graduate" className="store-card rounded-2xl p-6 sm:p-10 space-y-6 scroll-mt-24">
          <div className="flex items-center gap-2.5">
            <span className="store-pill-label">Masters &amp; PhD</span>
            <h2 className="text-xl font-normal text-neutral-950">
              Graduate &amp; Research Mentorship
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600">
            For Master&apos;s and Doctoral candidates seeking research placements and funded assistantships.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Supervisor Matching</strong>
              <p className="text-[11.5px] text-neutral-600">Faculty lab matching &amp; cold outreach emails.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">SOP Editorial</strong>
              <p className="text-[11.5px] text-neutral-600">Statement of Purpose line-by-line refinement.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Research Proposals</strong>
              <p className="text-[11.5px] text-neutral-600">Methodology structure &amp; bibliography checks.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Academic CV</strong>
              <p className="text-[11.5px] text-neutral-600">Formatting research milestones and publications.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">GRE Roadmap</strong>
              <p className="text-[11.5px] text-neutral-600">Diagnostic schedules &amp; score waiver review.</p>
            </div>
            <div className="store-panel rounded-xl p-4 space-y-1">
              <strong className="block text-xs font-normal text-neutral-950">Faculty Interviews</strong>
              <p className="text-[11.5px] text-neutral-600">Mock lab interview practice and critique.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/6 flex justify-end">
            <button
              type="button"
              onClick={() => setPrivateModalOpen(true)}
              className="store-button-primary text-xs"
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
