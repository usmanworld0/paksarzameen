"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <article className="w-full bg-white text-[#111111] antialiased">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative isolate min-h-[50vh] sm:min-h-[58vh] overflow-hidden bg-black text-white flex items-end">
        <Image
          src={university.banner}
          alt={`${university.name} Campus`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 filter brightness-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.6)_75%,rgba(0,0,0,0.85)_100%)]" />

        <div className="store-container relative z-10 py-12 sm:py-16 space-y-6">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-[11px] font-normal uppercase tracking-[0.2em] text-white/80 hover:text-white transition"
          >
            &larr; Back to Directory
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[11px] font-normal uppercase tracking-[0.24em] text-white/90">
                📍 {university.country} &bull; Updated: {university.lastUpdated || "Recently"}
              </p>
              <h1 className="text-[clamp(1.6rem,3.4vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.03em] text-white">
                {university.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <div className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-white">
                <span className="text-white/60 text-[10px] uppercase tracking-wider mr-1.5">QS Rank</span>
                <strong>#{university.ranking?.qs || "N/A"}</strong>
              </div>
              <div className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-white">
                <span className="text-white/60 text-[10px] uppercase tracking-wider mr-1.5">World</span>
                <strong>#{university.ranking?.world || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTENT SECTION & TABS */}
      <section className="store-section py-12 sm:py-16">
        <div className="store-container grid gap-12 lg:grid-cols-[1fr_340px] items-start">
          
          {/* Main Content Area */}
          <div className="space-y-8">
            
            {/* Minimalist Horizontal Tab Bar */}
            <nav className="flex items-center gap-2 sm:gap-6 border-b border-black/8 overflow-x-auto pb-px">
              {[
                { id: "overview", label: "Overview" },
                { id: "programs", label: "Programs" },
                { id: "undergrad", label: "Undergraduate Reqs" },
                { id: "grad", label: "Graduate Reqs" },
                { id: "tuition", label: "Tuition & Apply" },
                { id: "scholarships", label: "Scholarships" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 text-xs sm:text-sm font-normal uppercase tracking-[0.14em] whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-neutral-400 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-3">
                  <h3 className="store-heading">About the Institution</h3>
                  <p className="store-subheading leading-8">{university.overview?.about}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-black/6">
                  <h3 className="store-heading">Campus Life &amp; Student Culture</h3>
                  <p className="store-subheading leading-8">{university.overview?.campusLife}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-black/6">
                  <div className="store-card rounded-2xl p-6 space-y-1">
                    <span className="store-kicker">Total Enrollment</span>
                    <strong className="block text-xl font-normal text-neutral-950">{university.overview?.population}</strong>
                  </div>
                  <div className="store-card rounded-2xl p-6 space-y-1">
                    <span className="store-kicker">International Ratio</span>
                    <strong className="block text-xl font-normal text-neutral-950">{university.overview?.internationalStudents}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Programs */}
            {activeTab === "programs" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="store-heading">Academic Program Pathways</h3>
                  <p className="store-subheading">Featured courses offered at {university.name}.</p>
                </div>

                <div className="space-y-6">
                  <div className="store-card rounded-2xl p-6 sm:p-8 space-y-4">
                    <h4 className="text-base font-normal text-neutral-950 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-neutral-700" />
                      Undergraduate Degrees
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-neutral-600">
                      {(university.programs?.undergraduate || []).map((p: string) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="store-card rounded-2xl p-6 sm:p-8 space-y-4">
                    <h4 className="text-base font-normal text-neutral-950 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-neutral-700" />
                      Master&apos;s Degrees
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-neutral-600">
                      {(university.programs?.masters || []).map((p: string) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="store-card rounded-2xl p-6 sm:p-8 space-y-4">
                    <h4 className="text-base font-normal text-neutral-950 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-neutral-700" />
                      Doctoral (Ph.D.) Programs
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-neutral-600">
                      {(university.programs?.phd || []).map((p: string) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Undergraduate Requirements */}
            {activeTab === "undergrad" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="store-heading">Undergraduate Admission Requirements</h3>
                  <p className="store-subheading">Essential criteria for Bachelor degree candidates.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Academic Qualification</span>
                    <strong className="block text-base font-normal text-neutral-950">Credential Requirement</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.undergradRequirements?.qualification}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Grade Point Average</span>
                    <strong className="block text-base font-normal text-neutral-950">Minimum Grades / GPA</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.undergradRequirements?.gradesGpa}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Language Standards</span>
                    <strong className="block text-base font-normal text-neutral-950">English Proficiency</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.undergradRequirements?.english}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Standardized Tests</span>
                    <strong className="block text-base font-normal text-neutral-950">SAT or ACT Policy</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.undergradRequirements?.satAct}</p>
                  </div>
                </div>

                <div className="store-panel rounded-2xl p-7 space-y-4">
                  <h4 className="text-sm font-normal uppercase tracking-[0.2em] text-neutral-950">
                    Required Documents Checklist
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                    {(university.undergradRequirements?.documents || university.admission?.documents || []).map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-neutral-900 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-600 pt-4 border-t border-black/6">
                  <div>
                    <strong className="text-neutral-950 block mb-1">Personal Statement Requirements:</strong>
                    <p>{university.undergradRequirements?.statement}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-950 block mb-1">Recommendation Guidelines:</strong>
                    <p>{university.undergradRequirements?.recommendations}</p>
                  </div>
                  {university.undergradRequirements?.portfolioInterview && (
                    <div>
                      <strong className="text-neutral-950 block mb-1">Portfolio &amp; Interview Guidelines:</strong>
                      <p>{university.undergradRequirements?.portfolioInterview}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Graduate Requirements */}
            {activeTab === "grad" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="store-heading">Graduate Admission Requirements</h3>
                  <p className="store-subheading">Criteria for Master&apos;s and Ph.D. research candidates.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Undergraduate Degree</span>
                    <strong className="block text-base font-normal text-neutral-950">Bachelor Qualification</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.gradRequirements?.qualification}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Academic Standing</span>
                    <strong className="block text-base font-normal text-neutral-950">Minimum GPA Standard</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.gradRequirements?.gradesGpa}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Testing Policy</span>
                    <strong className="block text-base font-normal text-neutral-950">GRE / GMAT Requirements</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.gradRequirements?.greGmat}</p>
                  </div>

                  <div className="store-card rounded-2xl p-6 space-y-2">
                    <span className="store-kicker">Language Standards</span>
                    <strong className="block text-base font-normal text-neutral-950">English Proficiency</strong>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{university.gradRequirements?.english}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-600 pt-4 border-t border-black/6">
                  <div>
                    <strong className="text-neutral-950 block mb-1">Statement of Purpose (SOP):</strong>
                    <p>{university.gradRequirements?.statementPurpose}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-950 block mb-1">Recommendation Guidelines:</strong>
                    <p>{university.gradRequirements?.recommendations}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-950 block mb-1">Academic CV / Resume Format:</strong>
                    <p>{university.gradRequirements?.resumeCv}</p>
                  </div>
                  {university.gradRequirements?.researchProposal && (
                    <div>
                      <strong className="text-neutral-950 block mb-1">Research Proposal &amp; Writing Sample:</strong>
                      <p>{university.gradRequirements?.researchProposal}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Tuition & Apply */}
            {activeTab === "tuition" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="store-heading">Estimated Costs &amp; Deadlines</h3>
                  <p className="store-subheading">Financial breakdowns and official resource links.</p>
                </div>

                <div className="store-card rounded-2xl p-7 space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-black/6">
                    <span className="text-neutral-500">Estimated Annual Tuition:</span>
                    <strong className="font-normal text-neutral-950">{university.fees?.tuition}</strong>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-black/6">
                    <span className="text-neutral-500">Accommodation:</span>
                    <strong className="font-normal text-neutral-950">{university.fees?.accommodation}</strong>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-black/6">
                    <span className="text-neutral-500">General Living Expenses:</span>
                    <strong className="font-normal text-neutral-950">{university.fees?.livingExpenses}</strong>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-neutral-500">Student Visa Costs:</span>
                    <strong className="font-normal text-neutral-950">{university.fees?.visaCost}</strong>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3 store-panel rounded-2xl p-6 text-xs">
                  <div>
                    <span className="store-kicker block mb-1">Priority Deadline</span>
                    <strong className="block text-sm font-normal text-neutral-950">{university.applicationInfo?.priorityDeadline || "November 1"}</strong>
                  </div>
                  <div>
                    <span className="store-kicker block mb-1">Final Deadline</span>
                    <strong className="block text-sm font-normal text-red-600">{university.applicationInfo?.finalDeadline || "January 15"}</strong>
                  </div>
                  <div>
                    <span className="store-kicker block mb-1">Intake Timelines</span>
                    <strong className="block text-sm font-normal text-neutral-950">{university.intakes?.join(", ") || "Fall / Spring"}</strong>
                  </div>
                </div>

                {/* OFFICIAL UNIVERSITY LINKS */}
                <div className="space-y-4 pt-4 border-t border-black/6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-950 font-normal">
                    Official University Outbound Links
                  </h4>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={university.officialLinks?.undergradRequirements}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-card rounded-xl p-4 text-xs font-normal text-neutral-900 hover:bg-neutral-50 transition"
                    >
                      <span>Official Undergraduate Requirements</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>

                    <a
                      href={university.officialLinks?.gradRequirements}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-card rounded-xl p-4 text-xs font-normal text-neutral-900 hover:bg-neutral-50 transition"
                    >
                      <span>Official Graduate Requirements</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>

                    <a
                      href={university.officialLinks?.internationalStudents}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-card rounded-xl p-4 text-xs font-normal text-neutral-900 hover:bg-neutral-50 transition"
                    >
                      <span>International Student Policies</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>

                    <a
                      href={university.officialLinks?.tuitionFees}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-card rounded-xl p-4 text-xs font-normal text-neutral-900 hover:bg-neutral-50 transition"
                    >
                      <span>Official Tuition &amp; Costs</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>

                    <a
                      href={university.officialLinks?.scholarshipInfo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-card rounded-xl p-4 text-xs font-normal text-neutral-900 hover:bg-neutral-50 transition"
                    >
                      <span>Official Scholarship Guidelines</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>

                    <a
                      href={university.officialLinks?.applyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between store-button-primary rounded-xl p-4 text-xs font-normal"
                    >
                      <span>Apply on University Portal</span>
                      <ExternalLink className="h-3.5 w-3.5 text-white/80" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Scholarships */}
            {activeTab === "scholarships" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="store-heading">Scholarships &amp; Financial Aid</h3>
                  <p className="store-subheading">Opportunities available for international applicants.</p>
                </div>

                {university.scholarships?.available ? (
                  <div className="space-y-6">
                    {university.scholarships.details.map((sch: any, idx: number) => (
                      <div key={idx} className="store-card rounded-2xl p-7 space-y-4">
                        <h4 className="text-base font-normal text-neutral-950">{sch.name}</h4>
                        
                        <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm text-neutral-600">
                          <div>
                            <span className="store-kicker block mb-1">Financial Coverage</span>
                            <p>{sch.coverage}</p>
                          </div>
                          <div>
                            <span className="store-kicker block mb-1">Eligibility Criteria</span>
                            <p>{sch.eligibility}</p>
                          </div>
                          <div>
                            <span className="store-kicker block mb-1">Prerequisites</span>
                            <p>GPA: {sch.gpa} &bull; English: {sch.ielts}</p>
                          </div>
                          <div>
                            <span className="store-kicker block mb-1">Deadline</span>
                            <strong className="text-red-600 font-normal">{sch.deadline}</strong>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-black/6 text-xs text-neutral-600">
                          <strong className="text-neutral-950 block mb-1">Application Procedure:</strong>
                          <p>{sch.procedure}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="store-panel rounded-2xl p-8 text-center text-xs text-neutral-500">
                    No active institutional scholarships are recorded for this specific profile. General need-based aid packaging may still apply through direct admissions channels.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <aside className="sticky top-28 store-card rounded-2xl p-7 space-y-6">
            <div>
              <span className="store-kicker">Admissions Mentorship</span>
              <h3 className="text-lg font-normal text-neutral-950 mt-1">Study in {university.country}</h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                Connect with our advisory mentors for independent profile assessment and essay review.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-900" />
                <span>1-on-1 Profile assessment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-900" />
                <span>Essay brainstorming &amp; editing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-900" />
                <span>Financial aid filing support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-900" />
                <span>Visa filing checklist</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="store-button-primary w-full py-3 text-xs"
            >
              <span className="btn-label">Book Free Consultation</span>
              <span className="btn-icon">&rarr;</span>
            </button>

            {/* DISCLAIMER */}
            <div className="rounded-xl border border-black/6 bg-neutral-50 p-4 text-[11px] leading-relaxed text-neutral-600 flex gap-2.5">
              <AlertCircle className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong>Disclaimer:</strong> Admission criteria, tuition fees, deadlines, and scholarship details may change over time. Students must confirm all details directly on the university&apos;s official website before applying.
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* Consultation Modal */}
      <FreeConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </article>
  );
}
