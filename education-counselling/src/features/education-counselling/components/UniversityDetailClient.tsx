"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { University } from "@/data/universities";
import styles from "./UniversityDetailClient.module.css";

interface UniversityDetailClientProps {
  university: University;
}

type TabType = "overview" | "programs" | "admissions" | "scholarships" | "fees";

export function UniversityDetailClient({ university }: UniversityDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [applyClicked, setApplyClicked] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <article className={styles.wrapper}>
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
          <Link href="/" className={styles.backBtn}>
            &larr; Back to Counselling Portal
          </Link>
          
          <div className={styles.heroHeader}>
            <div className={styles.logoBadge} style={{ background: university.logo }}>
              {university.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div className={styles.heroMainInfo}>
              <span className={styles.countryLabel}>📍 {university.country}</span>
              <h1>{university.name}</h1>
              
              <div className={styles.statsRow}>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>QS Global Rank</span>
                  <strong className={styles.statVal}>#{university.ranking.qs}</strong>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>World Rank</span>
                  <strong className={styles.statVal}>#{university.ranking.world}</strong>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Int. Students</span>
                  <strong className={styles.statVal}>{university.overview.internationalStudents}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.gridContainer}>
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
                onClick={() => setActiveTab("admissions")}
                className={`${styles.tabBtn} ${activeTab === "admissions" ? styles.activeTab : ""}`}
              >
                Admissions
              </button>
              <button
                onClick={() => setActiveTab("scholarships")}
                className={`${styles.tabBtn} ${activeTab === "scholarships" ? styles.activeTab : ""}`}
              >
                Scholarships
              </button>
              <button
                onClick={() => setActiveTab("fees")}
                className={`${styles.tabBtn} ${activeTab === "fees" ? styles.activeTab : ""}`}
              >
                Fees & Intakes
              </button>
            </nav>

            <div className={styles.tabContent}>
              {activeTab === "overview" && (
                <div className={styles.tabPanel}>
                  <h3>About the University</h3>
                  <p className={styles.richText}>{university.overview.about}</p>

                  <h3 className={styles.subHeading}>Campus Life</h3>
                  <p className={styles.richText}>{university.overview.campusLife}</p>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <strong>Student Population</strong>
                      <span>{university.overview.population}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <strong>International Students</strong>
                      <span>{university.overview.internationalStudents}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "programs" && (
                <div className={styles.tabPanel}>
                  <h3>Academic Program Pathways</h3>
                  
                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>🎓 Undergraduate Degrees</h4>
                    <ul className={styles.list}>
                      {university.programs.undergraduate.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>👔 Master&apos;s Degrees</h4>
                    <ul className={styles.list}>
                      {university.programs.masters.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.programsGroup}>
                    <h4 className={styles.levelHeading}>🔬 Doctoral (Ph.D.) Programs</h4>
                    <ul className={styles.list}>
                      {university.programs.phd.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "admissions" && (
                <div className={styles.tabPanel}>
                  <h3>Admission Requirements</h3>
                  
                  <div className={styles.requirementBlock}>
                    <strong>General Entry Criteria:</strong>
                    <p>{university.admission.entryRequirements}</p>
                  </div>

                  <div className={styles.requirementBlock}>
                    <strong>English Language Competency:</strong>
                    <p>{university.admission.englishRequirements}</p>
                  </div>

                  <h3 className={styles.subHeading}>Required Documentation Checklist</h3>
                  <ul className={styles.checkboxList}>
                    {university.admission.documents.map((doc, idx) => (
                      <li key={`doc-${idx}`} className={styles.checkboxItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className={styles.subHeading}>Application Workflow</h3>
                  <p className={styles.richText}>{university.admission.process}</p>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <strong>Estimated Processing Time</strong>
                      <span>{university.admission.processingTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "scholarships" && (
                <div className={styles.tabPanel}>
                  <h3>Scholarships & Financial Aid</h3>

                  {university.scholarships.available ? (
                    <div className={styles.scholarshipsList}>
                      {university.scholarships.details.map((sch, index) => (
                        <div key={`scholarship-${index}`} className={styles.scholarshipCard}>
                          <h4 className={styles.schTitle}>{sch.name}</h4>
                          
                          <div className={styles.schDetailsGrid}>
                            <div>
                              <strong>Eligibility:</strong>
                              <p>{sch.eligibility}</p>
                            </div>
                            <div>
                              <strong>Financial Coverage:</strong>
                              <p>{sch.coverage}</p>
                            </div>
                            <div>
                              <strong>Academic Pre-requisite:</strong>
                              <p>GPA: {sch.gpa} | English: {sch.ielts}</p>
                            </div>
                            <div>
                              <strong>Application Deadline:</strong>
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

              {activeTab === "fees" && (
                <div className={styles.tabPanel}>
                  <h3>Tuition Cost & Living Expenses</h3>
                  
                  <div className={styles.feesLayout}>
                    <div className={styles.feeRow}>
                      <span>Academic Tuition:</span>
                      <strong>{university.fees.tuition}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>On-Campus Accommodation:</span>
                      <strong>{university.fees.accommodation}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>Estimated General Living Costs:</span>
                      <strong>{university.fees.livingExpenses}</strong>
                    </div>
                    <div className={styles.feeRow}>
                      <span>Sovereign Student Visa Fees:</span>
                      <strong>{university.fees.visaCost}</strong>
                    </div>
                  </div>

                  <h3 className={styles.subHeading}>Available Academic Intakes</h3>
                  <div className={styles.intakesContainer}>
                    {university.intakes.map((intake) => (
                      <span key={intake} className={styles.intakeBadge}>
                        📅 {intake}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.gallerySection}>
              <h3>Campus Gallery</h3>
              <div className={styles.galleryGrid}>
                {university.gallery.map((img, idx) => (
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

            <div className={styles.faqSection}>
              <h3>Frequently Asked Questions</h3>
              <div className={styles.faqContainer}>
                {university.faq.map((item, idx) => (
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
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <h3>Study in {university.country}</h3>
              <p>Get professional counseling to guide you through applying to {university.name}.</p>
              
              <ul className={styles.checklist}>
                <li>✓ Full academic guidance</li>
                <li>✓ English prep support</li>
                <li>✓ Direct scholarship evaluation</li>
                <li>✓ Student visa filing assistance</li>
              </ul>

              {applyClicked ? (
                <div className={styles.successBox}>
                  <strong>Application Registered!</strong>
                  <p>Our educational coordinators will review your eligibility profile and reach out within 48 business hours.</p>
                </div>
              ) : (
                <button
                  onClick={() => setApplyClicked(true)}
                  className={styles.applyBtn}
                >
                  Apply Now
                </button>
              )}
              
              <p className={styles.fineprint}>* Direct entry eligibility assessment is completely free.</p>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
