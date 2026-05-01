import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getProgramBySlug } from "@/lib/services/getProgramBySlug";
import { getPrograms } from "@/lib/services/getPrograms";

export const revalidate = 3600;

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const narrativeBySlug: Record<string, { problem: string; solution: string }> = {
  "mahkma-shajarkari": {
    problem:
      "Urban heat and declining green cover reduce environmental resilience and quality of life.",
    solution:
      "PSZ leads community plantation drives, aftercare circles, and local stewardship training to sustain green growth.",
  },
  "ehsas-ul-haiwanat": {
    problem:
      "Limited welfare awareness and fragmented rescue pathways leave vulnerable animals at risk.",
    solution:
      "PSZ coordinates welfare advocacy, rescue collaboration, and compassionate care education at the neighborhood level.",
  },
  "room-zia": {
    problem:
      "Orphaned children often face unstable social and educational support systems.",
    solution:
      "PSZ provides structured mentorship, wellbeing support, and educational pathways for long-term confidence and opportunity.",
  },
  "dar-ul-aloom": {
    problem:
      "Underserved communities need accessible, practical, and sustained learning opportunities.",
    solution:
      "PSZ runs learning circles, mentoring programs, and foundational development tracks for measurable education gains.",
  },
  "tibi-imdad": {
    problem:
      "Preventable health issues persist where basic screening and awareness access is limited.",
    solution:
      "PSZ delivers outreach clinics, preventive awareness, and referral support to strengthen community health outcomes.",
  },
  "wajood-e-zan": {
    problem:
      "Women often face barriers to leadership, economic participation, and rights awareness.",
    solution:
      "PSZ builds confidence, enterprise capacity, and peer networks that expand dignity and inclusive participation.",
  },
};

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found",
      description: "The requested program could not be found.",
    };
  }

  return {
    title: `${program.title} Program`,
    description: program.description,
    keywords: [
      ...siteConfig.seo.keywords,
      program.title,
      `${program.category.toLowerCase()} program pakistan`,
      "community development program pakistan",
    ],
    alternates: {
      canonical: `/programs/${program.slug}`,
    },
    openGraph: {
      title: `${program.title} | PakSarZameen`,
      description: program.description,
      url: `${siteConfig.siteUrl}/programs/${program.slug}`,
      type: "article",
      images: [
        {
          url: "/images/placeholders/10.png",
          width: 1200,
          height: 800,
          alt: `${program.title} program detail image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${program.title} | PakSarZameen`,
      description: program.description,
      images: ["/images/placeholders/10.png"],
    },
  };
}

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const narrative =
    narrativeBySlug[program.slug] ??
    narrativeBySlug["mahkma-shajarkari"];

  const photos = [10, 11, 12];

  return (
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell">
          <Link href="/programs" className="site-back-link">
            Back To Programs
          </Link>

          <header className="site-detail__hero mt-6">
            <p className="site-eyebrow">{program.category}</p>
            <h1 className="site-display mt-4 max-w-[12ch]">{program.title}</h1>
            <p className="site-copy mt-4 max-w-[70rem]">{program.description}</p>
          </header>

          <div className="site-detail__body lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <section className="site-panel">
              <div className="site-panel__body">
                <p className="site-card__eyebrow">Overview</p>
                <h2 className="site-heading site-heading--sm mt-3">Overview</h2>
                <p className="site-copy mt-4">{program.fullContent}</p>
              </div>
            </section>

            <section className="site-panel">
              <div className="site-panel__body">
                <p className="site-card__eyebrow">Context</p>
                <h2 className="site-heading site-heading--sm mt-3">The Need</h2>
                <p className="site-copy mt-4">{narrative.problem}</p>
                <h2 className="site-heading site-heading--sm mt-8">Response</h2>
                <p className="site-copy mt-4">{narrative.solution}</p>
              </div>
            </section>
          </div>

          <section className="site-section">
            <div className="site-toolbar__row">
              <div>
                <p className="site-eyebrow">Gallery</p>
                <h2 className="site-heading site-heading--sm mt-3">Program Moments</h2>
              </div>
            </div>

            <div className="site-media-grid mt-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((imageId, index) => (
                <figure key={`${program.slug}-photo-${index + 1}`} className="site-detail__media site-detail__media--landscape">
                  <Image
                    src={`/images/placeholders/${imageId}.png`}
                    alt={`${program.title} photo ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
