import Image from "next/image";
import Link from "next/link";
import { getDiscountedPrice } from "@/lib/utils";
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
  const mainImage = product.images[0]?.imageUrl || "/images/commonwealth_header.jpeg";
  const isRemoteImage = mainImage.startsWith("http://") || mainImage.startsWith("https://");
  const hasDiscount = discountPercent && discountPercent > 0;
  const isAvailable = product.stock > 0;
  const regionalPricing = resolveProductRegionalPricing(product, region);
  const finalPrice = hasDiscount
    ? getDiscountedPrice(regionalPricing.price, discountPercent)
    : regionalPricing.price;

  return (
    <article className="group store-card overflow-hidden rounded-[22px] transition-transform duration-300 hover:-translate-y-1">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f7eee8]"
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          quality={80}
          unoptimized={isRemoteImage}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/36 to-transparent" />
        {/* Badges */}
        {!isAvailable && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-white">
              Sold Out
            </span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-[#2c3d31] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-white">
              -{discountPercent}%
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col items-center px-3 pb-6 pt-4 text-center sm:px-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#2c3d31]">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base leading-tight text-black sm:text-lg">
          {product.name}
        </h3>
        {product.artist && (
          <p className="mt-1 text-xs text-neutral-500">
            by {product.artist.name}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
            {formatRegionalPrice(finalPrice, region)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatRegionalPrice(regionalPricing.price, region)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
