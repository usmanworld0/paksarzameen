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
    <aside className="rounded-2xl border border-[#E5E5E5] bg-white p-5 self-start">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="font-medium text-[#707072]">Subtotal</dt>
          <dd className="font-black tracking-tighter text-[#111111]">
            PKR {subtotal.toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-medium text-[#707072]">Estimated Shipping</dt>
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

      <Link
        href={ctaHref}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}
