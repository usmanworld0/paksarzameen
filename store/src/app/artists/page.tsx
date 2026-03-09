import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ArtistCard } from "@/components/storefront/ArtistCard";
import { getArtists } from "@/actions/artists";

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
      <main className="container-wide py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold mb-2">Our Artisans</h1>
          <p className="text-muted-foreground max-w-2xl">
            Meet the talented craftspeople behind every piece. Each artisan
            brings generations of tradition to their work.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Artisan profiles coming soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
