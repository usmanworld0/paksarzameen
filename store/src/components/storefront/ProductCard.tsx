import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 rounded-sm">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <Badge variant="gold" className="text-[10px]">Featured</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-[10px]">
                -{discountPercent}%
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-[10px]">Sold Out</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <p className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
          <h3 className="text-sm font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.artist && (
            <p className="text-xs text-neutral-500 mt-0.5">
              by {product.artist.name}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-brand-charcoal">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
