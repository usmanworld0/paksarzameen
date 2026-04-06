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
      className="group store-card relative flex aspect-[3/4] items-end overflow-hidden rounded-[24px]"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
          quality={75}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0f7a47]/72 via-[#0f7a47]/22 to-transparent" />
      <div className="relative z-10 w-full p-5 sm:p-6">
        <h3 className="text-2xl leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-[1.8rem]">
          {category.name}
        </h3>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.35)] transition-colors duration-300 group-hover:text-[#e6d9cf]">
          {category._count.products} Product{category._count.products !== 1 ? "s" : ""} →
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0f7a47] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
