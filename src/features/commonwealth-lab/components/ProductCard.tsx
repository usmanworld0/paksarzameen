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
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5f4f2]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          quality={80}
        />
      </Link>

      {/* Info — centered, LV style */}
      <div className="flex flex-col items-center gap-1 px-3 pt-4 pb-6 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]">
          {product.category}
        </p>
        <h3 className="mt-0.5 text-sm font-light leading-snug text-neutral-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-medium tracking-tight text-neutral-800">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
