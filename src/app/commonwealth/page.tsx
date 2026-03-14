import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import PaksarzameenStorePage from "@/app/commonwealth-lab/page";

export const metadata: Metadata = {
  title: "Paksarzameen Store by PakSarzameen",
  description:
    "Discover Paksarzameen Store by PakSarzameen, a premium artisan marketplace supporting local communities.",
  alternates: {
    canonical: "/commonwealth",
  },
  openGraph: {
    title: "Paksarzameen Store by PakSarzameen",
    description:
      "Discover Paksarzameen Store by PakSarzameen, a premium artisan marketplace supporting local communities.",
    url: `${siteConfig.siteUrl}/commonwealth`,
    type: "website",
    images: ["/images/hero-fallback.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paksarzameen Store by PakSarzameen",
    description:
      "Discover Paksarzameen Store by PakSarzameen, a premium artisan marketplace supporting local communities.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default PaksarzameenStorePage;
