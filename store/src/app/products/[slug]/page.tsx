import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { getProductBySlug } from "@/actions/products";
import { getProductDiscount } from "@/actions/sales";
import { formatPrice } from "@/lib/utils";
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
    title: product.name,
    description: product.description || `${product.name} — Commonwealth Lab`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.images[0]?.imageUrl
        ? [{ url: product.images[0].imageUrl }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const discount = await getProductDiscount(product.id, product.categoryId);
  const discountedPrice =
    discount > 0 ? product.price * (1 - discount / 100) : null;

  const firstImage = product.images[0]?.imageUrl || "";

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400">
            <Link href="/products" className="hover:text-neutral-900 transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-neutral-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-700">{product.name}</span>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-16">
            {/* Gallery — 2/3 */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Details — 1/3, sticky */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Category badge */}
              <span className="inline-block text-[9px] tracking-[0.25em] uppercase text-[#0c2e1a]/60 border border-[#0c2e1a]/15 px-3 py-1">
                {product.category.name}
              </span>

              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
                {product.name}
              </h1>

              {product.artist && (
                <p className="text-sm text-neutral-400">
                  by{" "}
                  <Link
                    href={`/artists/${product.artist.id}`}
                    className="text-[#0c2e1a] hover:underline"
                  >
                    {product.artist.name}
                  </Link>
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-xl text-neutral-900">
                  {formatPrice(discountedPrice || product.price)}
                </span>
                {discountedPrice && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[9px] tracking-[0.15em] uppercase bg-[#0c2e1a] text-white px-2 py-0.5">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <p className={`text-[11px] tracking-wide ${product.stock > 0 ? "text-[#0c2e1a]" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>

              {/* Add to Cart */}
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  discountedPrice: discountedPrice || undefined,
                  image: firstImage,
                  stock: product.stock,
                }}
                customizationOptions={
                  product.customizable
                    ? product.category.customizationOptions
                    : []
                }
              />

              {/* Accordion sections */}
              <ProductAccordion description={product.description} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
