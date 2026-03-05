import Link from "next/link";

import type { Program } from "@/lib/models/Program";

type ProgramsPreviewProps = {
  programs: Program[];
};

export function ProgramsPreview({ programs }: ProgramsPreviewProps) {
  return (
    <section className="bg-white/65 py-20" aria-labelledby="programs-preview-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-psz-olive">
              Core Departments
            </p>
            <h2
              id="programs-preview-heading"
              className="mt-3 font-heading text-4xl leading-tight text-psz-forest sm:text-5xl"
            >
              Programs Driving On-Ground Change
            </h2>
          </div>
          <Link
            href="/programs"
            className="rounded-full border border-psz-forest/20 px-5 py-2 text-sm font-semibold text-psz-forest transition-colors hover:bg-psz-forest hover:text-psz-cream"
          >
            View All Programs
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {programs.map((program, index) => (
            <article
              key={program.id}
              className="overflow-hidden rounded-3xl border border-psz-forest/10 bg-white shadow-panel"
            >
              <div className="relative h-44 bg-[linear-gradient(140deg,#1f3b2d,#5f7a54)] p-5 text-psz-cream">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-sand">
                  {program.category}
                </p>
                <p className="mt-6 font-heading text-2xl leading-tight">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 max-w-[14ch] text-sm text-psz-cream/90">
                  {program.title}
                </p>
              </div>
              <div className="space-y-4 p-5">
                <h3 className="font-heading text-2xl text-psz-forest">
                  {program.title}
                </h3>
                <p className="text-sm leading-relaxed text-psz-charcoal/80">
                  {program.description}
                </p>
                <Link
                  href={`/programs/${program.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-psz-forest hover:text-psz-olive"
                >
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
