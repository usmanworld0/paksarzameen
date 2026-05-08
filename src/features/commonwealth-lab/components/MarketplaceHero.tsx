"use client";

import Image from "next/image";
import Link from "next/link";

interface MarketplaceHeroProps {
  title?: string;
  subtitle?: string;
}

export function MarketplaceHero({
  title = "Paksarzameen Store",
  subtitle = "Ethically sourced. Artisan crafted. Every purchase builds community wealth across our communities.",
}: MarketplaceHeroProps) {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background image */}
      <Image
        src="/images/commonwealth_header.jpeg"
        alt="Paksarzameen Store banner"
        fill
        sizes="100vw"
        className="object-cover opacity-50"
        quality={85}
        priority
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/42 via-neutral-950/12 to-neutral-950/60" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-screen-xl flex-col items-center px-[5%] text-center">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-12 bg-white/30" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">
            PakSarZameen · Paksarzameen Store
          </p>
          <span className="h-px w-12 bg-white/30" />
        </div>

        <h1 className="text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-white">
          {title}
        </h1>

        <div className="my-8 h-px w-24 bg-white/20" />

        <p className="max-w-md text-sm font-medium leading-relaxed text-white/60">
          {subtitle}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/commonwealth-lab/products"
            className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
          >
            Shop Collection
          </Link>
          <Link
            href="#featured"
            className="rounded-xl border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:border-white/60 hover:text-white"
          >
            Discover More ↓
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="h-8 w-px bg-white animate-pulse" />
      </div>
    </section>
  );
}
