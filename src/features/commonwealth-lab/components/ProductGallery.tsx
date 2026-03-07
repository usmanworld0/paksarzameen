"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} — image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
          quality={90}
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square w-20 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                i === selectedIndex
                  ? "border-neutral-900 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
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
