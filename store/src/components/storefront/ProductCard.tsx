import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  discountPercent?: number;
}

export function ProductCard({ product, discountPercent }: ProductCardProps) {
  const mainImage = product.images[0]?.imageUrl || "/placeholder.svg";
  const hasDiscount = discountPercent && discountPercent > 0;
  const finalPrice = hasDiscount
    ? getDiscountedPrice(product.price, discountPercent)
    : product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <article className="overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#f5f4f2]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-neutral-900 text-white text-[9px] tracking-[0.15em] uppercase px-2.5 py-1">
                Sold Out
              </span>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#0c2e1a] text-white text-[9px] tracking-[0.15em] uppercase px-2.5 py-1">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Info — centered, minimal, LV-style */}
        <div className="px-2 pt-3 pb-4 text-center">
          <p className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#0c2e1a]/60 mb-1">
            {product.category.name}
          </p>
          <h3 className="text-xs sm:text-sm text-neutral-900 leading-snug line-clamp-2 mb-1.5">
            {product.name}
          </h3>
          {product.artist && (
            <p className="text-[10px] text-neutral-400 mb-1">
              by {product.artist.name}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs sm:text-sm text-neutral-900">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
