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
      className="group relative block overflow-hidden rounded-sm aspect-[4/3] bg-neutral-100"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white text-lg font-serif font-light tracking-tight">
          {category.name}
        </h3>
        <p className="text-neutral-300 text-xs mt-1">
          {category._count.products} product{category._count.products !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
