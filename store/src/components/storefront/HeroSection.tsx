import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0c2e1a]">
      {/* Gradient overlay (replaces background image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c2e1a] via-[#0c2e1a]/90 to-[#1a4d30]/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(196,162,101,0.08),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.03),transparent_50%)]" />

      <div className="relative z-10 text-center px-4 sm:px-6">
        {/* Eyebrow */}
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/60 mb-6">
          PakSarZameen &middot; Commonwealth
        </p>

        {/* Title */}
        <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight mb-6">
          Commonwealth
          <br />
          <span className="italic font-normal">Lab</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10">
          A curated marketplace connecting Pakistan&apos;s finest artisans with
          the world. Every purchase builds community wealth.
        </p>

        {/* CTA */}
        <Link
          href="/products"
          className="inline-block border border-white/60 text-white text-[11px] sm:text-xs tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-white hover:text-[#0c2e1a] transition-all duration-300"
        >
          Shop Collection
        </Link>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
