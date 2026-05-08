import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getArtistById } from "@/actions/artists";
import { getRequestRegion } from "@/lib/pricing-server";

export const dynamic = 'force-dynamic';

interface ArtistPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const artist = await getArtistById(params.id);
  if (!artist) return { title: "Artist Not Found" };
  return {
    title: artist.name,
    description: artist.bio || `Products by ${artist.name} at Paksarzameen Store.`,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const region = await getRequestRegion();
  const artist = await getArtistById(params.id);
  if (!artist) notFound();
  const productCount = artist.products.length;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Artist header */}
        <div className="border-b border-[#e6d9cf] bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-10 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400">
              <a href="/artists" className="hover:text-neutral-700 transition-colors">Artisans</a>
              <span>/</span>
              <span className="text-neutral-600">{artist.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
              {/* Profile image */}
              <div>
                {artist.profileImage ? (
                  <div className="store-card relative aspect-[3/4] overflow-hidden rounded-[22px] bg-neutral-100">
                    <Image
                      src={artist.profileImage}
                      alt={artist.name}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="store-card flex aspect-[3/4] items-center justify-center rounded-[22px] bg-neutral-800">
                    <span className="text-5xl text-white/40">
                      {artist.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                  Artisan
                </p>
                <h1 className="text-5xl leading-[0.9] text-neutral-900">
                  {artist.name}
                </h1>
                {artist.location && (
                  <p className="text-sm text-neutral-400">
                    {artist.location}
                  </p>
                )}
                {artist.bio && (
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
                    {artist.bio}
                  </p>
                )}

                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    Catalog Presence
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {productCount} {productCount === 1 ? "active product" : "active products"}
                  </p>
                </div>

                {/* Social links */}
                {artist.socialLinks && (
                  <div className="flex gap-4 pt-2">
                    {(artist.socialLinks as Record<string, string>).instagram && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#2c3d31] hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {(artist.socialLinks as Record<string, string>).facebook && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#2c3d31] hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                    {(artist.socialLinks as Record<string, string>).website && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#2c3d31] hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artist's products */}
        {artist.products.length > 0 && (
          <section className="store-section bg-[#fffefc]">
            <div className="store-container max-w-[1320px]">
            <div className="mb-12 border-b border-[#e6d9cf] pb-8 sm:mb-16 sm:pb-10">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                Collection
              </p>
              <h2 className="text-4xl leading-tight text-neutral-900">
                Products by {artist.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              {artist.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as Parameters<typeof ProductCard>[0]["product"]}
                  region={region}
                />
              ))}
            </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
