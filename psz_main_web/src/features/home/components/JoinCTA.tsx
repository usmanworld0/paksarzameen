import Link from "next/link";

import { joinContent } from "@/features/home/home.content";

export function JoinCTA() {
  return (
    <section className="py-20" aria-labelledby="join-cta-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden rounded-[2rem] border border-psz-forest/10 bg-[linear-gradient(135deg,#f6f1e5,#efe4ce)] p-8 shadow-soft sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-psz-sand/20 blur-2xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-psz-olive/20 blur-2xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-psz-olive">
              Collaboration
            </p>
            <h2
              id="join-cta-heading"
              className="mt-4 font-heading text-4xl leading-tight text-psz-forest sm:text-5xl"
            >
              {joinContent.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-psz-charcoal/80 sm:text-lg">
              {joinContent.text}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/get-involved"
                className="rounded-full bg-psz-forest px-6 py-3 text-sm font-semibold text-psz-cream transition-colors hover:bg-psz-charcoal"
              >
                {joinContent.volunteerCta}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-psz-forest/25 px-6 py-3 text-sm font-semibold text-psz-forest hover:bg-psz-forest/10"
              >
                {joinContent.partnerCta}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
