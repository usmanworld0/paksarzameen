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
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 text-neutral-400 transition-colors hover:text-neutral-900"
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
          <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 sm:p-12">
            {/* Artist Image */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg bg-neutral-200">
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
              <div className="mt-8 flex w-full max-w-xs gap-6 text-center">
                <div className="flex-1">
                  <p className="text-2xl font-light text-[#0c2e1a]">
                    {artist.products}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Products
                  </p>
                </div>
                <div className="h-12 w-px bg-neutral-200" />
                <div className="flex-1">
                  <p className="text-2xl font-light text-[#0c2e1a]">35+</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Artist Information */}
            <div className="flex flex-col justify-start">
              {/* Header */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
                  Artisan
                </p>
                <h2
                  className="mt-2 text-3xl font-light text-neutral-900"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {artist.name}
                </h2>
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3 border-b border-neutral-100 pb-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    Specialty
                  </p>
                  <p className="mt-1.5 text-sm text-neutral-900">{artist.specialty}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    Region
                  </p>
                  <p className="mt-1.5 text-sm text-neutral-900">{artist.region}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Bio
                </p>
                <p className="mt-3 text-[13px] font-medium text-neutral-700">
                  {artist.bio}
                </p>
              </div>

              {/* Full Description */}
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Story
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {artist.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onClose}
                  className="flex-1 border border-neutral-900 px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
                >
                  View Products
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-neutral-900"
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
