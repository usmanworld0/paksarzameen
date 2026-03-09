"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container-wide py-20 min-h-[60vh] flex flex-col items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-neutral-200 mb-6" />
          <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover our collection and add some beautiful pieces.
          </p>
          <Button variant="primary" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-wide py-10">
        <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${JSON.stringify(item.customizations)}`}
                className="flex gap-4 bg-white p-4 rounded-sm border"
              >
                {item.image && (
                  <div className="h-24 w-24 relative rounded-sm overflow-hidden flex-shrink-0">
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
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:text-brand-green transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  {item.customizations &&
                    Object.entries(item.customizations).map(([key, val]) => (
                      <p
                        key={key}
                        className="text-xs text-muted-foreground mt-0.5"
                      >
                        {key}: {val}
                      </p>
                    ))}

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border rounded-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-neutral-50"
                        type="button"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-neutral-50"
                        type="button"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(
                      (item.discountedPrice || item.price) * item.quantity
                    )}
                  </p>
                  {item.discountedPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
              type="button"
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-sm border h-fit sticky top-4">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-brand-green">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Contact us via WhatsApp to complete your order. We&apos;ll confirm
              availability and arrange delivery.
            </p>
            <Button variant="primary" className="w-full mt-4" asChild>
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
              >
                Complete via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
