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
    <div className="bg-[#f3f3ee]">
      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <Link
            href="/programs"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47] transition hover:text-[#1a9d5f]"
          >
            &larr; Back To Programs
          </Link>

          <header className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 lg:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              {program.category}
            </p>
            <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl lg:text-4xl">
              {program.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[#707072] lg:max-w-3xl">
              {program.description}
            </p>
          </header>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 lg:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Overview</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Program Overview</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                {program.fullContent}
              </p>
            </section>

            <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 lg:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Challenge</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Problem Being Addressed</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                {narrative.problem}
              </p>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Response</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">PSZ Solution</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                {narrative.solution}
              </p>
            </section>
          </div>

          <section className="mt-5" aria-labelledby="program-photos-heading">
            <h2
              id="program-photos-heading"
              className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl"
            >
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
                      className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white"
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
        </div>
      </div>
    </div>
  );
}
