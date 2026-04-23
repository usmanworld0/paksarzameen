import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getProductBySlug, getProducts } from "@/actions/products";
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

export default async function ProductPage({ params }: ProductPageProps) {
  const region = await getRequestRegion();
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

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
        <section className="border-b border-black/6 bg-[#fcfbf8]">
          <div className="store-container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              <Link href="/" className="transition-colors hover:text-neutral-950">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="transition-colors hover:text-neutral-950">
                Shop
              </Link>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition-colors hover:text-neutral-950"
              >
                {product.category.name}
              </Link>
              <span>/</span>
              <span className="text-neutral-700">{product.name}</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              {getRegionBadgeLabel(region)}
            </p>
          </div>
        </section>

        <section className="store-section bg-white !pt-10">
          <div className="store-container">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:h-fit">
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                  model3DUrl={product.model3DUrl}
                />
              </div>

              <div className="max-w-xl">
                <p className="store-kicker">{product.category.name}</p>
                <h1 className="mt-4 text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.88] tracking-[-0.08em] text-neutral-950">
                  {product.name}
                </h1>

                {product.artist && (
                  <p className="mt-4 text-sm text-neutral-500">
                    By{" "}
                    <Link
                      href={`/artists/${product.artist.id}`}
                      className="text-neutral-950 transition-colors hover:text-neutral-600"
                    >
                      {product.artist.name}
                    </Link>
                  </p>
                )}

                <div className="mt-8 border-b border-black/8 pb-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                    {getRegionBadgeLabel(region)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <span className="text-3xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-[2.3rem]">
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

                {product.description && (
                  <p className="mt-8 text-[15px] leading-8 text-neutral-600">
                    {product.description}
                  </p>
                )}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-black/8 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      Availability
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-950">
                      {product.stock > 0 ? "Ready to order" : "Currently sold out"}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      Craft
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-950">
                      Hand-finished by skilled artisans using heritage techniques.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      Checkout
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-950">
                      Review in cart first, then complete payment securely with Stripe.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-black/8 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      Impact
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-950">
                      Your purchase supports artisan livelihoods and PSZ programmes.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/8 pt-8">
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
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/cart" className="store-button-secondary">
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductAccordion
          description={product.description}
          materials={product.materials}
          careInstructions={product.careInstructions}
          heritageStory={product.heritageStory}
        />

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
