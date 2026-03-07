"use client";

import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  ctaHref?: string;
  ctaLabel?: string;
}

export function CartSummary({
  subtotal,
  shipping = 12,
  ctaHref = "/commonwealth-lab/checkout",
  ctaLabel = "Proceed to Checkout",
}: CartSummaryProps) {
  const total = subtotal + shipping;

  return (
    <aside className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between text-neutral-600">
          <dt>Subtotal</dt>
          <dd className="font-medium text-neutral-900">
            ${subtotal.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between text-neutral-600">
          <dt>Estimated Shipping</dt>
          <dd className="font-medium text-neutral-900">
            ${shipping.toFixed(2)}
          </dd>
        </div>
        <div className="border-t border-neutral-200 pt-3">
          <div className="flex justify-between text-base font-bold text-neutral-900">
            <dt>Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </div>
      </dl>

      <Link
        href={ctaHref}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:bg-neutral-700"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}
