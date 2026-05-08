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
      <section className="bg-[#f3f3ee] py-16 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-[5%]">
          {/* Section header */}
          <div className="mb-12 border-b border-[#E5E5E5] pb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Stories &amp; Heritage
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
              Meet the Artists
            </h2>
            <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
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
                className="group flex flex-col items-center overflow-hidden text-center transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Artist Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee] mb-4">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    quality={85}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                      View Profile
                    </p>
                  </div>
                </div>

                {/* Artist Info */}
                <div className="w-full">
                  <h3 className="text-base font-black tracking-tighter text-[#111111] transition-colors group-hover:text-[#0f7a47]">
                    {artist.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072] transition-colors group-hover:text-[#0f7a47]">
                    {artist.specialty}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#707072]">{artist.region}</p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0f7a47]">
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
