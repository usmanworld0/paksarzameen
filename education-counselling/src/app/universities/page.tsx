import type { Metadata } from "next";
import { getDbStore } from "@/lib/db";
import { UniversitiesDirectory } from "./UniversitiesDirectory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Universities Directory | Search & Filter Global Pathways",
  description:
    "Filter through elite international universities by country, degree level, tuition range, scholarship options, and testing requirements.",
  alternates: {
    canonical: "/universities",
  },
};

export default function UniversitiesPage() {
  const store = getDbStore();
  return <UniversitiesDirectory initialUniversities={store.universities || []} />;
}
