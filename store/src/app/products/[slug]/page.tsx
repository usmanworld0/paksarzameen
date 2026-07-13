import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getProductBySlug, getProducts } from "@/actions/products";
import { getArtists } from "@/actions/artists";
import { getProductDiscount } from "@/actions/sales";
import {
  formatRegionalPrice,
  getRegionBadgeLabel,
  resolveProductRegionalPricing,
} from "@/lib/pricing";
import { getRequestRegion } from "@/lib/pricing-server";
import { normalizeImageSrc } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { ProductAccordion } from "./ProductAccordion";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: { slug: string };
  searchParams?: { artist?: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Paksarzameen Store`,
    description: product.description?.slice(0, 160) || `${product.name} — Paksarzameen Store`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || undefined,
      images: product.images[0]?.imageUrl
        ? [{ url: product.images[0].imageUrl, width: 800, height: 1000 }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const region = await getRequestRegion();
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const artists = await getArtists();
  const selectedArtist = searchParams?.artist
    ? artists.find((artist) => artist.id === searchParams.artist) ?? null
    : null;

  const regionalPricing = resolveProductRegionalPricing(product, region);

  const discount = await getProductDiscount(product.id, product.categoryId);
  const discountedPrice =
    discount > 0 ? regionalPricing.price * (1 - discount / 100) : null;

  const firstImage = normalizeImageSrc(product.images[0]?.imageUrl);

  const { products: related } = await getProducts({
    categorySlug: product.category.slug,
    limit: 4,
  });
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="bg-white pt-[72px]">

        <section className="bg-white lg:h-[calc(100vh-144px)] lg:overflow-hidden">
          <div className="grid grid-cols-1 lg:h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)]">
              <div className="px-5 py-5 sm:px-8 lg:h-full lg:overflow-y-auto lg:px-0 lg:py-0 scrollbar-thin">
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                  model3DUrl={product.model3DUrl}
                />
              </div>

              <div className="max-w-xl px-5 py-10 sm:px-8 lg:h-full lg:max-w-[560px] lg:justify-self-center lg:overflow-y-auto lg:px-10 lg:py-[clamp(3rem,9vh,7rem)] scrollbar-thin">
                <p className="store-kicker text-center">{product.category.name}</p>
                <h1 className="mt-2 text-center text-3xl sm:text-4xl leading-[1.1] tracking-[-0.04em] text-neutral-950">
                  {product.name}
                </h1>

                {product.artist && (
                  <p className="mt-2 text-center text-sm text-neutral-500">
                    By{" "}
                    <Link
                      href={`/artists/${product.artist.id}`}
                      className="text-neutral-950 transition-colors hover:text-neutral-600"
                    >
                      {product.artist.name}
                    </Link>
                  </p>
                )}

                <div className="mt-6 border-b border-black/10 pb-6 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                    {getRegionBadgeLabel(region)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-end justify-center gap-3">
                    <span className="text-2xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-3xl">
                      {formatRegionalPrice(discountedPrice ?? regionalPricing.price, region)}
                    </span>
                    {discountedPrice && (
                      <>
                        <span className="text-lg text-neutral-400 line-through">
                          {formatRegionalPrice(regionalPricing.price, region)}
                        </span>
                        <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-700">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {selectedArtist ? (
                    <>
                      <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">Selected artist</p>
                          <p className="mt-1 text-sm font-medium text-neutral-950">{selectedArtist.name}</p>
                        </div>
                        <Link
                          href={`/products/${product.slug}/choose-artist`}
                          className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-950"
                        >
                          Change
                        </Link>
                      </div>
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: regionalPricing.price,
                          discountedPrice: discountedPrice ?? undefined,
                          image: firstImage,
                          available: product.stock > 0,
                          region,
                        }}
                        customizationOptions={
                          product.customizable
                            ? product.category.customizationOptions
                            : []
                        }
                        selectedArtist={{ id: selectedArtist.id, name: selectedArtist.name }}
                      />
                    </>
                  ) : (
                    <Link
                      href={`/products/${product.slug}/choose-artist`}
                      className="flex h-14 w-full items-center justify-between bg-neutral-950 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-700"
                    >
                      Choose artist <span aria-hidden>&rarr;</span>
                    </Link>
                  )}
                </div>

                <div className="mt-7">
                  <ProductAccordion
                    variant="compact"
                    description={product.description}
                    materials={product.materials}
                    careInstructions={product.careInstructions}
                    heritageStory={product.heritageStory}
                  />
                </div>
              </div>
            </div>
        </section>


        {relatedProducts.length > 0 && (
          <section className="store-section-soft border-t border-black/6">
            <div className="store-container">
              <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="store-kicker">Related Pieces</p>
                  <h2 className="mt-4 text-[clamp(2.3rem,4vw,4.4rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">
                    Explore more from this collection.
                  </h2>
                </div>
                <Link href="/products" className="store-link-inline">
                  Back to all products
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} region={region} />
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
