"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/features/commonwealth-lab/context/CartContext";

const PAYMENT_METHODS = ["Credit Card", "JazzCash", "Easypaisa", "Bank Transfer"];

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const shipping = 12;
  const total = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

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
            <Link
              href="/commonwealth-lab/cart"
              className="text-[#707072] transition hover:text-[#111111]"
            >
              Cart
            </Link>
            <span className="text-[#E5E5E5]">/</span>
            <span className="text-[#111111]">Checkout</span>
          </nav>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
            Commonwealth Lab
          </p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Checkout
          </h1>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-8">
        <div className="mx-auto max-w-screen-xl">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <p className="text-sm font-medium text-[#707072]">
                No items in your cart to check out.
              </p>
              <Link
                href="/commonwealth-lab/products"
                className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Form */}
              <form
                className="lg:col-span-2 space-y-8"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Contact */}
                <fieldset className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                  <legend className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                    Contact Information
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                        Full Name
                      </span>
                      <input
                        type="text"
                        className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                        Email Address
                      </span>
                      <input
                        type="email"
                        className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>
                </fieldset>

                {/* Shipping */}
                <fieldset className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                  <legend className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                    Shipping Address
                  </legend>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                        Street Address
                      </span>
                      <input
                        type="text"
                        className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                        placeholder="123 Main Street"
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                          City
                        </span>
                        <input
                          type="text"
                          className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                          placeholder="City"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                          Country
                        </span>
                        <input
                          type="text"
                          className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                          placeholder="Pakistan"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
                          Postal Code
                        </span>
                        <input
                          type="text"
                          className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30 focus:bg-white"
                          placeholder="54000"
                        />
                      </label>
                    </div>
                  </div>
                </fieldset>

                {/* Payment */}
                <fieldset className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                  <legend className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                    Payment Method
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-xl border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                          paymentMethod === method
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#E5E5E5] bg-white text-[#707072] hover:border-[#111111]/30 hover:text-[#111111]"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Submit */}
                <button
                  type="submit"
                  className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50 sm:w-auto w-full"
                >
                  Place Order
                </button>
              </form>

              {/* Order Summary */}
              <aside className="rounded-2xl border border-[#E5E5E5] bg-white p-5 self-start">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                  Order Summary
                </h2>

                <ul className="mt-6 divide-y divide-[#E5E5E5]">
                  {items.map((item) => (
                    <li
                      key={item.product.id}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-sm font-medium text-[#707072]">
                        {item.product.name}{" "}
                        <span className="text-[#707072]">×{item.quantity}</span>
                      </span>
                      <span className="text-sm font-black tracking-tighter text-[#111111]">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-2 border-t border-[#E5E5E5] pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-[#707072]">Subtotal</dt>
                    <dd className="font-black tracking-tighter text-[#111111]">
                      PKR {subtotal.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-[#707072]">Shipping</dt>
                    <dd className="font-black tracking-tighter text-[#111111]">
                      PKR {shipping.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E5E5] pt-4 mt-4">
                    <dt className="text-sm font-black tracking-tight text-[#111111]">Total</dt>
                    <dd className="text-xl font-black tracking-tighter text-[#111111]">
                      PKR {total.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
