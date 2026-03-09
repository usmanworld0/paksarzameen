import Image from "next/image";
import Link from "next/link";
import type { CategoryWithCount } from "@/types";

interface CategoryCardProps {
  category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden aspect-[4/3] bg-[#f5f4f2]"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <h3 className="text-white text-sm sm:text-base font-light tracking-tight">
          {category.name}
        </h3>
        <p className="text-white/50 text-[10px] tracking-[0.15em] uppercase mt-1">
          {category._count.products} product{category._count.products !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
