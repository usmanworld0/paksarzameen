import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import CommonwealthLabPage from "@/app/commonwealth-lab/page";

export const metadata: Metadata = {
  title: "Commonwealth Lab by PakSarzameen",
  description:
    "Discover Commonwealth Lab by PakSarzameen, a premium artisan marketplace supporting local communities.",
  alternates: {
    canonical: "/commonwealth",
  },
  openGraph: {
    title: "Commonwealth Lab by PakSarzameen",
    description:
      "Discover Commonwealth Lab by PakSarzameen, a premium artisan marketplace supporting local communities.",
    url: `${siteConfig.siteUrl}/commonwealth`,
    type: "website",
    images: ["/images/hero-fallback.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commonwealth Lab by PakSarzameen",
    description:
      "Discover Commonwealth Lab by PakSarzameen, a premium artisan marketplace supporting local communities.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default CommonwealthLabPage;
