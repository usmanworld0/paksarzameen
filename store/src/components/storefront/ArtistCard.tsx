import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ArtistWithCount } from "@/types";

interface ArtistCardProps {
  artist: ArtistWithCount;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <article className="text-center">
        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden bg-neutral-100 mb-4">
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
            <div className="w-full h-full flex items-center justify-center bg-brand-green/10 text-brand-green text-3xl font-serif">
              {artist.name[0]}
            </div>
          )}
        </div>
        <h3 className="text-base font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors">
          {artist.name}
        </h3>
        {artist.location && (
          <p className="text-sm text-neutral-500 flex items-center justify-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {artist.location}
          </p>
        )}
        <p className="text-xs text-neutral-400 mt-1">
          {artist._count.products} product{artist._count.products !== 1 ? "s" : ""}
        </p>
      </article>
    </Link>
  );
}
