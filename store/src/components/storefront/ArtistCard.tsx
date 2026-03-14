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
      className="group store-card flex flex-col items-center overflow-hidden rounded-[22px] text-center transition-all duration-300 hover:-translate-y-1"
    >
      {/* Artist Image */}
      <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-neutral-900">
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
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-3xl text-white">
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
      <div className="w-full px-4 pb-6">
        <h3 className="text-xl leading-tight text-neutral-900 transition-colors group-hover:text-[#2c3d31]">
          {artist.name}
        </h3>
        {artist.location && (
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 transition-colors group-hover:text-[#2c3d31]">
            {artist.location}
          </p>
        )}
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2c3d31]">
          {artist._count.products} Product{artist._count.products !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
