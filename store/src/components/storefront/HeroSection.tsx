import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="store-mesh-bg relative isolate flex min-h-[92vh] w-full items-center overflow-hidden pt-[72px]">
      <Image
        src="/images/commonwealth_header.jpeg"
        alt="Paksarzameen Store banner"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
        quality={85}
        priority
      />

      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,248,241,0.92)_10%,rgba(255,248,241,0.66)_46%,rgba(255,248,241,0.25)_100%)]" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#d19392]/28 blur-3xl" />
      <div className="absolute bottom-6 right-0 h-72 w-72 rounded-full bg-[#2c3d31]/14 blur-3xl" />

      <div className="store-container relative z-10 grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="store-pill-label mb-5">PakSarZameen Community Commerce</p>
          <h1 className="max-w-2xl text-5xl leading-[0.88] text-[#1d1d1d] sm:text-6xl lg:text-7xl">
            Conscious Beauty,
            <span className="block text-[#2c3d31]">Heritage Craft</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            A luxury-inspired marketplace for handcrafted wellness and lifestyle products.
            Every order supports local makers and strengthens community-owned growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/products" className="store-button-primary">
              Shop Collection
            </Link>
            <Link href="#featured" className="store-button-secondary">
              Explore Featured
            </Link>
          </div>
        </div>

        <div className="store-card rounded-[28px] p-6 sm:p-8 lg:ml-auto lg:max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2c3d31]/70">
            This Week
          </p>
          <h2 className="mt-2 text-3xl leading-tight text-neutral-900">Featured Ritual Sets</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Discover limited small-batch edits curated for mindful gifting and elevated daily rituals.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl border border-[#e5d8cf] bg-white/85 px-3 py-4">
              <p className="text-xl font-semibold text-[#2c3d31]">100%</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Profit to Impact
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5d8cf] bg-white/85 px-3 py-4">
              <p className="text-xl font-semibold text-[#2c3d31]">24/7</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Online Access
              </p>
            </div>
          </div>

          <Link
            href="/customizations"
            className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-[#2c3d31] transition-colors hover:text-neutral-900"
          >
            Build Your Custom Order →
          </Link>
        </div>
      </div>
    </section>
  );
}
