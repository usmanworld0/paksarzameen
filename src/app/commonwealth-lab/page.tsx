"use client";

import Image from "next/image";
import Link from "next/link";
import { MarketplaceHero } from "@/features/commonwealth-lab/components/MarketplaceHero";
import { ProductCard } from "@/features/commonwealth-lab/components/ProductCard";
import { dummyProducts } from "@/data/products";
import { PRODUCT_CATEGORIES } from "@/lib/models/Product";

const featured = dummyProducts.filter((p) => p.featured);

const CATEGORY_IMAGES: Record<string, string> = {
  "Traditional Clothing":
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
  Handicrafts:
    "https://images.unsplash.com/photo-1612196808214-b7e239e5f6dc?w=600&h=800&fit=crop",
  "Cultural Goods":
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=800&fit=crop",
  "PSZ Merchandise":
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=800&fit=crop",
};

export default function CommonwealthLabPage() {
  return (
    <>
      {/* Hero */}
      <MarketplaceHero />

      {/* Featured Products */}
      <section id="featured" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Curated Selection
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500">
              Hand-picked artisan goods that showcase the finest craftsmanship
              from communities across the Commonwealth region.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              href="/commonwealth-lab/products"
              className="rounded-full border border-neutral-900 px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-colors duration-300 hover:bg-neutral-900 hover:text-white"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Browse By
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Shop Categories
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/commonwealth-lab/products?category=${encodeURIComponent(category)}`}
                className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-lg"
              >
                <Image
                  src={CATEGORY_IMAGES[category]}
                  alt={category}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-6">
                  <h3 className="text-lg font-bold text-white">{category}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">
                    Explore →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Every Purchase Makes an Impact
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            When you shop at Commonwealth Lab, 100&nbsp;% of profits go directly
            to artisan communities and PakSarZameen social programmes. Explore
            our collection and become part of the movement.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commonwealth-lab/products"
              className="rounded-full bg-white px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-all duration-300 hover:bg-neutral-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/30 px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Learn About PSZ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
