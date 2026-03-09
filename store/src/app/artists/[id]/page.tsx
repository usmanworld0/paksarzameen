import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getArtistById } from "@/actions/artists";
import { MapPin } from "lucide-react";

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
      <main className="container-wide py-10">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mb-12">
          {/* Artist profile */}
          <div>
            {artist.profileImage ? (
              <div className="aspect-square relative rounded-sm overflow-hidden mb-4">
                <Image
                  src={artist.profileImage}
                  alt={artist.name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-sm bg-neutral-100 flex items-center justify-center mb-4">
                <span className="text-4xl font-semibold text-neutral-300">
                  {artist.name[0]}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-semibold">{artist.name}</h1>
            {artist.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {artist.location}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            {artist.bio && (
              <div className="prose prose-neutral max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-3">About the Artisan</h2>
                <p>{artist.bio}</p>
              </div>
            )}

            {/* Social links */}
            {artist.socialLinks && (
              <div className="flex gap-4 text-sm">
                {(artist.socialLinks as Record<string, string>).instagram && (
                  <a
                    href={(artist.socialLinks as Record<string, string>).instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {(artist.socialLinks as Record<string, string>).facebook && (
                  <a
                    href={(artist.socialLinks as Record<string, string>).facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {(artist.socialLinks as Record<string, string>).website && (
                  <a
                    href={(artist.socialLinks as Record<string, string>).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Artist's products */}
        {artist.products.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Products by {artist.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
