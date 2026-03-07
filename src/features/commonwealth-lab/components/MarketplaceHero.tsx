"use client";

import Image from "next/image";
import Link from "next/link";

interface MarketplaceHeroProps {
  title?: string;
  subtitle?: string;
}

export function MarketplaceHero({
  title = "Commonwealth Lab",
  subtitle = "Ethically sourced. Artisan crafted. Every purchase builds community wealth across the Commonwealth region.",
}: MarketplaceHeroProps) {
  return (
    <section className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
        alt="Artisan marketplace banner"
        fill
        sizes="100vw"
        className="object-cover opacity-30"
        quality={85}
        priority
      />

      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/20 to-neutral-950/70" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
        {/* Eyebrow line */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-12 bg-white/30" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">
            PakSarZameen · Commonwealth
          </p>
          <span className="h-px w-12 bg-white/30" />
        </div>

        <h1
          className="text-5xl font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-8xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {title}
        </h1>

        {/* Thin divider */}
        <div className="my-8 h-px w-24 bg-white/20" />

        <p className="max-w-md text-sm font-light leading-relaxed tracking-wide text-white/60">
          {subtitle}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/commonwealth-lab/products"
            className="border border-white/80 px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-400 hover:bg-white hover:text-neutral-900"
          >
            Shop Collection
          </Link>
          <Link
            href="#featured"
            className="px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 transition-colors duration-300 hover:text-white"
          >
            Discover More ↓
          </Link>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="h-8 w-px bg-white animate-pulse" />
      </div>
    </section>
  );
}
