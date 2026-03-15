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
      className="group store-card relative flex aspect-[3/4] items-end overflow-hidden rounded-[22px]"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
          quality={75}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/20" />
      <div className="relative z-10 w-full p-5 sm:p-6">
        <div className="inline-block rounded-xl bg-black/45 px-4 py-3 backdrop-blur-[1px]">
        <h3 className="text-2xl leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] sm:text-[1.8rem]">
          {category.name}
        </h3>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)] transition-colors duration-300 group-hover:text-white">
          {category._count.products} Product{category._count.products !== 1 ? "s" : ""} →
        </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d19392] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
