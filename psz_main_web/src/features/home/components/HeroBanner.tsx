import Link from "next/link";
import Image from "next/image";

import { heroContent } from "@/features/home/home.content";

export function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden border-b border-psz-forest/10" aria-label="Hero Banner">
      <div className="absolute inset-0 -z-20 bg-psz-charcoal" />
      <video
        className="absolute inset-0 -z-10 hidden h-full w-full object-cover md:block"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroContent.mobileFallback}
      >
        <source src={heroContent.videoSrc} type="video/mp4" />
      </video>
      <Image
        src={heroContent.mobileFallback}
        alt="PakSarZameen community landscape"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover md:hidden"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(10,16,14,0.85),rgba(10,16,14,0.58)_42%,rgba(10,16,14,0.72))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(211,180,131,0.35),transparent_35%)]" />

      <div className="mx-auto flex min-h-[72vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex rounded-full border border-psz-sand/70 bg-black/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-psz-sand">
            Mission Platform
          </p>
          <h1 className="font-heading text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {heroContent.title}
          </h1>
          <p className="font-heading text-2xl text-psz-cream sm:text-3xl">
            {heroContent.subtitle}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-psz-cream/90 sm:text-lg">
            {heroContent.supportingLine}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/programs"
              className="rounded-full bg-psz-sand px-6 py-3 text-sm font-semibold text-psz-charcoal transition-transform hover:-translate-y-px"
            >
              {heroContent.exploreCta}
            </Link>
            <Link
              href="/get-involved"
              className="rounded-full border border-psz-cream/80 bg-white/10 px-6 py-3 text-sm font-semibold text-psz-cream backdrop-blur transition-colors hover:bg-white/20"
            >
              {heroContent.joinCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
