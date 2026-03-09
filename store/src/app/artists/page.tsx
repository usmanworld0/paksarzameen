import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ArtistCard } from "@/components/storefront/ArtistCard";
import { getArtists } from "@/actions/artists";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Artisans",
  description:
    "Meet the talented artisans behind our collection — master craftspeople keeping Pakistani traditions alive.",
};

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
              Craftsmanship
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight mb-2">
              Our Artisans
            </h1>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Meet the talented craftspeople behind every piece. Each artisan
              brings generations of tradition to their work.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
          {artists.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm">
                Artisan profiles coming soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
