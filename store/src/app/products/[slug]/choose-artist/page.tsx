import { notFound } from "next/navigation";
import { getArtists } from "@/actions/artists";
import { getProductBySlug } from "@/actions/products";
import { getProductDiscount } from "@/actions/sales";
import { Navbar } from "@/components/storefront/Navbar";
import { getRequestRegion } from "@/lib/pricing-server";
import { resolveProductRegionalPricing } from "@/lib/pricing";
import { normalizeImageSrc } from "@/lib/utils";
import { ArtistChooser } from "./ArtistChooser";

interface ChooseArtistPageProps {
  params: { slug: string };
}

export default async function ChooseArtistPage({ params }: ChooseArtistPageProps) {
  const [product, artists, region] = await Promise.all([
    getProductBySlug(params.slug),
    getArtists(),
    getRequestRegion(),
  ]);
  if (!product) notFound();

  const regionalPricing = resolveProductRegionalPricing(product, region);
  const discount = await getProductDiscount(product.id, product.categoryId);
  const discountedPrice = discount > 0 ? regionalPricing.price * (1 - discount / 100) : undefined;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <ArtistChooser
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: normalizeImageSrc(product.images[0]?.imageUrl),
            price: regionalPricing.price,
            discountedPrice,
            available: product.stock > 0,
            region,
          }}
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