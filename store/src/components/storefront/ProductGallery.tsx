"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@prisma/client";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-neutral-100 rounded-sm flex items-center justify-center">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 rounded-sm">
        <Image
          src={images[selectedIndex].imageUrl}
          alt={images[selectedIndex].altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          quality={85}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-brand-charcoal"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
