import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { BloodBankRequestForm } from "@/features/blood-bank/components/BloodBankRequestForm";
import { EmergencyBloodRequest } from "@/features/blood-bank/components/EmergencyBloodRequest";

import styles from "./BloodBankPage.module.css";

export const metadata: Metadata = {
  title: "Blood Bank | Blood Donation In Bahawalpur",
  description:
    "Minimal blood bank support page for urgent call assistance and donor registration in Bahawalpur.",
  keywords: [
    ...siteConfig.seo.keywords,
    "blood bank bahawalpur",
    "emergency blood request bahawalpur",
    "blood availability pakistan",
  ],
  alternates: {
    canonical: "/blood-bank",
  },
  openGraph: {
    title: "Blood Bank | Blood Donation In Bahawalpur | PakSarZameen",
    description:
      "Call PakSarZameen blood coordinators and register as a blood donor.",
    url: `${siteConfig.siteUrl}/blood-bank`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen blood bank support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Bank | Blood Donation In Bahawalpur | PakSarZameen",
    description:
      "Call PakSarZameen blood coordinators and register as a blood donor.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function BloodBankPage() {
  const bloodBankVectors = [
    {
      src: "/images/vectors/blood bank/2707649.jpg",
      alt: "Blood donation support illustration",
    },
    {
      src: "/images/vectors/blood bank/blood_donation_02.jpg",
      alt: "Blood bank team illustration",
    },
    {
      src: "/images/vectors/blood bank/pq6o_qij1_220606.jpg",
      alt: "Blood donation care illustration",
    },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.leftPanel}>
          <div className={styles.topRow}>
            <p className={styles.brand}>Paksarzameen Blood Bank</p>

            <div className={styles.callGrid}>
              <a href="tel:03098237670" className={styles.callCard}>
                <span className={styles.callName}>Umar Hafeez</span>
                <span className={styles.callButton}>Emergency Call</span>
              </a>

              <a href="tel:03233609157" className={styles.callCard}>
                <span className={styles.callName}>Ahmed Amir</span>
                <span className={styles.callButton}>Emergency Call</span>
              </a>
            </div>
          </div>

          <div className={styles.leftIntro}>
            <h1 className={styles.title}>
              <span className={styles.titleLine}>24/7 Emergency Blood Support</span>
            </h1>
          </div>

          <div className={styles.videoFrame}>
            <video
              className={styles.video}
              src="/videos/blood_donation.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/posters/banner-poster.webp"
            />
          </div>
        </aside>

        <section className={styles.rightPanel}>
          <div className={styles.formShell}>
            <div className={styles.topMeta}>
              <span className={styles.metaText}>Already registered?</span>
              <Link href="/contact" className={styles.metaLink}>
                Contact Team
              </Link>
            </div>
            <p className={styles.formEyebrow}>Registration</p>
            <h2 className={styles.formTitle}>Personal Donor Cabinet</h2>
            <BloodBankRequestForm />
            <div style={{ marginTop: "1.25rem" }}>
              <EmergencyBloodRequest />
            </div>

            <div className={styles.vectorRail} aria-label="Blood bank illustrations">
              {bloodBankVectors.map((item, index) => (
                <figure
                  key={item.src}
                  className={`${styles.vectorCard} ${index === 0 ? styles.vectorCardWide : index === 1 ? styles.vectorCardTall : styles.vectorCardSmall}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 980px) 100vw, 42vw"
                    className={styles.vectorImage}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
