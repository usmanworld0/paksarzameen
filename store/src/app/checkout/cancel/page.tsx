import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function CheckoutCancelPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] px-6 pt-[108px] pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white px-8 py-12 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]">
            Checkout Interrupted
          </p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-900">Payment was not completed</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Your cart is still saved. You can return to billing, review your coupon code, and try the card payment again when ready.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/checkout" className="rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700">
              Return to Billing
            </Link>
            <Link href="/cart" className="rounded-full border border-neutral-300 px-8 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900">
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}