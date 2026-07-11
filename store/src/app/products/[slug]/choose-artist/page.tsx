import { notFound } from "next/navigation";
import { getArtists } from "@/actions/artists";
import { getProductBySlug } from "@/actions/products";
import { Navbar } from "@/components/storefront/Navbar";
import { ArtistChooser } from "./ArtistChooser";

interface ChooseArtistPageProps {
  params: { slug: string };
}

export default async function ChooseArtistPage({ params }: ChooseArtistPageProps) {
  const [product, artists] = await Promise.all([getProductBySlug(params.slug), getArtists()]);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <ArtistChooser
          productName={product.name}
          productSlug={product.slug}
          artists={artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
            bio: artist.bio,
            location: artist.location,
            profileImage: artist.profileImage,
            productCount: artist._count.products,
          }))}
        />
      </main>
    </>
  );
}