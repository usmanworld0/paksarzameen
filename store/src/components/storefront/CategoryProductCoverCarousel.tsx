"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type CarouselProduct = {
  id: string;
  name: string;
  slug: string;
  images: Array<{ imageUrl: string }>;
};

type CategoryProductCoverCarouselProps = {
  categoryName: string;
  categoryImage: string | null;
  fallbackImage: string;
  products: CarouselProduct[];
};

export function CategoryProductCoverCarousel({
  categoryName,
  categoryImage,
  fallbackImage,
  products,
}: CategoryProductCoverCarouselProps) {
  const slides = useMemo(() => {
    if (products.length > 0) {
      return products.map((product) => ({
        id: product.id,
        label: product.name,
        image:
          product.images?.[0]?.imageUrl || categoryImage || fallbackImage,
      }));
    }

    return [
      {
        id: "category-fallback",
        label: categoryName,
        image: categoryImage || fallbackImage,
      },
    ];
  }, [products, categoryImage, fallbackImage, categoryName]);

  const [index, setIndex] = useState(0);

  function move(delta: number) {
    setIndex((current) => {
      const next = (current + delta + slides.length) % slides.length;
      return next;
    });
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-[60vh] w-[75%] min-h-[260px] overflow-hidden rounded-[24px] bg-white">
        <Image
          src={slides[index].image}
          alt={`${slides[index].label} cover`}
          fill
          sizes="75vw"
          className="object-cover"
          priority
        />

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-800 shadow-sm"
              aria-label="Show previous product cover"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-800 shadow-sm"
              aria-label="Show next product cover"
            >
              Next
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center gap-2">
          {slides.map((slide, dotIndex) => {
            const active = dotIndex === index;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(dotIndex)}
                className={`h-2 rounded-full transition-all ${active ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300"}`}
                aria-label={`Show ${slide.label}`}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
