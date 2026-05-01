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

  return (
    <article className="mx-auto w-full max-w-screen-xl px-[5%] py-24 sm:py-28 lg:py-32">
      <Link
        href="/programs"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-psz-green hover:text-psz-green-light transition-colors"
      >
        &larr; Back To Programs
      </Link>

      <header className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          {program.category}
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          {program.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base lg:max-w-3xl lg:text-lg">
          {program.description}
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-1">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Overview</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {program.fullContent}
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Problem Being Addressed</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
            {narrative.problem}
          </p>

          <h2 className="mt-8 font-heading text-2xl font-semibold text-neutral-900">PSZ Solution</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
            {narrative.solution}
          </p>
        </section>
      </section>

      <section className="mt-10" aria-labelledby="program-photos-heading">
        <h2 id="program-photos-heading" className="font-heading text-3xl font-semibold text-neutral-900">
          Photos
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const placeholderFiles = [
              "/images/placeholders/10.png",
              "/images/placeholders/11.png",
              "/images/placeholders/12.png",
              "/images/placeholders/13.png",
              "/images/placeholders/14.png",
              "/images/placeholders/15.png",
            ];
            return Array.from({ length: 3 }).map((_, index) => {
              const src = placeholderFiles[(index % placeholderFiles.length)];
              return (
                <figure
                  key={`${program.slug}-photo-${index + 1}`}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                >
                  <Image
                    src={src}
                    alt={`${program.title} photo ${index + 1}`}
                    width={900}
                    height={600}
                    className="h-52 w-full object-cover"
                  />
                </figure>
              );
            });
          })()}
        </div>
      </section>
    </article>
  );
}
