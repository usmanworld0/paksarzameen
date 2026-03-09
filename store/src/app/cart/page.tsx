"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-[72px] min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4">
            Your Cart
          </p>
          <h1 className="text-2xl font-light mb-3">Your cart is empty</h1>
          <p className="text-sm text-neutral-400 mb-8">
            Discover our collection and add some beautiful pieces.
          </p>
          <Link
            href="/products"
            className="inline-block border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.25em] uppercase px-8 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
          >
            Browse Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Page header */}
        <div className="py-12 px-4 sm:px-6 lg:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-2">
              Shopping
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
              Your Cart
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
            {/* Cart items */}
            <div className="space-y-0 divide-y divide-neutral-100">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.customizations)}`}
                  className="flex gap-4 py-6"
                >
                  {item.image && (
                    <div className="h-24 w-24 relative overflow-hidden flex-shrink-0 bg-[#f5f4f2]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm text-neutral-900 hover:text-[#0c2e1a] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-neutral-300 hover:text-neutral-900 transition-colors ml-2"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {item.customizations &&
                      Object.entries(item.customizations).map(([key, val]) => (
                        <p
                          key={key}
                          className="text-[10px] text-neutral-400 mt-0.5"
                        >
                          {key}: {val}
                        </p>
                      ))}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity selector — pill style */}
                      <div className="inline-flex items-center rounded-full border border-neutral-200">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900"
                          type="button"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900"
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-neutral-900">
                          {formatPrice(
                            (item.discountedPrice || item.price) * item.quantity
                          )}
                        </p>
                        {item.discountedPrice && (
                          <p className="text-[10px] text-neutral-400 line-through">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button
                  onClick={clearCart}
                  className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
                  type="button"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary — sticky aside */}
            <aside className="border border-neutral-200 p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-neutral-900">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="text-[#0c2e1a] text-xs">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between text-sm">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900">{formatPrice(subtotal())}</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-4 leading-relaxed">
                Contact us via WhatsApp to complete your order. We&apos;ll confirm
                availability and arrange delivery.
              </p>
              <a
                href={`https://wa.me/923001234567?text=${encodeURIComponent(
                  `Hi! I'd like to order from Commonwealth Lab:\n${items
                    .map(
                      (i) =>
                        `- ${i.name} x${i.quantity} (${formatPrice(i.discountedPrice || i.price)})`
                    )
                    .join("\n")}\n\nTotal: ${formatPrice(subtotal())}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#0c2e1a] text-white text-[11px] tracking-[0.25em] uppercase py-4 mt-4 hover:bg-[#0c2e1a]/90 transition-all"
              >
                Complete via WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
