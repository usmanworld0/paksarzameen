import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getArtistById } from "@/actions/artists";

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
    description: artist.bio || `Products by ${artist.name} at Commonwealth Lab.`,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await getArtistById(params.id);
  if (!artist) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Artist header */}
        <div className="py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-b border-neutral-100 bg-neutral-50">
          <div className="mx-auto max-w-screen-2xl">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
              {/* Profile image */}
              <div>
                {artist.profileImage ? (
                  <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={artist.profileImage}
                      alt={artist.name}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-lg bg-neutral-800 flex items-center justify-center">
                    <span className="text-5xl text-white/40">
                      {artist.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
                  Artisan
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
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

                {/* Social links */}
                {artist.socialLinks && (
                  <div className="flex gap-4 pt-2">
                    {(artist.socialLinks as Record<string, string>).instagram && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#0c2e1a] hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {(artist.socialLinks as Record<string, string>).facebook && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#0c2e1a] hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                    {(artist.socialLinks as Record<string, string>).website && (
                      <a
                        href={(artist.socialLinks as Record<string, string>).website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-[#0c2e1a] hover:underline"
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
          <section className="bg-white py-24">
            <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
            <div className="border-b border-neutral-100 pb-10 mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a] mb-3">
                Collection
              </p>
              <h2 className="text-2xl font-bold text-neutral-900">
                Products by {artist.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              {artist.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as Parameters<typeof ProductCard>[0]["product"]}
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
