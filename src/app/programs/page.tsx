import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { ProgramsHubClient } from "@/features/programs/components/ProgramsHubClient";
import { getPrograms } from "@/lib/services/getPrograms";

import styles from "./ProgramsPage.module.css";

export const metadata: Metadata = {
  title: "Programs: Education, Health, Environment And Welfare",
  description:
    "Explore PakSarZameen programs across education, health, environmental action, animal welfare, women empowerment, and community support in Pakistan.",
  keywords: [
    ...siteConfig.seo.keywords,
    "programs pakistan",
    "community development programs pakistan",
    "education health environment welfare",
  ],
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Programs | PakSarZameen Community Development Work",
    description:
      "Browse PakSarZameen's education, health, environment, women empowerment, and welfare programs with searchable previews.",
    url: `${siteConfig.siteUrl}/programs`,
    type: "website",
    images: [
      {
        url: "/images/placeholders/10.png",
        width: 1200,
        height: 800,
        alt: "PakSarZameen volunteers working in community projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programs | PakSarZameen Community Development Work",
    description:
      "Browse PakSarZameen's education, health, environment, women empowerment, and welfare programs with searchable previews.",
    images: ["/images/placeholders/10.png"],
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <section className={styles.page}>
      <ProgramsHubClient programs={programs} />
    </section>
  );
}
