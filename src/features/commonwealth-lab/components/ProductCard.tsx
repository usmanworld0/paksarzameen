"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/models/Product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-white">
      {/* Image — full-width portrait, no border or shadow */}
      <Link
        href={`/commonwealth-lab/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5f4f2] sm:aspect-[4/5]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          quality={80}
        />
      </Link>

      {/* Info — centered, LV style */}
      <div className="flex flex-col items-center gap-0.5 px-2 pt-3 pb-4 text-center sm:gap-1 sm:px-3 sm:pt-4 sm:pb-6">
        <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#0c2e1a] sm:text-[9px] sm:tracking-[0.3em]">
          {product.category}
        </p>
        <h3 className="mt-0.5 text-xs font-light leading-snug text-neutral-900 line-clamp-2 sm:text-sm">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-medium tracking-tight text-neutral-800 sm:mt-2 sm:text-sm">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
