"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCartStore } from "@/store/cart";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#fffaf6] px-6 pb-20 pt-[108px]">
        <div className="store-card mx-auto max-w-2xl rounded-[28px] px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-700" />
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]">
            Payment Received
          </p>
          <h1 className="mt-3 text-5xl leading-[0.92] text-neutral-900">Thank you for your order</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Your Stripe payment was completed successfully. Our team will review the billing details and follow up with fulfillment updates.
          </p>
          {sessionId && (
            <p className="mt-4 text-xs text-neutral-400">Session ID: {sessionId}</p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/products" className="store-button-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="store-button-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}