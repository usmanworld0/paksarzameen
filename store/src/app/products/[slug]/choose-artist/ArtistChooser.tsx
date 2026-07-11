"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { normalizeImageSrc } from "@/lib/utils";

type ArtistOption = {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  profileImage: string | null;
  productCount: number;
};

interface ArtistChooserProps {
  artists: ArtistOption[];
  productName: string;
  productSlug: string;
}

export function ArtistChooser({ artists, productName, productSlug }: ArtistChooserProps) {
  const [selectedId, setSelectedId] = useState(artists[0]?.id ?? "");
  const selectedArtist = useMemo(
    () => artists.find((artist) => artist.id === selectedId) ?? null,
    [artists, selectedId]
  );

  if (artists.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <div>
          <p className="text-sm text-neutral-500">No artists are available to select right now.</p>
          <Link href={`/products/${productSlug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950">
            <ArrowLeft className="h-4 w-4" /> Back to product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="grid min-h-[calc(100vh-72px)] grid-cols-1 bg-white lg:grid-cols-[minmax(0,7fr)_minmax(330px,3fr)]">
      <div className="border-b border-black/10 px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
        <div className="mb-8 flex items-center justify-between gap-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">Select an artist</p>
            <h1 className="mt-2 text-2xl tracking-[-0.05em] text-neutral-950 sm:text-3xl">Choose who brings your piece to life.</h1>
          </div>
          <Link href={`/products/${productSlug}`} className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-neutral-950 sm:inline-flex">
            <ArrowLeft className="h-3.5 w-3.5" /> Product
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {artists.map((artist) => {
            const imageSrc = artist.profileImage ? normalizeImageSrc(artist.profileImage) : null;
            const isSelected = artist.id === selectedId;

            return (
              <button
                key={artist.id}
                type="button"
                onClick={() => setSelectedId(artist.id)}
                className={`group text-left ${isSelected ? "ring-1 ring-neutral-950 ring-offset-4" : ""}`}
                aria-pressed={isSelected}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 18vw"
                      className="object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.025] group-hover:grayscale-0 group-focus-visible:grayscale-0"
                      quality={85}
                      unoptimized={imageSrc.startsWith("http")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-800 text-4xl text-white grayscale transition group-hover:grayscale-0">
                      {artist.name[0]}
                    </div>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-[10px] font-medium uppercase tracking-[0.18em] text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    Select artist
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-neutral-950">{artist.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-neutral-400">{artist.location || "Pakistan"}</p>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="flex bg-[#fafafa] px-6 py-8 sm:px-10 lg:min-h-full lg:px-10 lg:py-12">
        {selectedArtist ? (
          <div className="flex w-full flex-col lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">Selected artist</p>
            <h2 className="mt-3 text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">{selectedArtist.name}</h2>
            {selectedArtist.location ? (
              <p className="mt-5 flex items-center gap-2 text-sm text-neutral-500"><MapPin className="h-4 w-4" /> {selectedArtist.location}</p>
            ) : null}
            <div className="mt-8 border-y border-black/10 py-7">
              <p className="text-sm leading-7 text-neutral-600">{selectedArtist.bio || "A Paksarzameen artisan creating thoughtful work rooted in craft, care, and local tradition."}</p>
              <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">{selectedArtist.productCount} available {selectedArtist.productCount === 1 ? "piece" : "pieces"}</p>
            </div>
            <div className="mt-auto pt-8">
              <p className="mb-4 text-xs leading-5 text-neutral-500">You are choosing an artist for <span className="font-medium text-neutral-950">{productName}</span>.</p>
              <Link
                href={`/products/${productSlug}?artist=${encodeURIComponent(selectedArtist.id)}`}
                className="flex h-14 w-full items-center justify-between bg-neutral-950 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-700"
              >
                Proceed <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/products/${productSlug}`} className="mt-5 flex justify-center text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-950">
                Cancel
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}