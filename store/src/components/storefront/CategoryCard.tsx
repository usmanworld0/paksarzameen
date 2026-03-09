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
      className="group relative flex aspect-[3/4] items-end overflow-hidden bg-neutral-900"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105"
          quality={75}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="relative z-10 p-6 w-full">
        <h3
          className="text-lg font-light text-white"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {category.name}
        </h3>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
          {category._count.products} Product{category._count.products !== 1 ? "s" : ""} →
        </p>
      </div>
      {/* Bottom border accent on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0c2e1a] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
