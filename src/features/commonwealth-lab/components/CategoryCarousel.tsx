"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/models/Product";

interface CategoryCarouselProps {
  categoryImages: Record<string, string>;
}

export function CategoryCarousel({ categoryImages }: CategoryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Calculate card width (280px on mobile, 320px on sm+)
  const getCardWidth = () => {
    if (typeof window === "undefined") return 280;
    return window.innerWidth < 640 ? 280 : 320;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const distance = e.clientX - startX;
    setCurrentTranslate(prevTranslate + distance);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const distance = e.touches[0].clientX - startX;
    setCurrentTranslate(prevTranslate + distance);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPrevTranslate(currentTranslate);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPrevTranslate(currentTranslate);
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate}px)`;
    }
  }, [currentTranslate]);

  useEffect(() => {
    if (isDragging) return;

    const animate = () => {
      setPrevTranslate((prev) => {
        let newTranslate = prev - 2; // Slow movement
        const trackWidth = 50 * (getCardWidth() + 16); // Total width of one full set

        if (newTranslate <= -trackWidth) {
          newTranslate = 0;
        }

        setCurrentTranslate(newTranslate);
        animationRef.current = requestAnimationFrame(animate);
        return newTranslate;
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  const cardWidth = getCardWidth();

  return (
    <div
      className="category-scroll-container cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className="category-scroll-track"
        style={{ transition: isDragging ? "none" : undefined }}
      >
        {/* First set */}
        {PRODUCT_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/commonwealth-lab/products?category=${encodeURIComponent(category)}`}
            className="category-card group relative flex-shrink-0 aspect-[3/4] items-end overflow-hidden bg-neutral-900"
            style={{ width: `${cardWidth}px` }}
          >
            <Image
              src={categoryImages[category]}
              alt={category}
              fill
              sizes={`${cardWidth}px`}
              className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105 pointer-events-none"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="relative z-10 p-6 w-full">
              <h3
                className="text-lg font-light text-white pointer-events-none"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {category}
              </h3>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/80 pointer-events-none">
                Explore →
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0c2e1a] transition-all duration-500 group-hover:w-full" />
          </Link>
        ))}

        {/* Second set (for seamless loop) */}
        {PRODUCT_CATEGORIES.map((category) => (
          <Link
            key={`${category}-2`}
            href={`/commonwealth-lab/products?category=${encodeURIComponent(category)}`}
            className="category-card group relative flex-shrink-0 aspect-[3/4] items-end overflow-hidden bg-neutral-900"
            style={{ width: `${cardWidth}px` }}
          >
            <Image
              src={categoryImages[category]}
              alt={category}
              fill
              sizes={`${cardWidth}px`}
              className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105 pointer-events-none"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="relative z-10 p-6 w-full">
              <h3
                className="text-lg font-light text-white pointer-events-none"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {category}
              </h3>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/80 pointer-events-none">
                Explore →
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0c2e1a] transition-all duration-500 group-hover:w-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}
