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

  const firstImage = product.images[0]?.imageUrl || "";

  // Fetch related products from the same category
  const { products: related } = await getProducts({
    categorySlug: product.category.slug,
    limit: 4,
  });
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar />
      {/* Hero Section with Back Button */}
      <div className="sticky top-0 z-40 border-b border-[#e3d7ce] bg-[#fffaf6]">
        <div className="store-container flex items-center justify-between py-4">
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <Link
            href="/cart"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Cart
          </Link>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-[#fffaf6]">
        <div className="store-container py-12 lg:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left: Product Gallery (larger) */}
            <div className="lg:col-span-2 sticky top-24 h-fit">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Info Sidebar */}
            <div className="flex flex-col h-fit sticky top-24">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block rounded-full border border-[#d9ccc2] bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-600">
                  {product.category.name}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="mb-2 text-4xl leading-[0.95] text-neutral-900 lg:text-5xl">
                {product.name}
              </h1>

              {/* Artist */}
              {product.artist && (
                <p className="text-sm text-neutral-500 mb-4">
                  by{" "}
                  <Link href={`/artists/${product.artist.id}`} className="text-[#2c3d31] hover:underline">
                    {product.artist.name}
                  </Link>
                </p>
              )}

              {/* Price */}
              <div className="mb-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  {getRegionBadgeLabel(region)}
                </p>
                <span className="text-3xl font-bold text-neutral-900">
                  {formatRegionalPrice(discountedPrice || regionalPricing.price, region)}
                </span>
                {discountedPrice && (
                  <>
                    <span className="ml-3 text-lg text-neutral-400 line-through">
                      {formatRegionalPrice(regionalPricing.price, region)}
                    </span>
                    <span className="ml-2 bg-[#2c3d31] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-white">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-neutral-600 text-sm leading-relaxed mb-8 pb-8 border-b border-neutral-200">
                  {product.description}
                </p>
              )}

              {/* Availability */}
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Availability</p>
                <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-700" : "text-red-500"}`}>
                  {product.stock > 0 ? "Yes" : "No • Sold Out"}
                </p>
              </div>

              {/* Add to Cart */}
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: regionalPricing.price,
                  discountedPrice: discountedPrice || undefined,
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

              {/* View Cart Link */}
              <Link
                href="/cart"
                className="text-center py-3 text-sm font-medium text-neutral-600 border border-neutral-300 hover:border-neutral-900 hover:text-neutral-900 transition-colors mt-4"
              >
                View Cart
              </Link>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-neutral-200 space-y-4 text-xs">
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Artisan Made</p>
                  <p className="text-neutral-600">Hand-crafted by skilled artisans</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Authentic Materials</p>
                  <p className="text-neutral-600">Premium, ethically sourced components</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Heritage Craft</p>
                  <p className="text-neutral-600">Traditional techniques preserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <ProductAccordion
        description={product.description}
        materials={product.materials}
        careInstructions={product.careInstructions}
        heritageStory={product.heritageStory}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#fff8f2] py-12 lg:py-20">
          <div className="store-container">
            <h2 className="mb-12 text-center text-4xl leading-tight text-neutral-900 lg:text-5xl">
              Explore More
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} region={region} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
