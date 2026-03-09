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
    <article className="group flex flex-col bg-white">
      {/* Image — full-width portrait, no border or shadow */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5f4f2] sm:aspect-[4/5]"
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          quality={80}
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
      </Link>

      {/* Info — centered, LV style */}
      <div className="flex flex-col items-center gap-0.5 px-2 pt-3 pb-4 text-center sm:gap-1 sm:px-3 sm:pt-4 sm:pb-6">
        <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#0c2e1a] sm:text-[9px] sm:tracking-[0.3em]">
          {product.category.name}
        </p>
        <h3 className="mt-0.5 text-xs font-light leading-snug text-neutral-900 line-clamp-2 sm:text-sm">
          {product.name}
        </h3>
        {product.artist && (
          <p className="text-[10px] text-neutral-400">
            by {product.artist.name}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 sm:mt-2">
          <span className="text-xs font-medium tracking-tight text-neutral-800 sm:text-sm">
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
  );
}
