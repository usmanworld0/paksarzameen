"use client";

import Link from "next/link";
import { useCart } from "@/features/commonwealth-lab/context/CartContext";
import { CartItem } from "@/features/commonwealth-lab/components/CartItem";
import { CartSummary } from "@/features/commonwealth-lab/components/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="bg-[#f3f3ee]">
      {/* Page Header */}
      <header className="border-b border-[#E5E5E5] bg-white px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
            <Link
              href="/commonwealth-lab"
              className="text-[#707072] transition hover:text-[#111111]"
            >
              Marketplace
            </Link>
            <span className="text-[#E5E5E5]">/</span>
            <span className="text-[#111111]">Cart</span>
          </nav>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
            Commonwealth Lab
          </p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Your Cart
          </h1>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-8">
        <div className="mx-auto max-w-screen-xl">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <p className="text-sm font-medium text-[#707072]">Your cart is empty.</p>
              <Link
                href="/commonwealth-lab/products"
                className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="lg:col-span-2 space-y-0">
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
      </div>
    </div>
  );
}
