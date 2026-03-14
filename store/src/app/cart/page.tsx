"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { getCartItemKey, useCartStore } from "@/store/cart";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { formatRegionalPrice, getRegionBadgeLabel } from "@/lib/pricing";
import { useStoreRegion } from "@/hooks/useStoreRegion";
import { getCartItemUnitPrice } from "@/lib/cart-pricing";
import { getCustomizationTotal } from "@/lib/customizations";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();
  const detectedRegion = useStoreRegion();
  const region = useMemo(
    () => items[0]?.region || detectedRegion,
    [items, detectedRegion]
  );

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
                (() => {
                  const itemKey = getCartItemKey(item);
                  return (
                <article
                  key={itemKey}
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
                        onClick={() => removeItem(itemKey)}
                        className="text-neutral-400 hover:text-neutral-900 transition-colors ml-4"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {item.customizations &&
                      item.customizations.map((selection) => (
                        <p
                          key={selection.key}
                          className="text-xs text-neutral-500 mt-1"
                        >
                          {selection.groupLabel}: {selection.valueLabel} ({selection.priceAdjustment === 0 ? formatRegionalPrice(0, region) : `+${formatRegionalPrice(selection.priceAdjustment, region)}`})
                        </p>
                      ))}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity selector — rounded pill */}
                      <div className="inline-flex items-center rounded-full border border-neutral-300">
                        <button
                          onClick={() =>
                            updateQuantity(itemKey, item.quantity - 1)
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
                            updateQuantity(itemKey, item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">
                          {formatRegionalPrice(getCartItemUnitPrice(item) * item.quantity, region)}
                        </p>
                        {item.discountedPrice && (
                          <p className="text-xs text-neutral-400 line-through mt-0.5">
                            {formatRegionalPrice(item.price * item.quantity, region)}
                          </p>
                        )}
                        {getCustomizationTotal(item) > 0 && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Includes options +{formatRegionalPrice(getCustomizationTotal(item) * item.quantity, region)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
                  );
                })()
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
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {getRegionBadgeLabel(region)}
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatRegionalPrice(subtotal(), region)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-500 text-xs">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Coupon Code</span>
                  <span className="text-neutral-500 text-xs">Apply on billing page</span>
                </div>
              </div>
              <div className="border-t border-neutral-300 mt-6 pt-6 flex justify-between text-sm">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="font-bold text-neutral-900">{formatRegionalPrice(subtotal(), region)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-6 leading-relaxed">
                Continue to billing to enter your details, manually enter a coupon code if you have one, and complete your advance payment securely by card through Stripe.
              </p>
              <Link
                href="/checkout"
                className="block w-full text-center rounded-full bg-neutral-900 text-white text-sm font-medium py-4 mt-6 hover:bg-neutral-700 transition-colors"
              >
                Proceed to Billing
              </Link>
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
