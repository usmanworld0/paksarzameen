"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreRegion } from "@/lib/pricing";
import { normalizeImageSrc } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

type ArtistOption = { id: string; name: string; bio: string | null; location: string | null; profileImage: string | null; productCount: number };
type SelectedProduct = { id: string; name: string; slug: string; image: string; price: number; discountedPrice?: number; available: boolean; region: StoreRegion };

interface ArtistChooserProps { artists: ArtistOption[]; product: SelectedProduct; }
interface ArtistDetailProps { artist: ArtistOption; product: SelectedProduct; onProceed: () => void; onClose?: () => void; }

function ArtistDetail({ artist, product, onProceed, onClose }: ArtistDetailProps) {
  return (
    <div className="flex min-h-full w-full flex-col">
      {onClose ? <button type="button" onClick={onClose} className="ml-auto inline-flex h-10 w-10 items-center justify-center border border-black/10 text-neutral-700 transition-colors hover:bg-neutral-950 hover:text-white" aria-label="Close artist details"><X className="h-4 w-4" /></button> : null}
      <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">Selected artist</p>
      <h2 className="mt-2 text-[clamp(1.75rem,2.55vw,2.6rem)] leading-[0.94] tracking-[-0.05em] text-neutral-950">{artist.name}</h2>
      {artist.location ? <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><MapPin className="h-4 w-4" /> {artist.location}</p> : null}
      <div className="mt-6 border-y border-black/10 py-5">
        <p className="text-[13px] leading-6 text-neutral-600">{artist.bio || "A Paksarzameen artisan creating thoughtful work rooted in craft, care, and local tradition."}</p>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">{artist.productCount} available {artist.productCount === 1 ? "piece" : "pieces"}</p>
      </div>
      <div className="mt-auto pt-6">
        <p className="mb-3 text-[11px] leading-5 text-neutral-500">You are choosing an artist for <span className="font-medium text-neutral-950">{product.name}</span>.</p>
        <button type="button" onClick={onProceed} disabled={!product.available} className="flex h-14 w-full items-center justify-between bg-neutral-950 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40">
          {product.available ? "Add to bag" : "Currently sold out"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ArtistChooser({ artists, product }: ArtistChooserProps) {
  const [selectedId, setSelectedId] = useState(artists[0]?.id ?? "");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const selectedArtist = useMemo(() => artists.find((artist) => artist.id === selectedId) ?? null, [artists, selectedId]);

  function addSelectedArtistToCart() {
    if (!selectedArtist || !product.available) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.image,
      quantity: 1,
      region: product.region,
      customizations: [{
        key: "__selected_artist",
        optionName: "Selected Artist",
        groupLabel: "Artist",
        value: selectedArtist.id,
        valueLabel: selectedArtist.name,
        priceAdjustment: 0,
      }],
    });
    router.push("/cart");
  }

  if (artists.length === 0) {
    return <div className="flex min-h-[60vh] items-center justify-center px-6 text-center"><div><p className="text-sm text-neutral-500">No artists are available to select right now.</p><Link href={`/products/${product.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950"><ArrowLeft className="h-4 w-4" /> Back to product</Link></div></div>;
  }

  return (
    <section className="grid min-h-[calc(100vh-72px)] grid-cols-1 bg-white lg:grid-cols-[minmax(0,7fr)_minmax(330px,3fr)]">
      <div className="border-b border-black/10 px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
        <div className="mb-8 flex items-center justify-between gap-5"><div><p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">Select an artist</p><h1 className="mt-2 text-2xl tracking-[-0.05em] text-neutral-950 sm:text-3xl">Choose who brings your piece to life.</h1></div><Link href={`/products/${product.slug}`} className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-neutral-950 sm:inline-flex"><ArrowLeft className="h-3.5 w-3.5" /> Product</Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {artists.map((artist) => {
            const imageSrc = artist.profileImage ? normalizeImageSrc(artist.profileImage) : null;
            const isSelected = artist.id === selectedId;
            return <button key={artist.id} type="button" onClick={() => { setSelectedId(artist.id); setMobileDetailOpen(true); }} className={`group text-left ${isSelected ? "ring-1 ring-neutral-950 ring-offset-4" : ""}`} aria-pressed={isSelected}>
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                {imageSrc ? <Image src={imageSrc} alt={artist.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 18vw" className="object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.025] group-hover:grayscale-0 group-focus-visible:grayscale-0" quality={85} unoptimized={imageSrc.startsWith("http")} /> : <div className="flex h-full items-center justify-center bg-neutral-800 text-4xl text-white grayscale transition group-hover:grayscale-0">{artist.name[0]}</div>}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-[10px] font-medium uppercase tracking-[0.18em] text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">Select artist</span>
              </div>
              <p className="mt-3 text-sm font-medium text-neutral-950">{artist.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-neutral-400">{artist.location || "Pakistan"}</p>
            </button>;
          })}
        </div>
      </div>
      <aside className="hidden min-h-0 bg-[#fafafa] px-10 py-12 lg:flex lg:max-h-[calc(100vh-72px)] lg:overflow-y-auto scrollbar-thin">{selectedArtist ? <ArtistDetail artist={selectedArtist} product={product} onProceed={addSelectedArtistToCart} /> : null}</aside>
      {mobileDetailOpen && selectedArtist ? <div className="fixed inset-0 z-50 flex items-end bg-black/45 p-3 sm:items-center sm:justify-center sm:p-6 lg:hidden" role="dialog" aria-modal="true" aria-label="Artist details"><div className="max-h-[88dvh] w-full overflow-y-auto bg-white p-6 shadow-2xl sm:max-w-md sm:p-8 scrollbar-thin"><ArtistDetail artist={selectedArtist} product={product} onProceed={addSelectedArtistToCart} onClose={() => setMobileDetailOpen(false)} /></div></div> : null}
    </section>
  );
}
