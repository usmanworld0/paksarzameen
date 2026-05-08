"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Artist } from "@/lib/models/Artist";

interface ArtistDetailModalProps {
  artist: Artist;
  onClose: () => void;
}

export function ArtistDetailModal({ artist, onClose }: ArtistDetailModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 text-[#707072] transition-colors hover:text-[#111111]"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 sm:p-8">
            {/* Artist Image */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-[#f3f3ee]">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 90vw, 300px"
                  className="object-cover"
                  quality={90}
                  priority
                />
              </div>

              {/* Artist Stats */}
              <div className="mt-6 flex w-full max-w-xs gap-6 text-center">
                <div className="flex-1">
                  <p className="text-2xl font-black tracking-tighter text-[#0f7a47]">
                    {artist.products}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                    Products
                  </p>
                </div>
                <div className="h-12 w-px bg-[#E5E5E5]" />
                <div className="flex-1">
                  <p className="text-2xl font-black tracking-tighter text-[#0f7a47]">35+</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Artist Information */}
            <div className="flex flex-col justify-start">
              {/* Header */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                  Artisan
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
                  {artist.name}
                </h2>
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3 border-b border-[#E5E5E5] pb-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                    Specialty
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[#111111]">{artist.specialty}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                    Region
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[#111111]">{artist.region}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                  Bio
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                  {artist.bio}
                </p>
              </div>

              {/* Full Description */}
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
                  Story
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                  {artist.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-[#111111] px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                >
                  View Products
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
