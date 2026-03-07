"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/models/Product";
import { useCart } from "@/features/commonwealth-lab/context/CartContext";
import { ProductGallery } from "./ProductGallery";
import { QuantitySelector } from "./QuantitySelector";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10 text-xs text-neutral-400">
            <Link href="/commonwealth-lab" className="hover:text-neutral-700 transition-colors">
              Marketplace
            </Link>
            <span className="mx-2">/</span>
            <Link href="/commonwealth-lab/products" className="hover:text-neutral-700 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-600">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Info */}
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-bold text-neutral-900">
                ${product.price.toFixed(2)}
              </p>
              <p className="mt-6 leading-relaxed text-neutral-600">
                {product.description}
              </p>

              {/* Quantity + ATC */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`rounded-full px-10 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-700"
                  }`}
                >
                  {added ? "Added ✓" : "Add to Cart"}
                </button>
              </div>

              {/* Cart link */}
              <Link
                href="/commonwealth-lab/cart"
                className="mt-6 inline-flex items-center text-xs font-medium text-neutral-500 underline transition-colors hover:text-neutral-900"
              >
                View Cart →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-neutral-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-neutral-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
