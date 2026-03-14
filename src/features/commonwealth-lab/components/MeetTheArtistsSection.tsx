"use client";

import { useState } from "react";
import Image from "next/image";
import type { Artist } from "@/lib/models/Artist";
import { dummyArtists } from "@/data/artists";
import { ArtistDetailModal } from "./ArtistDetailModal";

export function MeetTheArtistsSection() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const featuredArtists = dummyArtists.filter((a) => a.featured);

  return (
    <>
      <section className="bg-neutral-50 py-16 sm:py-28">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
          {/* Section header */}
          <div className="mb-16 border-b border-neutral-100 pb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
              Stories & Heritage
            </p>
            <h2
              className="mt-2 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Meet the Artists
            </h2>
            <p className="mt-4 text-sm font-light text-neutral-600">
              Discover the talented artisans behind Paksarzameen Store&apos;s finest collections.
              Each piece represents decades of heritage, skill, and dedication to traditional craftsmanship.
            </p>
          </div>

          {/* Artist Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {featuredArtists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className="group flex flex-col items-center overflow-hidden text-center transition-all duration-300 hover:scale-105"
              >
                {/* Artist Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 mb-4">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
                      View Profile
                    </p>
                  </div>
                </div>

                {/* Artist Info */}
                <div className="w-full">
                  <h3 className="text-sm font-light text-neutral-900 group-hover:text-[#0c2e1a] transition-colors">
                    {artist.name}
                  </h3>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 group-hover:text-[#0c2e1a] transition-colors">
                    {artist.specialty}
                  </p>
                  <p className="mt-2 text-[9px] text-neutral-600">{artist.region}</p>
                  <p className="mt-2 text-[9px] font-medium text-[#0c2e1a]">
                    {artist.products} Products
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <ArtistDetailModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </>
  );
}
