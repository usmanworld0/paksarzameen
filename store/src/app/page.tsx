import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategorySection } from "@/components/storefront/CategorySection";
import { ArtistCard } from "@/components/storefront/ArtistCard";
import Image from "next/image";
import CategoryCoverVideo from "@/components/storefront/CategoryCoverVideo";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getArtists } from "@/actions/artists";
import { getRequestRegion } from "@/lib/pricing-server";
import { getStorefrontNavigation } from "@/lib/storefront-navigation";
import { normalizeImageSrc, truncate } from "@/lib/utils";
import Link from "next/link";
import type { StorefrontHeroData } from "@/types/storefront";
import { DatabaseConfigNotice } from "@/components/storefront/DatabaseConfigNotice";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  const region = await getRequestRegion();
  const [{ products: featured }, categories, artists, navigation] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
    getArtists(),
    getStorefrontNavigation(),
  ]);

  const firstFeatured = featured[0];
  const firstCategory = categories[0];
  const heroImageCandidate = "/videos/commonwealth_hero.mp4";
  const heroMediaSrc = normalizeImageSrc(heroImageCandidate, "/images/store_header.png");
  const heroMediaType = /\.(mp4|webm|ogg)$/i.test(heroMediaSrc) ? "video" : "image";

  const heroData: StorefrontHeroData = {
    eyebrow: "Bespoke",
    title: "Your Vision, Crafted",
    ctaLabel: "Explore Collection",
    ctaHref: "/products",
    secondaryCtaLabel: firstCategory ? "Design Your Own" : undefined,
    secondaryCtaHref: firstCategory ? `/categories/${firstCategory.slug}` : undefined,
    media: {
      type: heroMediaType,
      src: heroMediaSrc,
      poster: "/videos/posters/commonwealth_hero-poster.webp",
      alt: firstFeatured?.name || firstCategory?.name || "Paksarzameen Store hero",
    },
  };

  return (
    <>
      <Navbar data={navigation} />
      <main className="store-shell">
        {!dbConfigured && (
          <div className="store-container pt-10">
            <DatabaseConfigNotice />
          </div>
        )}

        <HeroSection data={heroData} />

        <CategorySection categories={categories} />

        {artists.length > 0 && (
          <>
            <CategoryCoverVideo src="/videos/categories.mp4" webmSrc="/videos/categories.webm" poster="/videos/posters/categories-mp4-poster.webp" />

            <section className="store-section bg-white">
              <div className="store-container">
                <div className="mb-12 text-center">
                  <p className="store-kicker">Artisans</p>
                  <h2 className="store-heading mt-4">Meet the Makers</h2>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">
                  {artists.slice(0, 5).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>

                {artists.length > 5 && (
                  <div className="mt-10 text-center">
                    <Link href="/artists" className="store-pill-outline">
                      View all artisans
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {featured.length > 0 && (
          <>
            <section className="relative h-[100svh] w-full overflow-hidden bg-neutral-100">
              <Image
                src="/images/store/products-cover.jpg"
                alt="Products cover"
                fill
                sizes="100vw"
                className="object-cover"
                quality={90}
              />
            </section>

            <section id="featured" className="store-section bg-white">
              <div className="store-container">
                <div className="mb-12 text-center">
                  <p className="store-kicker">Products</p>
                  <h2 className="store-heading mt-4">Featured Pieces</h2>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">
                  {featured.map((product) => (
                    <ProductCard key={product.id} product={product} region={region} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <div className="border-y border-black/6 bg-white">
          <div className="store-container">
            <div className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
              <p className="store-kicker text-neutral-500">Purposeful Commerce</p>
              <p className="max-w-4xl text-[1.05rem] leading-8 tracking-[-0.02em] text-neutral-900 sm:text-[1.2rem]">
                Every purchase is designed to feel premium while staying rooted
                in impact. 100% of profits support artisan communities and
                PakSarZameen social programmes.
              </p>
            </div>
          </div>
        </div>

        {/* Promotional card removed per request */}
      </main>
      <Footer />
    </>
  );
}
