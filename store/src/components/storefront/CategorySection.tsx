import Image from "next/image";
import Link from "next/link";

import { normalizeImageSrc } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

type CategorySectionProps = {
  categories: CategoryWithCount[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  if (!categories.length) return null;

  return (
    <section className="store-section bg-white">
      <div className="store-container">
        <div className="mb-12 text-center">
          <p className="store-kicker">Collections</p>
          <h2 className="store-heading mt-4">
            Explore a Selection of the Maison's Creations
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const imageSrc = normalizeImageSrc(category.image, "/images/store_header.png");

            return (
              <div key={category.id} className="group">
                <Link href={`/categories/${category.slug}`} className="block overflow-hidden">
                  <div className="relative w-full aspect-[4/5] bg-neutral-100">
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      quality={84}
                      unoptimized={imageSrc.startsWith("http")}
                    />
                  </div>
                </Link>

                <Link href={`/categories/${category.slug}`} className="mt-3 block text-center">
                  <h3 className="mt-1 text-[1.05rem] font-normal leading-tight tracking-[-0.02em] text-neutral-900">
                    {category.name}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
