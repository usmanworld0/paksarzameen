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
        <main className="pt-[72px] min-h-[60vh] flex flex-col items-center justify-center px-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">Your Cart</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Your cart is empty. Discover our collection and add something beautiful.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-medium px-8 py-3 hover:bg-neutral-700 transition-colors"
          >
            Continue Shopping
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
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-6 pt-8 pb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-700">Cart</span>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 pb-24">
          <h1 className="text-3xl font-bold text-neutral-900 mb-12">Your Cart</h1>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            {/* Cart items */}
            <div className="divide-y divide-neutral-200">
              {items.map((item) => (
                <article
                  key={`${item.productId}-${JSON.stringify(item.customizations)}`}
                  className="flex gap-6 py-8 first:pt-0"
                >
                  {item.image && (
                    <Link href={`/products/${item.slug}`} className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-neutral-400 hover:text-neutral-900 transition-colors ml-4"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {item.customizations &&
                      Object.entries(item.customizations).map(([key, val]) => (
                        <p
                          key={key}
                          className="text-xs text-neutral-500 mt-1"
                        >
                          {key}: {val}
                        </p>
                      ))}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity selector — rounded pill */}
                      <div className="inline-flex items-center rounded-full border border-neutral-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                          type="button"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm min-w-[2rem] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">
                          {formatPrice(
                            (item.discountedPrice || item.price) * item.quantity
                          )}
                        </p>
                        {item.discountedPrice && (
                          <p className="text-xs text-neutral-400 line-through mt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="pt-6">
                <button
                  onClick={clearCart}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  type="button"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary — sticky aside */}
            <aside className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-neutral-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-500 text-xs">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-neutral-300 mt-6 pt-6 flex justify-between text-sm">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="font-bold text-neutral-900">{formatPrice(subtotal())}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-6 leading-relaxed">
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
                className="block w-full text-center rounded-full bg-neutral-900 text-white text-sm font-medium py-4 mt-6 hover:bg-neutral-700 transition-colors"
              >
                Complete via WhatsApp
              </a>
              <Link
                href="/products"
                className="block w-full text-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors mt-4 py-2"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
