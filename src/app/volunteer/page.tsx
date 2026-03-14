import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import GetInvolvedPage from "@/app/get-involved/page";

export const metadata: Metadata = {
  title: "Volunteer with PakSarzameen",
  description:
    "Join PakSarzameen as a volunteer and support community development and humanitarian initiatives across Pakistan.",
  alternates: {
    canonical: "/volunteer",
  },
  openGraph: {
    title: "Volunteer with PakSarzameen",
    description:
      "Join PakSarzameen as a volunteer and support community development and humanitarian initiatives across Pakistan.",
    url: `${siteConfig.siteUrl}/volunteer`,
    type: "website",
    images: ["/images/hero-fallback.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Volunteer with PakSarzameen",
    description:
      "Join PakSarzameen as a volunteer and support community development and humanitarian initiatives across Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default GetInvolvedPage;
