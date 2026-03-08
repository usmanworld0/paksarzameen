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
    <>
      {/* Hero Section with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="group flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <Link
            href="/commonwealth-lab/cart"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Cart
          </Link>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left: Product Gallery (larger) */}
            <div className="lg:col-span-2 sticky top-24 h-fit">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Info Sidebar */}
            <div className="flex flex-col h-fit sticky top-24">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-600 border border-neutral-300 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-bold text-neutral-900 mb-6">
                ${product.price.toFixed(2)} USD
              </p>

              {/* Short Description */}
              <p className="text-neutral-600 text-sm leading-relaxed mb-8 pb-8 border-b border-neutral-200">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Availability</p>
                <p className="text-sm text-green-700 font-medium">In Stock</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3">Quantity</p>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 font-semibold uppercase tracking-widest text-sm transition-all duration-300 mb-4 ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-neutral-900 text-white hover:bg-neutral-700"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              {/* View Cart Link */}
              <Link
                href="/commonwealth-lab/cart"
                className="text-center py-3 text-sm font-medium text-neutral-600 border border-neutral-300 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
              >
                View Cart
              </Link>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-neutral-200 space-y-4 text-xs">
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Artisan Made</p>
                  <p className="text-neutral-600">Hand-crafted by skilled artisans</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Authentic Materials</p>
                  <p className="text-neutral-600">Premium, ethically sourced components</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-1">Heritage Craft</p>
                  <p className="text-neutral-600">Traditional techniques preserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="bg-neutral-50 py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-neutral-900 mb-12">
              Product Information
            </h2>

            {/* Accordions */}
            <div className="space-y-4">
              {accordions.map((accordion) => (
                <div
                  key={accordion.id}
                  className="border border-neutral-300 bg-white"
                >
                  <button
                    onClick={() =>
                      setExpandedAccordion(
                        expandedAccordion === accordion.id ? null : accordion.id
                      )
                    }
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-medium text-neutral-900 text-left uppercase text-sm tracking-wider">
                      {accordion.label}
                    </span>
                    <svg
                      className={`h-5 w-5 text-neutral-600 transition-transform duration-300 ${
                        expandedAccordion === accordion.id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  {expandedAccordion === accordion.id && (
                    <div className="px-6 py-6 border-t border-neutral-200 bg-white animate-fadeIn">
                      {accordion.id === "description" && (
                        <div className="space-y-4">
                          <p className="text-neutral-600 text-sm leading-relaxed">
                            {product.details || product.description}
                          </p>
                          {product.details && (
                            <div className="mt-6 pt-6 border-t border-neutral-200">
                              <p className="text-neutral-600 text-sm leading-relaxed">
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
                                <span className="text-neutral-900 font-bold mt-0.5">•</span>
                                <p className="text-neutral-600 text-sm">{ingredient}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-neutral-500 text-sm">No materials information available.</p>
                          )}
                        </div>
                      )}

                      {accordion.id === "application" && (
                        <div className="space-y-4">
                          <p className="text-neutral-600 text-sm leading-relaxed">
                            {product.application || "Application guidelines not available."}
                          </p>
                          <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded">
                            <p className="text-xs text-neutral-600 italic">
                              For best results, follow care instructions and handle with care to preserve the artisan craftsmanship and longevity of this piece.
                            </p>
                          </div>
                        </div>
                      )}

                      {accordion.id === "heritage" && (
                        <div className="space-y-4">
                          <p className="text-neutral-600 text-sm leading-relaxed">
                            {product.heritage || "Heritage information not available."}
                          </p>
                          <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded space-y-3">
                            <p className="text-sm font-semibold text-neutral-900">Supporting Artisans</p>
                            <p className="text-xs text-neutral-600">
                              By purchasing this product, you directly support artisan communities and help preserve traditional craftsmanship for future generations. Each purchase represents a commitment to ethical commerce and cultural preservation.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-12 lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-neutral-900 mb-12 text-center">
              Explore More
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
