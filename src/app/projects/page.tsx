import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import ProgramsPage from "@/app/programs/page";

export const metadata: Metadata = {
  title: "Projects by PakSarzameen",
  description:
    "Explore PakSarzameen projects focused on social development, education, welfare, and humanitarian work across Pakistan.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects by PakSarzameen",
    description:
      "Explore PakSarzameen projects focused on social development, education, welfare, and humanitarian work across Pakistan.",
    url: `${siteConfig.siteUrl}/projects`,
    type: "website",
    images: ["/images/hero-fallback.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by PakSarzameen",
    description:
      "Explore PakSarzameen projects focused on social development, education, welfare, and humanitarian work across Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default ProgramsPage;
