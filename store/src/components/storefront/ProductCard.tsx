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
  const rawImage = product.images[0]?.imageUrl || "/images/commonwealth_header.jpeg";
  const mainImage = rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/")
    ? rawImage
    : `/${rawImage}`;
  const isRemoteImage = mainImage.startsWith("http://") || mainImage.startsWith("https://");
  const hasDiscount = discountPercent && discountPercent > 0;
  const isAvailable = product.stock > 0;
  const regionalPricing = resolveProductRegionalPricing(product, region);
  const finalPrice = hasDiscount
    ? getDiscountedPrice(regionalPricing.price, discountPercent)
    : regionalPricing.price;

  return (
    <article className="group store-card overflow-hidden rounded-[28px]">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-[220px] w-full overflow-hidden bg-white sm:h-[260px] lg:h-[300px]"
        style={{
          backgroundImage: "url('/images/commonwealth_header.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          quality={80}
          unoptimized
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_64%,rgba(15,122,71,0.12)_100%)]" />
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
            <span className="rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-white">
              -{discountPercent}%
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col items-center px-3 pb-6 pt-4 text-center sm:px-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#0f7a47]">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base leading-tight text-neutral-900 sm:text-lg">
          {product.name}
        </h3>
        {product.artist && (
          <p className="mt-1 text-xs text-neutral-500">
            by {product.artist.name}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-[#1f1f1f] sm:text-base">
            {formatRegionalPrice(finalPrice, region)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-500 line-through">
              {formatRegionalPrice(regionalPricing.price, region)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
