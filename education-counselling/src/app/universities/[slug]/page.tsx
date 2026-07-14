import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dummyUniversities } from "@/data/universities";
import { UniversityDetailClient } from "@/features/education-counselling/components/UniversityDetailClient";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return dummyUniversities.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const university = dummyUniversities.find((u) => u.slug === slug);
  if (!university) return { title: "University Not Found" };

  return {
    title: `${university.name} | Study in ${university.country} | Education Counselling`,
    description: university.overview.about.slice(0, 160),
    alternates: {
      canonical: `/universities/${university.slug}`,
    },
    openGraph: {
      title: `${university.name} Admissions & Scholarships`,
      description: university.overview.about.slice(0, 160),
      url: `https://counselling.paksarzameenwfo.com/universities/${university.slug}`,
      images: [
        {
          url: university.banner,
          width: 1200,
          height: 630,
          alt: `${university.name} Campus`,
        },
      ],
    },
  };
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const university = dummyUniversities.find((u) => u.slug === slug);
  if (!university) notFound();

  return <UniversityDetailClient university={university} />;
}
