"use client";

import Image from "next/image";
import Link from "next/link";

interface MarketplaceHeroProps {
  title?: string;
  subtitle?: string;
}

export function MarketplaceHero({
  title = "Commonwealth Lab Marketplace",
  subtitle = "Empowering regional artisans and micro-entrepreneurs through ethically sourced, hand-crafted goods that preserve heritage and build community wealth.",
}: MarketplaceHeroProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-neutral-900">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
        alt="Artisan marketplace banner"
        fill
        sizes="100vw"
        className="object-cover opacity-40"
        quality={85}
        priority
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-transparent to-neutral-900/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          PakSarZameen
        </p>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/commonwealth-lab/products"
            className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-all duration-300 hover:bg-neutral-200"
          >
            Shop Now
          </Link>
          <Link
            href="#featured"
            className="rounded-full border border-white/30 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
}
