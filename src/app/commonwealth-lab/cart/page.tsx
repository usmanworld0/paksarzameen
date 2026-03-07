"use client";

import Link from "next/link";
import { useCart } from "@/features/commonwealth-lab/context/CartContext";
import { CartItem } from "@/features/commonwealth-lab/components/CartItem";
import { CartSummary } from "@/features/commonwealth-lab/components/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs text-neutral-400">
          <Link
            href="/commonwealth-lab"
            className="transition-colors hover:text-neutral-700"
          >
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-600">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <p className="text-lg text-neutral-400">Your cart is empty.</p>
            <Link
              href="/commonwealth-lab/products"
              className="rounded-full bg-neutral-900 px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Summary */}
            <CartSummary subtotal={subtotal} />
          </div>
        )}
      </div>
    </section>
  );
}
