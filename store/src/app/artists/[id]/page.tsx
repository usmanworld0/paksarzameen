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
        <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b border-neutral-100 bg-[#f5f4f2]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
              {/* Profile image */}
              <div>
                {artist.profileImage ? (
                  <div className="aspect-square relative overflow-hidden bg-white">
                    <Image
                      src={artist.profileImage}
                      alt={artist.name}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-white flex items-center justify-center">
                    <span className="text-4xl text-neutral-300">
                      {artist.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50">
                  Artisan
                </p>
                <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
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
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
              Collection
            </p>
            <h2 className="text-xl font-light tracking-tight text-neutral-900 mb-8">
              Products by {artist.name}
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
              {artist.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as Parameters<typeof ProductCard>[0]["product"]}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
