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
      {/* Image */}
      <Link
        href={`/commonwealth-lab/products/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-103"
          quality={80}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1.5 pt-5 pb-7">
        {/* Category */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#009040]">
          {product.category}
        </p>
        {/* Name */}
        <h3 className="text-sm font-medium leading-snug text-neutral-900 line-clamp-2 group-hover:underline decoration-neutral-300 underline-offset-2 transition-all">
          {product.name}
        </h3>
        {/* Price row */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-tight text-neutral-900">
            ${product.price.toFixed(2)}
          </p>
          <Link
            href={`/commonwealth-lab/products/${product.slug}`}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-300 hover:text-neutral-900"
          >
            View →
          </Link>
        </div>
        {/* Bottom rule */}
        <div className="mt-3 h-px w-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-300" />
      </div>
    </article>
  );
}
