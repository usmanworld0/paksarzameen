"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCartItemKey, useCartStore } from "@/store/cart";
import { Navbar } from "@/components/storefront/Navbar";
import { formatRegionalPrice, getRegionBadgeLabel } from "@/lib/pricing";
import { useStoreRegion } from "@/hooks/useStoreRegion";
import { getCartItemUnitPrice } from "@/lib/cart-pricing";
import { getCustomizationTotal } from "@/lib/customizations";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const router = useRouter();
  const detectedRegion = useStoreRegion();
  const region = useMemo(() => items[0]?.region || detectedRegion, [items, detectedRegion]);
  const total = subtotal();

  function closeCart() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/products");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f7f5] pt-[72px]">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-4xl items-center justify-center px-6 text-center">
          <div className="opacity-35">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">Paksarzameen Store</p>
            <h1 className="mt-4 text-4xl tracking-[-0.06em] text-neutral-950">Your selected pieces</h1>
          </div>
        </div>
      </main>

      <button
        type="button"
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/70"
        aria-label="Close cart"
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-[-18px_0_50px_rgba(0,0,0,0.18)]">
        <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-6">
          <h1 className="text-lg font-medium uppercase tracking-[-0.03em] text-neutral-950">Your Cart <sup className="text-[10px]">{items.length}</sup></h1>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-9 w-9 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-950 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-sm text-neutral-500">Your cart is empty.</p>
            <Link href="/products" className="mt-6 bg-neutral-950 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b-2 border-emerald-700 px-5 py-3 sm:px-6">
              <p className="text-xs text-emerald-700">? Your order is eligible for secure checkout.</p>
            </div>

            <div className="border-b border-black/10 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-950">{formatRegionalPrice(total, region)}</span>
              </div>
              <details className="group mt-4 border-t border-black/8 pt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-neutral-700">
                  Shipping &amp; Returns <span className="transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pt-3 text-xs leading-5 text-neutral-500">Shipping charges and delivery options are confirmed at checkout. Returns follow the Store policy.</p>
              </details>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-6 scrollbar-thin">
              {items.map((item) => {
                const itemKey = getCartItemKey(item);
                const itemTotal = getCartItemUnitPrice(item) * item.quantity;

                return (
                  <article key={itemKey} className="border-b border-black/10 py-6">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <Link href={`/products/${item.slug}`} className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-950 transition-colors hover:text-neutral-500">
                          {item.name}
                        </Link>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-neutral-500">{getRegionBadgeLabel(item.region || region)}</p>
                        {item.customizations?.map((selection) => (
                          <p key={selection.key} className="mt-1 text-xs text-neutral-500">{selection.groupLabel}: {selection.valueLabel}</p>
                        ))}
                      </div>
                      <p className="shrink-0 text-sm font-medium text-neutral-950">{formatRegionalPrice(itemTotal, region)}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <button type="button" onClick={() => updateQuantity(itemKey, item.quantity - 1)} className="text-neutral-500 transition-colors hover:text-neutral-950" aria-label={`Decrease ${item.name} quantity`}><Minus className="h-3.5 w-3.5" /></button>
                        <span className="min-w-3 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(itemKey, item.quantity + 1)} className="text-neutral-500 transition-colors hover:text-neutral-950" aria-label={`Increase ${item.name} quantity`}><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button type="button" onClick={() => removeItem(itemKey)} className="text-neutral-400 transition-colors hover:text-neutral-950" aria-label={`Remove ${item.name}`}><X className="h-4 w-4" /></button>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="border-t border-black/10 bg-white px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between text-sm font-medium uppercase tracking-[0.08em] text-neutral-950">
                <span>Total</span>
                <span>{formatRegionalPrice(total, region)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">International transaction charges may apply depending on your card issuer.</p>
              <Link href="/checkout" className="mt-5 flex h-12 w-full items-center justify-center bg-neutral-950 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700">
                Secure checkout
              </Link>
              <button type="button" onClick={clearCart} className="mt-4 block w-full text-center text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-950">
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}