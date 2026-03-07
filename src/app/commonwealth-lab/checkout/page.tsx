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
          <Link
            href="/commonwealth-lab/cart"
            className="transition-colors hover:text-neutral-700"
          >
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-600">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <p className="text-lg text-neutral-400">
              No items in your cart to check out.
            </p>
            <Link
              href="/commonwealth-lab/products"
              className="rounded-full bg-neutral-900 px-10 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Form */}
            <form
              className="lg:col-span-2 space-y-8"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Contact */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  Contact Information
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-neutral-600">
                      Full Name
                    </span>
                    <input
                      type="text"
                      className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-neutral-600">
                      Email Address
                    </span>
                    <input
                      type="email"
                      className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
              </fieldset>

              {/* Shipping */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  Shipping Address
                </legend>
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-neutral-600">
                      Street Address
                    </span>
                    <input
                      type="text"
                      className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                      placeholder="123 Main Street"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-neutral-600">
                        City
                      </span>
                      <input
                        type="text"
                        className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                        placeholder="City"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-neutral-600">
                        Country
                      </span>
                      <input
                        type="text"
                        className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                        placeholder="Pakistan"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-neutral-600">
                        Postal Code
                      </span>
                      <input
                        type="text"
                        className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                        placeholder="54000"
                      />
                    </label>
                  </div>
                </div>
              </fieldset>

              {/* Payment */}
              <fieldset>
                <legend className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  Payment Method
                </legend>
                <div className="flex flex-wrap gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                        paymentMethod === method
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900"
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
                className="w-full rounded-full bg-neutral-900 px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:bg-neutral-700 sm:w-auto"
              >
                Place Order
              </button>
            </form>

            {/* Order Summary */}
            <aside className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 self-start">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                Order Summary
              </h2>

              <ul className="mt-6 divide-y divide-neutral-100">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="text-neutral-700">
                      {item.product.name}{" "}
                      <span className="text-neutral-400">×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-neutral-900">
                    ${subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-neutral-900">
                    ${shipping.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-bold text-neutral-900">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
