import Image from "next/image";
import Link from "next/link";
import type { ArtistWithCount } from "@/types";

interface ArtistCardProps {
  artist: ArtistWithCount;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex flex-col items-center overflow-hidden text-center transition-all duration-300 hover:scale-105"
    >
      {/* Artist Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 mb-4">
        {artist.profileImage ? (
          <Image
            src={artist.profileImage}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-all duration-700 group-hover:scale-110"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white text-3xl">
            {artist.name[0]}
          </div>
        )}
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
        {artist.location && (
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 group-hover:text-[#0c2e1a] transition-colors">
            {artist.location}
          </p>
        )}
        <p className="mt-2 text-[9px] font-medium text-[#0c2e1a]">
          {artist._count.products} Product{artist._count.products !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
