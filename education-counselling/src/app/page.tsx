import type { Metadata } from "next";
import { CounsellingClient } from "@/features/education-counselling/components/CounsellingClient";

export const metadata: Metadata = {
  title: "Education Counselling | Study Abroad & International Pathways",
  description:
    "Explore top-tier global universities and secure admissions or scholarships. Get expert academic counselling and student visa guidance for Harvard, Toronto, Melbourne, and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "International Education Counselling | PakSarZameen",
    description:
      "Find your international academic path. Browse global universities, eligibility requirements, fees, intakes, and active scholarships.",
    url: "https://counselling.paksarzameenwfo.com",
    type: "website",
  },
};

export default function EducationCounsellingPage() {
  return <CounsellingClient />;
}
