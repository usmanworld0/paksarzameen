"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/models/Product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15">
      <Link
        href={`/commonwealth-lab/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[#f3f3ee]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          quality={80}
        />
      </Link>

      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
          {product.category}
        </p>
        <h3 className="mt-1 text-base font-black tracking-tighter text-[#111111] line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-3 text-lg font-black tracking-tighter text-[#111111]">
          PKR {product.price.toLocaleString()}
        </p>
      </div>
    </article>
  );
}
