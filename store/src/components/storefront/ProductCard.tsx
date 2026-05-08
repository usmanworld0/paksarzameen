import Image from "next/image";
import Link from "next/link";
import { getDiscountedPrice, normalizeImageSrc } from "@/lib/utils";
import {
  formatRegionalPrice,
  resolveProductRegionalPricing,
  type StoreRegion,
} from "@/lib/pricing";
import type { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  discountPercent?: number;
  region?: StoreRegion;
}

export function ProductCard({ product, discountPercent, region = "PAK" }: ProductCardProps) {
  const mainImage = normalizeImageSrc(product.images[0]?.imageUrl);
  const hoverImage = normalizeImageSrc(product.images[1]?.imageUrl, mainImage);
  const hasDiscount = discountPercent && discountPercent > 0;
  const isAvailable = product.stock > 0;
  const regionalPricing = resolveProductRegionalPricing(product, region);
  const finalPrice = hasDiscount
    ? getDiscountedPrice(regionalPricing.price, discountPercent)
    : regionalPricing.price;

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {mainImage ? (
            <>
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                quality={84}
                unoptimized={mainImage.startsWith("http") || hoverImage.startsWith("http")}
              />
              {product.images[1] && (
                <Image
                  src={hoverImage}
                  alt={product.images[1]?.altText || `${product.name} alternate view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  quality={84}
                  unoptimized={hoverImage.startsWith("http")}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
              <span className="text-sm text-neutral-500">Image coming soon</span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {!isAvailable && (
              <span className="rounded-full border border-white/35 bg-white/86 px-2.5 py-1 text-[9px] font-normal uppercase tracking-[0.16em] text-neutral-950 backdrop-blur-md">
                Sold Out
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full border border-white/35 bg-neutral-950 px-2.5 py-1 text-[9px] font-normal uppercase tracking-[0.16em] text-white">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="mt-3 block text-center">
        <h3 className="text-[1.02rem] font-normal leading-tight tracking-[-0.02em] text-neutral-900 sm:text-[1.05rem]">
          {product.name}
        </h3>
        <p className="mt-1 text-[0.88rem] font-normal tracking-[-0.01em] text-neutral-700 sm:text-[0.92rem]">
          {formatRegionalPrice(finalPrice, region)}
        </p>
        {hasDiscount && (
          <p className="mt-1 text-[0.78rem] text-neutral-400 line-through">
            {formatRegionalPrice(regionalPricing.price, region)}
          </p>
        )}
      </Link>
    </article>
  );
}
