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
  const totalProducts = artists.reduce(
    (sum, artist) => sum + artist._count.products,
    0
  );

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fff8f2]">
          <div className="store-container max-w-[1320px]">
            <div className="mb-12 border-b border-[#e6d9cf] pb-8 sm:mb-16 sm:pb-10">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2c3d31]">
                Stories & Heritage
              </p>
              <h1 className="store-heading">
                Our Artisans
              </h1>
              <p className="store-subheading mt-3 max-w-xl">
                Meet the talented craftspeople behind every piece. Each artisan
                brings generations of tradition to their work.
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                {artists.length} artisans · {totalProducts} live products
              </p>
            </div>

            {artists.length === 0 ? (
              <div className="store-card rounded-[22px] py-20 text-center">
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
