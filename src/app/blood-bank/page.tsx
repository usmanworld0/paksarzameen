import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { BloodBankRequestForm } from "@/features/blood-bank/components/BloodBankRequestForm";

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

          <h1 className={styles.title}>
            Become part of the blood donor movement.
            <br />
            Start saving lives with us.
          </h1>
          <p className={styles.lead}>
            Register as a donor for urgent blood coordination in Bahawalpur.
          </p>

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
          <div className={styles.topMeta}>
            <span className={styles.metaText}>Already registered?</span>
            <Link href="/contact" className={styles.metaLink}>
              Contact Team
            </Link>
          </div>

          <div className={styles.formShell}>
            <p className={styles.formEyebrow}>Registration</p>
            <h2 className={styles.formTitle}>Personal Donor Cabinet</h2>
            <BloodBankRequestForm />
          </div>
        </section>
      </div>
    </section>
  );
}
