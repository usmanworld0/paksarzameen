import Image from "next/image";
import Link from "next/link";
import { normalizeImageSrc } from "@/lib/utils";
import type { ArtistWithCount } from "@/types";

interface ArtistCardProps {
  artist: ArtistWithCount;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const imageSrc = artist.profileImage
    ? normalizeImageSrc(artist.profileImage)
    : null;

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/artists/${artist.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            quality={85}
            unoptimized={imageSrc.startsWith("http")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-3xl text-white">
            {artist.name[0]}
          </div>
        )}
        </div>
      </Link>

      <Link href={`/artists/${artist.slug}`} className="mt-3 block text-center">
        <h3 className="text-[1.02rem] font-normal leading-tight tracking-[-0.02em] text-neutral-900 sm:text-[1.05rem]">
          {artist.name}
        </h3>
      </Link>
    </article>
  );
}
