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
      <div className="aspect-[4/5] rounded-lg bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={images[selectedIndex].imageUrl}
          alt={images[selectedIndex].altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
          priority
          quality={90}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                index === selectedIndex
                  ? "border-neutral-900 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
