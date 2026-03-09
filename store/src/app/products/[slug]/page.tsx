import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/actions/products";
import { getProductDiscount } from "@/actions/sales";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import Link from "next/link";

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
      <main className="container-wide py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div className="space-y-6">
            <div>
              {product.featured && (
                <Badge variant="gold" className="mb-3">
                  Featured
                </Badge>
              )}
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              {product.artist && (
                <p className="text-muted-foreground">
                  by{" "}
                  <Link
                    href={`/artists/${product.artist.id}`}
                    className="text-brand-green hover:underline"
                  >
                    {product.artist.name}
                  </Link>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                {formatPrice(discountedPrice || product.price)}
              </span>
              {discountedPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="destructive">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Stock */}
            <p
              className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>

            {/* Description */}
            {product.description && (
              <div className="prose prose-neutral max-w-none">
                <p>{product.description}</p>
              </div>
            )}

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

            {/* Category */}
            <div className="border-t pt-6 mt-6">
              <p className="text-sm text-muted-foreground">
                Category:{" "}
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-brand-green hover:underline"
                >
                  {product.category.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
