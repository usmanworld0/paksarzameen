import Image from "next/image";
import Link from "next/link";
import { normalizeImageSrc } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

interface CategoryCardProps {
  category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const imageSrc = normalizeImageSrc(category.image, "/images/store_header.png");

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group store-hover-lift relative flex aspect-[4/5] items-end overflow-hidden rounded-[30px] border border-black/8 bg-[#f7f4ef]"
    >
      <Image
        src={imageSrc}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        quality={82}
        unoptimized={imageSrc.startsWith("http")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/20 bg-white/84 p-4 backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
          {category._count.products} Piece{category._count.products !== 1 ? "s" : ""}
        </p>
        <h3 className="mt-2 text-[1.7rem] leading-[0.94] tracking-[-0.05em] text-neutral-950 sm:text-[2rem]">
          {category.name}
        </h3>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
          Explore collection
        </p>
      </div>
    </Link>
  );
}
