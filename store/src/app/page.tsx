import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ArtistCard } from "@/components/storefront/ArtistCard";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getArtists } from "@/actions/artists";
import { getRequestRegion } from "@/lib/pricing-server";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const region = await getRequestRegion();
  const [{ products: featured }, categories, artists] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
    getArtists(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Category Grid */}
        {categories.length > 0 && (
          <section className="store-section bg-[#fffaf6]">
            <div className="store-container">
              <div className="mb-12 border-b border-[#e7ddd4] pb-8 sm:mb-16 sm:pb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                  Browse By
                </p>
                <h2 className="store-heading mt-2">Shop Categories</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {categories.slice(0, 8).map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Meet the Artisans */}
        {artists.length > 0 && (
          <section className="store-section-soft">
            <div className="store-container">
              {/* Section header */}
              <div className="mb-12 border-b border-[#e6d9cf] pb-8 sm:mb-16 sm:pb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                  Stories & Heritage
                </p>
                <h2 className="store-heading mt-2">Meet the Artists</h2>
                <p className="store-subheading mt-4 max-w-3xl">
                  Discover the talented artisans behind Paksarzameen Store&apos;s finest collections.
                  Each piece represents decades of heritage, skill, and dedication to traditional craftsmanship.
                </p>
              </div>

              {/* Artist Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {artists.slice(0, 5).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>

              {artists.length > 5 && (
                <div className="mt-12 text-center">
                  <Link
                    href="/artists"
                    className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-[#2c3d31]"
                  >
                    View All Artisans →
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section id="featured" className="store-section bg-[#fffefc]">
            <div className="store-container">
              {/* Section header */}
              <div className="mb-12 flex flex-col items-start gap-4 border-b border-[#ebe1d8] pb-8 sm:mb-16 sm:flex-row sm:items-end sm:justify-between sm:pb-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                    Curated Selection
                  </p>
                  <h2 className="store-heading mt-2">Featured Products</h2>
                </div>
                <Link
                  href="/products"
                  className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-[#2c3d31]"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} region={region} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="bg-[#2c3d31] py-8">
          <div className="store-container">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
              100% of profits support artisan communities &amp; PSZ social programmes
            </p>
          </div>
        </div>

        {/* CTA */}
        <section className="store-section border-t border-[#e6dbd2] bg-[#fff8f2]">
          <div className="store-container max-w-3xl text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#d7c8bc]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
                Paksarzameen Store
              </p>
              <span className="h-px w-12 bg-[#d7c8bc]" />
            </div>
            <h2 className="store-heading">
              Every Purchase Makes an Impact
            </h2>
            <div className="mx-auto my-8 h-px w-16 bg-[#d7c8bc]" />
            <p className="store-subheading">
              When you shop at Paksarzameen Store, 100&nbsp;% of profits go directly
              to artisan communities and PakSarZameen social programmes.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/products" className="store-button-primary">
                Explore Collection
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://paksarzameenwfo.com"}
                className="store-button-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn About PSZ →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
