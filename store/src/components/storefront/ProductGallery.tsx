"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@prisma/client";
import { normalizeImageSrc } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const normalizedImages = images.map((image) => ({
    ...image,
    imageUrl: normalizeImageSrc(image.imageUrl),
  }));

  if (normalizedImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] border border-black/8 bg-[#f7f4ef]">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
      {normalizedImages.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[720px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 scrollbar-thin">
          {normalizedImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-[18px] border transition-all duration-300 lg:w-full ${
                index === selectedIndex
                  ? "border-neutral-950 shadow-[0_16px_34px_rgba(17,17,17,0.08)]"
                  : "border-black/8 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${index + 1}`}
                fill
                sizes="88px"
                className="object-cover"
                quality={68}
                unoptimized={img.imageUrl.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-black/8 bg-[#f7f4ef] lg:order-2">
        <Image
          src={normalizedImages[selectedIndex].imageUrl}
          alt={normalizedImages[selectedIndex].altText || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-cover transition-opacity duration-500"
          priority
          quality={90}
          unoptimized={normalizedImages[selectedIndex].imageUrl.startsWith("http")}
        />
        <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/82 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-600 backdrop-blur-md">
          {selectedIndex + 1} / {normalizedImages.length}
        </div>
      </div>
    </div>
  );
}
