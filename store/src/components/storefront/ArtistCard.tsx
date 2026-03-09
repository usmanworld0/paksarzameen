import Image from "next/image";
import Link from "next/link";
import type { ArtistWithCount } from "@/types";

interface ArtistCardProps {
  artist: ArtistWithCount;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block text-center">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden bg-[#f5f4f2] mb-4">
        {artist.profileImage ? (
          <Image
            src={artist.profileImage}
            alt={artist.name}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0c2e1a]/5 text-[#0c2e1a] text-3xl">
            {artist.name[0]}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-[10px] tracking-[0.2em] uppercase">
            View Profile
          </span>
        </div>
      </div>
      <h3 className="text-sm text-neutral-900 group-hover:text-[#0c2e1a] transition-colors">
        {artist.name}
      </h3>
      {artist.location && (
        <p className="text-[10px] text-neutral-400 tracking-wide mt-0.5">
          {artist.location}
        </p>
      )}
      <p className="text-[10px] text-neutral-400 mt-0.5">
        {artist._count.products} product{artist._count.products !== 1 ? "s" : ""}
      </p>
    </Link>
  );
}
