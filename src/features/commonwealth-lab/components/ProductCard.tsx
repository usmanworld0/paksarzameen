"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/models/Product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {/* Image */}
      <Link
        href={`/commonwealth-lab/products/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          quality={80}
        />
        {/* Category label */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium tracking-wide text-neutral-700 backdrop-blur-sm">
          {product.category}
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-sm font-semibold leading-snug text-neutral-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-auto text-base font-bold tracking-tight text-neutral-900">
          ${product.price.toFixed(2)}
        </p>
        <Link
          href={`/commonwealth-lab/products/${product.slug}`}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-colors duration-300 hover:bg-neutral-900 hover:text-white"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}
