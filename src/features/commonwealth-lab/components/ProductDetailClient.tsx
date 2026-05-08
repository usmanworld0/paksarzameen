"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/models/Product";
import { useCart } from "@/features/commonwealth-lab/context/CartContext";
import { ProductGallery } from "./ProductGallery";
import { QuantitySelector } from "./QuantitySelector";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

type AccordionType = "description" | "ingredients" | "application" | "heritage";

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<AccordionType | null>("description");

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const accordions: { id: AccordionType; label: string }[] = [
    { id: "description", label: "Description & Details" },
    { id: "ingredients", label: "Materials & Composition" },
    { id: "application", label: "Care & Usage" },
    { id: "heritage", label: "Heritage & Story" },
  ];

  return (
    <div className="bg-[#f3f3ee]">
      {/* Sticky nav bar */}
      <div className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-screen-xl px-[5%] py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="group flex items-center gap-2 text-sm font-medium text-[#707072] hover:text-[#111111] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <Link
            href="/commonwealth-lab/cart"
            className="text-sm font-medium text-[#707072] hover:text-[#111111] transition-colors"
          >
            Cart
          </Link>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-[#f3f3ee]">
        <div className="mx-auto max-w-screen-xl px-[5%] py-12 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left: Product Gallery */}
            <div className="lg:col-span-2 sticky top-24 h-fit">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Info Sidebar */}
            <div className="flex flex-col h-fit sticky top-24">
              {/* Category kicker */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                {product.category}
              </p>

              {/* Product Title */}
              <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase leading-[0.9] tracking-tighter text-[#111111]">
                {product.name}
              </h1>

              {/* Price */}
              <p className="mt-4 text-2xl font-black tracking-tighter text-[#111111]">
                PKR {product.price.toLocaleString()}
              </p>

              {/* Short Description */}
              <p className="mt-4 pb-6 border-b border-[#E5E5E5] text-sm font-medium leading-relaxed text-[#707072]">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mt-6 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072] mb-1">
                  Availability
                </p>
                <p className="text-sm font-black tracking-tighter text-[#0f7a47]">In Stock</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072] mb-3">
                  Quantity
                </p>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 mb-3 ${
                  added
                    ? "bg-[#0f7a47] text-white"
                    : "bg-[#0f7a47] text-white hover:bg-[#1a9d5f]"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              {/* View Cart Link */}
              <Link
                href="/commonwealth-lab/cart"
                className="flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] hover:border-[#111111]/30 transition-colors"
              >
                View Cart
              </Link>

              {/* Trust badges */}
              <div className="mt-10 pt-6 border-t border-[#E5E5E5] space-y-3">
                <div>
                  <p className="text-xs font-black tracking-tighter text-[#111111]">Artisan Made</p>
                  <p className="text-xs font-medium text-[#707072]">Hand-crafted by skilled artisans</p>
                </div>
                <div>
                  <p className="text-xs font-black tracking-tighter text-[#111111]">Authentic Materials</p>
                  <p className="text-xs font-medium text-[#707072]">Premium, ethically sourced components</p>
                </div>
                <div>
                  <p className="text-xs font-black tracking-tighter text-[#111111]">Heritage Craft</p>
                  <p className="text-xs font-medium text-[#707072]">Traditional techniques preserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-[5%]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Details
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl mb-10">
              Product Information
            </h2>

            <div className="divide-y divide-[#E5E5E5]">
              {accordions.map((accordion) => (
                <div key={accordion.id} className="border-b border-[#E5E5E5] last:border-b-0">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === accordion.id ? null : accordion.id
                      )
                    }
                    className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[#0f7a47] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a47]/30"
                  >
                    <span className="text-sm font-black tracking-tight text-[#111111]">
                      {accordion.label}
                    </span>
                    <svg
                      className={`h-4 w-4 flex-shrink-0 text-[#707072] transition-transform duration-300 ${
                        expandedAccordion === accordion.id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      expandedAccordion === accordion.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-6">
                        {accordion.id === "description" && (
                          <div className="space-y-4">
                            <p className="text-sm font-medium leading-relaxed text-[#707072]">
                              {product.details || product.description}
                            </p>
                            {product.details && (
                              <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                                <p className="text-sm font-medium leading-relaxed text-[#707072]">
                                  {product.description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {accordion.id === "ingredients" && (
                          <div className="space-y-3">
                            {product.ingredients && product.ingredients.length > 0 ? (
                              product.ingredients.map((ingredient, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <span className="mt-0.5 font-black text-[#0f7a47]">•</span>
                                  <p className="text-sm font-medium text-[#707072]">{ingredient}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm font-medium text-[#707072]">No materials information available.</p>
                            )}
                          </div>
                        )}

                        {accordion.id === "application" && (
                          <div className="space-y-4">
                            <p className="text-sm font-medium leading-relaxed text-[#707072]">
                              {product.application || "Application guidelines not available."}
                            </p>
                            <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
                              <p className="text-xs font-medium italic leading-relaxed text-[#707072]">
                                For best results, follow care instructions and handle with care to preserve the artisan craftsmanship and longevity of this piece.
                              </p>
                            </div>
                          </div>
                        )}

                        {accordion.id === "heritage" && (
                          <div className="space-y-4">
                            <p className="text-sm font-medium leading-relaxed text-[#707072]">
                              {product.heritage || "Heritage information not available."}
                            </p>
                            <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-4 space-y-2">
                              <p className="text-xs font-black tracking-tighter text-[#111111]">Supporting Artisans</p>
                              <p className="text-xs font-medium leading-relaxed text-[#707072]">
                                By purchasing this product, you directly support artisan communities and help preserve traditional craftsmanship for future generations. Each purchase represents a commitment to ethical commerce and cultural preservation.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#f3f3ee] py-12 lg:py-24">
          <div className="mx-auto max-w-screen-xl px-[5%]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] mb-3">
              You May Also Like
            </p>
            <h2 className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl mb-10">
              Explore More
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
