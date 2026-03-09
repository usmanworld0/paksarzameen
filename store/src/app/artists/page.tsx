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
        <section className="bg-white py-24">
          <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
            {/* Section header — left-aligned with border */}
            <div className="border-b border-neutral-100 pb-10 mb-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a] mb-3">
                Stories & Heritage
              </p>
              <h1 className="text-3xl font-bold text-neutral-900">
                Our Artisans
              </h1>
              <p className="text-sm text-neutral-500 mt-3 max-w-xl">
                Meet the talented craftspeople behind every piece. Each artisan
                brings generations of tradition to their work.
              </p>
            </div>

            {artists.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-400 text-sm">
                  Artisan profiles coming soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
