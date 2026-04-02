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
        <header className={styles.hero}>
          <p className={styles.eyebrow}>PSZ Blood Bank | بلڈ بینک</p>
          <h1 className={styles.title}>Emergency Blood Support | فوری خون کی مدد</h1>
          <p className={styles.lead}>
            Fast emergency response for blood needs in Bahawalpur.
            <br />
            بہاولپور میں فوری خون کی ضرورت کے لئے فوری رابطہ کریں۔
          </p>

          <div className={styles.callGrid}>
            <a href="tel:03098237670" className={styles.callCard}>
              <span className={styles.callLabel}>Emergency Coordinator</span>
              <span className={styles.callName}>Umar Hafeez</span>
              <span className={styles.callButton}>Call Now | ابھی کال کریں</span>
            </a>

            <a href="tel:03233609157" className={styles.callCard}>
              <span className={styles.callLabel}>Emergency Coordinator</span>
              <span className={styles.callName}>Ahmed Amir</span>
              <span className={styles.callButton}>Call Now | ابھی کال کریں</span>
            </a>
          </div>

          <div className={styles.inlineActions}>
            <p className={styles.notice}>Call first, form second. پہلے کال کریں، پھر فارم جمع کریں۔</p>
            <Link href="/contact" className={styles.contactLink}>
              Contact | رابطہ
            </Link>
          </div>
        </header>

        <section className={styles.formSection}>
          <p className={styles.formIntro}>
            Register as a donor and share your details for rapid coordination.
            <br />
            ڈونر کے طور پر رجسٹر کریں اور فوری رابطے کے لئے اپنی معلومات دیں۔
          </p>
          <BloodBankRequestForm />
        </section>
      </div>
    </section>
  );
}
