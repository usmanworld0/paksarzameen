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
      <div className="relative h-[52vh] w-full min-h-[220px] overflow-hidden rounded-[20px] bg-white sm:h-[60vh] sm:min-h-[260px] sm:w-[75%] sm:rounded-[24px]">
        <Image
          src={slides[index].image}
          alt={`${slides[index].label} cover`}
          fill
          sizes="(max-width: 640px) 100vw, 75vw"
          className="object-cover"
          priority
        />

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-800 shadow-sm sm:left-4 sm:px-3 sm:py-2 sm:text-xs"
              aria-label="Show previous product cover"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-800 shadow-sm sm:right-4 sm:px-3 sm:py-2 sm:text-xs"
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
