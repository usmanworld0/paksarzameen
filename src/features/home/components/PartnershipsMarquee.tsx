"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./PartnershipsMarquee.module.css";
import homeStyles from "./HomeClient.module.css";

export interface PartnerLogo {
  id: string;
  name: string;
  category: string;
  role: string;
  logoSrc: string;
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: "islamia-univ",
    name: "The Islamia University of Bahawalpur",
    category: "Academic Alliance",
    role: "Scholarships, Mentorship & Research",
    logoSrc: "/images/partnerships and collaborations/islamia university.png",
  },
  {
    id: "bvh",
    name: "Bahawalpur Victoria Hospital",
    category: "Healthcare Network",
    role: "Clinical Outreach & Emergency Response",
    logoSrc: "/images/partnerships and collaborations/bahawalpur victoria hospital.png",
  },
  {
    id: "department-of-forest",
    name: "Department of Forestry Punjab",
    category: "Environmental Greening",
    role: "Urban Afforestation & Sapling Drives",
    logoSrc: "/images/partnerships and collaborations/department of forest.jfif",
  },
  {
    id: "takmeel-square",
    name: "Takmeel Square",
    category: "World Record Partner",
    role: "Plantation Word Formation Installation",
    logoSrc: "/images/partnerships and collaborations/takmeel square.png",
  },
  {
    id: "govt-punjab",
    name: "Government of the Punjab",
    category: "Public Sector Alliance",
    role: "Civic Programs & Community Welfare",
    logoSrc: "/images/partnerships and collaborations/government of punjab.png",
  },
  {
    id: "cuvas",
    name: "Cholistan University (CUVAS)",
    category: "Veterinary Sciences",
    role: "Animal Welfare & Humane Care Research",
    logoSrc: "/images/partnerships and collaborations/CUVAS.jfif",
  },
  {
    id: "bwmc",
    name: "Bahawalpur Waste Management Co.",
    category: "Urban Sustainability",
    role: "Cleanliness & Recycling Campaigns",
    logoSrc: "/images/partnerships and collaborations/bahawalpur waste management company.jfif",
  },
  {
    id: "blood-bank",
    name: "Regional Blood Center Network",
    category: "Emergency Healthcare",
    role: "24/7 Voluntary Donor Coordination",
    logoSrc: "/images/partnerships and collaborations/blood bank.png",
  },
];

export function PartnershipsMarquee() {
  // Duplicate list to create a seamless infinite linear scroll
  const marqueeItems = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section id="home-partnerships" className={styles.partnershipsSection} aria-labelledby="partnerships-heading">
      <div className={styles.headerWrap} data-reveal>
        <span className={homeStyles.sectionLabel}>Working Together</span>
        <h2 id="partnerships-heading" className={homeStyles.appleSectionHeader}>Partnerships &amp; Collaborations</h2>
        <p className={homeStyles.appleSectionDesc}>
          Creating lasting social change through strategic alliances with universities, medical institutes, public bodies, and community partners.
        </p>
      </div>

      {/* Flowing Linear Horizontal Track */}
      <div className={styles.marqueeTrackContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className={styles.partnerCard}>
              <div className={styles.logoBox}>
                <Image
                  src={partner.logoSrc}
                  alt={partner.name}
                  width={56}
                  height={56}
                  className={styles.logoImg}
                />
              </div>

              <div className={styles.partnerInfo}>
                <span className={styles.categoryTag}>{partner.category}</span>
                <h3 className={styles.partnerName} title={partner.name}>{partner.name}</h3>
                <p className={styles.partnerRole} title={partner.role}>{partner.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerWrap} data-reveal>
        <Link href="/get-involved" className={styles.sectionCtaLink}>
          Partner with PakSarZameen &rarr;
        </Link>
      </div>
    </section>
  );
}
