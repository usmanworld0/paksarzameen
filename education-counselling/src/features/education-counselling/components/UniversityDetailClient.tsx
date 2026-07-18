"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  GraduationCap, 
  MapPin, 
  Award, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ChevronRight,
  ExternalLink 
} from "lucide-react";
import { FreeConsultationModal } from "./BookingModals";
import styles from "./UniversityDetailClient.module.css";

interface UniversityDetailClientProps {
  university: any; // Dynamic from JSON store
}

type TabType = "overview" | "programs" | "undergrad" | "grad" | "tuition" | "scholarships";

export function UniversityDetailClient({ university }: UniversityDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <article className={styles.wrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.bannerContainer}>
          <Image
            src={university.banner}
            alt={`${university.name} Campus`}
            fill
            priority
            sizes="100vw"
            className={styles.bannerImage}
            style={{ objectFit: "cover" }}
          />
          <div className={styles.bannerOverlay} />
        </div>

        <div className={styles.heroInner}>
          <Link href="/universities" className={styles.backBtn}>
            &larr; Back to Directory
          </Link>
          
          <div className={styles.heroHeader}>
            <div className={styles.logoBadge} style={{ background: university.logo }}>
              {university.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div className={styles.heroMainInfo}>
              <span className={styles.countryLabel}>
                📍 {university.country} | Last Updated: {university.lastUpdated || "Recently"}
              </span>
              <h1>{university.name}</h1>
              
              <div className={styles.statsRow}>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>QS Global Rank</span>
                  <strong className={styles.statVal}>#{university.ranking?.qs || "N/A"}</strong>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>World Rank</span>
                  <strong className={styles.statVal}>#{university.ranking?.world || "N/A"}</strong>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Int. Students</span>
                  <strong className={styles.statVal}>{university.overview?.internationalStudents || "10%"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className={styles.contentSection}>
        <div className={styles.gridContainer}>
          
          {/* MAIN PANEL */}
          <div className={styles.mainPanel}>
            <nav className={styles.tabNav}>
              <button
                onClick={() => setActiveTab("overview")}
                className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`${styles.tabBtn} ${activeTab === "programs" ? styles.activeTab : ""}`}
              >
                Programs
              </button>
              <button
                onClick={() => setActiveTab("undergrad")}
                className={`${styles.tabBtn} ${activeTab === "undergrad" ? styles.activeTab : ""}`}
              >
                Undergraduate Reqs
              </button>
              <button
                onClick={() => setActiveTab("grad")}
                className={`${styles.tabBtn} ${activeTab === "grad" ? styles.activeTab : ""}`}
              >
                Graduate Reqs
              </button>
              <button
                onClick={() => setActiveTab("tuition")}
                className={`${styles.tabBtn} ${activeTab === "tuition" ? styles.activeTab : ""}`}
              >
                Tuition &amp; Apply
              </button>
              <button
                onClick={() => setActiveTab("scholarships")}
                className={`${styles.tabBtn} ${activeTab === "scholarships" ? styles.activeTab : ""}`}
              >
                Scholarships
              </button>
            </nav>

            <div className={styles.tabContent}>
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className={styles.tabPanel}>
                  <h3>About the University</h3>
                  <p className={styles.richText}>{university.overview?.about}</p>

                  <h3 className={styles.subHeading}>Campus Life</h3>
                  <p className={styles.richText}>{university.overview?.campusLife}</p>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <strong>Student Population</strong>
                      <span>{university.overview?.population}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <strong>International Students</strong>
                      <span>{university.overview?.internationalStudents}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Programs */}
              {activeTab === "programs" && (
                <div className={styles.tabPanel}>
                  <h3>Academic Program Pathways</h3>
                  <p className="text-xs text-[#707072] mb-6">Explore the featured course offerings at {university.name}.</p>
                  
                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>🎓 Undergraduate Degrees</h4>
                    <ul className={styles.list}>
                      {(university.programs?.undergraduate || []).map((p: string) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>👔 Master&apos;s Degrees</h4>
                    <ul className={styles.list}>
                      {(university.programs?.masters || []).map((p: string) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>🔬 Doctoral (Ph.D.) Programs</h4>
                    <ul className={styles.list}>
                      {(university.programs?.phd || []).map((p: string) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Undergraduate Requirements */}
              {activeTab === "undergrad" && (
                <div className={styles.tabPanel} style={{ gap: "2rem", display: "flex", flexDirection: "column" }}>
                  <div>
                    <h3>Undergraduate Admission Requirements</h3>
                    <p className="text-xs text-[#707072] mt-1">Review the basic qualifications, language criteria, and documents checklists needed for Bachelor applicants.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Required Credential</span>
                      <strong className="text-sm text-[#111111] block font-bold">Academic Qualification</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.undergradRequirements?.qualification}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Academic Grades</span>
                      <strong className="text-sm text-[#111111] block font-bold">Minimum Grades / GPA</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.undergradRequirements?.gradesGpa}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Language Score</span>
                      <strong className="text-sm text-[#111111] block font-bold">English Competency</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.undergradRequirements?.english}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Standardized Testing</span>
                      <strong className="text-sm text-[#111111] block font-bold">SAT or ACT Requirements</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.undergradRequirements?.satAct}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#111111]">Required Documents Checklist</h4>
                    <ul className={styles.checkboxList}>
                      {(university.undergradRequirements?.documents || university.admission?.documents || []).map((doc: string, idx: number) => (
                        <li key={`ug-doc-${idx}`} className={styles.checkboxItem}>
                          <span className={styles.checkIcon}>✓</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-black/[0.04] pt-4 space-y-4 text-xs">
                    <div>
                      <strong className="text-xs text-[#111111] font-black block">Personal Statement Requirements:</strong>
                      <p className="text-[#707072] mt-1 leading-relaxed">{university.undergradRequirements?.statement}</p>
                    </div>
                    <div>
                      <strong className="text-xs text-[#111111] font-black block">Recommendation Letter Guidelines:</strong>
                      <p className="text-[#707072] mt-1 leading-relaxed">{university.undergradRequirements?.recommendations}</p>
                    </div>
                    {university.undergradRequirements?.portfolioInterview && (
                      <div>
                        <strong className="text-xs text-[#111111] font-black block">Portfolio or Interview Requirements:</strong>
                        <p className="text-[#707072] mt-1 leading-relaxed">{university.undergradRequirements?.portfolioInterview}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Graduate Requirements */}
              {activeTab === "grad" && (
                <div className={styles.tabPanel} style={{ gap: "2rem", display: "flex", flexDirection: "column" }}>
                  <div>
                    <h3>Graduate Admission Requirements</h3>
                    <p className="text-xs text-[#707072] mt-1">Review criteria for postgraduate candidates aiming for Master&apos;s or Doctoral programs.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Required Credential</span>
                      <strong className="text-sm text-[#111111] block font-bold">Undergraduate Qualification</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.gradRequirements?.qualification}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Academic Grade</span>
                      <strong className="text-sm text-[#111111] block font-bold">Minimum GPA Requirement</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.gradRequirements?.gradesGpa}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Standardized Testing</span>
                      <strong className="text-sm text-[#111111] block font-bold">GRE or GMAT Score Requirements</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.gradRequirements?.greGmat}</p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-2xl border border-black/[0.04] p-5 space-y-2">
                      <span className="text-[9px] font-black uppercase text-[#0f7a47] tracking-wider">Language Score</span>
                      <strong className="text-sm text-[#111111] block font-bold">English Proficiency Standard</strong>
                      <p className="text-xs text-[#707072] leading-relaxed">{university.gradRequirements?.english}</p>
                    </div>
                  </div>

                  <div className="border-t border-black/[0.04] pt-4 space-y-4 text-xs">
                    <div>
                      <strong className="text-xs text-[#111111] font-black block">Statement of Purpose (SOP) Requirements:</strong>
                      <p className="text-[#707072] mt-1 leading-relaxed">{university.gradRequirements?.statementPurpose}</p>
                    </div>
                    <div>
                      <strong className="text-xs text-[#111111] font-black block">Recommendation Letter Requirements:</strong>
                      <p className="text-[#707072] mt-1 leading-relaxed">{university.gradRequirements?.recommendations}</p>
                    </div>
                    <div>
                      <strong className="text-xs text-[#111111] font-black block">Academic CV / Resume Guidelines:</strong>
                      <p className="text-[#707072] mt-1 leading-relaxed">{university.gradRequirements?.resumeCv}</p>
                    </div>
                    {university.gradRequirements?.researchProposal && (
                      <div>
                        <strong className="text-xs text-[#111111] font-black block">Research Proposal or Writing Sample:</strong>
                        <p className="text-[#707072] mt-1 leading-relaxed">{university.gradRequirements?.researchProposal}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Tuition & Apply */}
              {activeTab === "tuition" && (
                <div className={styles.tabPanel} style={{ gap: "2rem", display: "flex", flexDirection: "column" }}>
                  <div>
                    <h3>Estimated Costs &amp; Deadlines</h3>
                    <p className="text-xs text-[#707072] mt-1">Check financial requirements, intake dates, and official outbound application links.</p>
                  </div>

                  <div className={styles.feesLayout}>
                    <div className={styles.feeRow}>
                      <span>Estimated Annual Tuition:</span>
                      <strong>{university.fees?.tuition}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>On-Campus Accommodation:</span>
                      <strong>{university.fees?.accommodation}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>General Living Expenses:</span>
                      <strong>{university.fees?.livingExpenses}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>Sovereign Student Visa Fees:</span>
                      <strong>{university.fees?.visaCost}</strong>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3 text-xs border-t border-b border-black/[0.04] py-6">
                    <div className="space-y-1">
                      <span className="text-[#707072] block font-bold uppercase tracking-wider text-[9px]">Priority Deadline</span>
                      <strong className="text-[#1d1d1f] text-sm font-black">{university.applicationInfo?.priorityDeadline || "November 1"}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#707072] block font-bold uppercase tracking-wider text-[9px]">Final Deadline</span>
                      <strong className="text-[#1d1d1f] text-sm font-black text-red-600">{university.applicationInfo?.finalDeadline || "January 15"}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#707072] block font-bold uppercase tracking-wider text-[9px]">Intake Timelines</span>
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        {(university.intakes || []).map((intake: string) => (
                          <span key={intake} className="bg-gray-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                            {intake}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL UNIVERSITY LINKS */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1d1d1f]">Official University Resource Links</h4>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <a
                        href={university.officialLinks?.undergradRequirements}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-3.5 text-xs font-bold text-[#1d1d1f] hover:bg-gray-50 transition"
                      >
                        View Official Undergraduate Requirements
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href={university.officialLinks?.gradRequirements}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-3.5 text-xs font-bold text-[#1d1d1f] hover:bg-gray-50 transition"
                      >
                        View Official Graduate Requirements
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href={university.officialLinks?.internationalStudents}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-3.5 text-xs font-bold text-[#1d1d1f] hover:bg-gray-50 transition"
                      >
                        View International Student Requirements
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href={university.officialLinks?.tuitionFees}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-3.5 text-xs font-bold text-[#1d1d1f] hover:bg-gray-50 transition"
                      >
                        View Official Tuition and Fees
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href={university.officialLinks?.scholarshipInfo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-3.5 text-xs font-bold text-[#1d1d1f] hover:bg-gray-50 transition"
                      >
                        View Official Scholarship Information
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href={university.officialLinks?.applyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-black/[0.08] bg-[#111111] hover:bg-[#0f7a47] p-3.5 text-xs font-bold text-white transition"
                      >
                        Apply on the University Website
                        <ExternalLink className="h-4 w-4 text-white/80" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Scholarships */}
              {activeTab === "scholarships" && (
                <div className={styles.tabPanel}>
                  <h3>Scholarships &amp; Financial Aid Packaging</h3>

                  {university.scholarships?.available ? (
                    <div className={styles.scholarshipsList}>
                      {university.scholarships.details.map((sch: any, index: number) => (
                        <div key={`scholarship-${index}`} className={styles.scholarshipCard}>
                          <h4 className={styles.schTitle}>{sch.name}</h4>
                          
                          <div className={styles.schDetailsGrid}>
                            <div>
                              <strong>Eligibility Criteria:</strong>
                              <p>{sch.eligibility}</p>
                            </div>
                            <div>
                              <strong>Financial Coverage:</strong>
                              <p>{sch.coverage}</p>
                            </div>
                            <div>
                              <strong>Academic Prerequisites:</strong>
                              <p>GPA: {sch.gpa} | English: {sch.ielts}</p>
                            </div>
                            <div>
                              <strong>Scholarship Deadline:</strong>
                              <p className={styles.deadlineHighlight}>{sch.deadline}</p>
                            </div>
                          </div>

                          <div className={styles.schApplyWorkflow}>
                            <strong>Application Procedure:</strong>
                            <p>{sch.procedure}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noScholarshipNotice}>
                      <p>There are no global entry scholarships currently active in our mock system for this university. Financial aid packets may still be available through direct institution channels.</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Campus Gallery */}
            {university.gallery?.length > 0 && (
              <div className={styles.gallerySection}>
                <h3>Campus Gallery</h3>
                <div className={styles.galleryGrid}>
                  {university.gallery.map((img: string, idx: number) => (
                    <div key={`gallery-${idx}`} className={styles.galleryFrame}>
                      <Image
                        src={img}
                        alt={`${university.name} Scene ${idx + 1}`}
                        fill
                        sizes="(max-width: 820px) 100vw, 30vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {university.faq?.length > 0 && (
              <div className={styles.faqSection}>
                <h3>Frequently Asked Questions</h3>
                <div className={styles.faqContainer}>
                  {university.faq.map((item: any, idx: number) => (
                    <div key={`faq-${idx}`} className={styles.faqItem}>
                      <button
                        onClick={() => toggleFaq(idx)}
                        className={styles.faqQuestion}
                        aria-expanded={openFaqIndex === idx}
                      >
                        <span>{item.q}</span>
                        <span className={styles.faqIndicator}>
                          {openFaqIndex === idx ? "−" : "+"}
                        </span>
                      </button>
                      <div
                        className={`${styles.faqAnswer} ${
                          openFaqIndex === idx ? styles.faqOpen : ""
                        }`}
                      >
                        <p>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR PANEL */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyCard} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <span className="text-[10px] font-black uppercase text-[#0f7a47] tracking-wider block">Pathway Guidance</span>
                <h3 className="text-lg font-black tracking-tight text-[#111111] mt-1">Study in {university.country}</h3>
                <p className="text-xs text-[#707072] mt-1">Get professional guidance to secure admissions at {university.name}.</p>
              </div>
              
              <ul className={styles.checklist} style={{ margin: 0, padding: 0 }}>
                <li>✓ 1-on-1 Profile assessment</li>
                <li>✓ Essay brainstorming &amp; drafts</li>
                <li>✓ Need-based financial aid filing</li>
                <li>✓ Student visa filing assistance</li>
              </ul>

              <button
                onClick={() => setConsultModalOpen(true)}
                className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-[#0f7a47] hover:bg-[#0c6239] text-xs font-black uppercase tracking-wider text-white transition shadow-sm"
              >
                Book Consultation
              </button>

              {/* WEBSITE-WIDE ADMISSIONS INFORMATION DISCLAIMER */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-[11px] leading-relaxed text-[#7c5e10] flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Disclaimer:</strong> Admission requirements, tuition fees, application deadlines, and scholarship criteria are subject to change. Students are strictly advised to double-confirm all details through the university&apos;s official webpages before submitting applications.
                </div>
              </div>
              
              <p className={styles.fineprint} style={{ margin: 0 }}>* Initial direct entry assessment is completely free.</p>
            </div>
          </aside>

        </div>
      </section>

      {/* Free Consultation Modal Mount */}
      <FreeConsultationModal 
        isOpen={consultModalOpen} 
        onClose={() => setConsultModalOpen(false)} 
      />
    </article>
  );
}
