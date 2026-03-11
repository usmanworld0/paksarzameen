"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCartItemKey, useCartStore } from "@/store/cart";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { COUPON_CONFIGS } from "@/lib/coupons";
import { getCheckoutPricing } from "@/lib/checkout";
import { formatRegionalPrice, getRegionBadgeLabel } from "@/lib/pricing";
import { useStoreRegion } from "@/hooks/useStoreRegion";
import { Loader2, CreditCard, Tag } from "lucide-react";

type BillingFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
};

const initialBillingState: BillingFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "PK",
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const detectedRegion = useStoreRegion();
  const region = useMemo(
    () => items[0]?.region || detectedRegion,
    [items, detectedRegion]
  );
  const [billing, setBilling] = useState<BillingFormState>(initialBillingState);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pricing = useMemo(
    () => getCheckoutPricing(items, appliedCouponCode),
    [items, appliedCouponCode]
  );

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] px-6 pt-[96px] pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-neutral-900">Billing</h1>
            <p className="mt-3 text-sm text-neutral-500">
              Your cart is empty. Add products before moving to billing.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  function updateBillingField(field: keyof BillingFormState, value: string) {
    setBilling((current) => ({ ...current, [field]: value }));
  }

  function applyCoupon() {
    const nextPricing = getCheckoutPricing(items, couponInput);

    if (nextPricing.couponError) {
      setCouponError(nextPricing.couponError);
      setCouponMessage(null);
      setAppliedCouponCode(null);
      return;
    }

    setAppliedCouponCode(nextPricing.appliedCouponCode);
    setCouponError(null);
    setCouponMessage(
      nextPricing.appliedCouponCode
        ? `${nextPricing.appliedCouponCode} applied successfully.`
        : "Coupon removed."
    );
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode: appliedCouponCode,
          billing,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to start secure card checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to start secure card checkout."
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <nav className="mx-auto max-w-7xl px-6 pt-8 pb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-neutral-900 transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-neutral-700">Billing</span>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 pb-24">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]">
              Secure Checkout
            </p>
            <h1 className="mt-3 text-3xl font-bold text-neutral-900">Billing Details</h1>
            <p className="mt-3 text-sm text-neutral-500">
              Complete your billing information, apply a coupon if you have one, and continue to Stripe for secure card payment.
            </p>
          </div>

          <form onSubmit={handleCheckout} className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#0c2e1a]" />
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Billing Information</h2>
                    <p className="text-sm text-neutral-500">Used to prepare your Stripe payment session.</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First Name" value={billing.firstName} onChange={(value) => updateBillingField("firstName", value)} required />
                  <Field label="Last Name" value={billing.lastName} onChange={(value) => updateBillingField("lastName", value)} required />
                  <Field label="Email" type="email" value={billing.email} onChange={(value) => updateBillingField("email", value)} required />
                  <Field label="Phone" value={billing.phone} onChange={(value) => updateBillingField("phone", value)} required />
                  <Field className="sm:col-span-2" label="Address Line 1" value={billing.addressLine1} onChange={(value) => updateBillingField("addressLine1", value)} required />
                  <Field className="sm:col-span-2" label="Address Line 2" value={billing.addressLine2} onChange={(value) => updateBillingField("addressLine2", value)} />
                  <Field label="City" value={billing.city} onChange={(value) => updateBillingField("city", value)} required />
                  <Field label="Postal Code" value={billing.postalCode} onChange={(value) => updateBillingField("postalCode", value)} required />
                  <Field label="Country Code" value={billing.country} onChange={(value) => updateBillingField("country", value.toUpperCase())} required maxLength={2} />
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-[#0c2e1a]" />
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Coupon Code</h2>
                    <p className="text-sm text-neutral-500">Apply an active coupon before you continue to Stripe.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="h-12 flex-1 rounded-xl border border-neutral-200 px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-[#0c2e1a]/40"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="h-12 rounded-xl border border-neutral-900 px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                  >
                    Apply Coupon
                  </button>
                </div>

                {(couponMessage || couponError) && (
                  <p className={`mt-3 text-sm ${couponError ? "text-red-600" : "text-green-700"}`}>
                    {couponError || couponMessage}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {COUPON_CONFIGS.filter((coupon) => coupon.active).map((coupon) => (
                    <button
                      key={coupon.code}
                      type="button"
                      onClick={() => setCouponInput(coupon.code)}
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-8 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-neutral-900">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={getCartItemKey(item)} className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium text-neutral-900">{item.name}</p>
                      <p className="text-neutral-500">Qty {item.quantity}</p>
                    </div>
                    <p className="font-medium text-neutral-900">
                      {formatRegionalPrice((item.discountedPrice ?? item.price) * item.quantity, region)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Detected Region</span>
                  <span className="font-medium text-neutral-900">{getRegionBadgeLabel(region)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatRegionalPrice(pricing.subtotal, region)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Coupon Discount</span>
                  <span className="font-medium text-green-700">-{formatRegionalPrice(pricing.discountAmount, region)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-4 text-base">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-semibold text-neutral-900">{formatRegionalPrice(pricing.total, region)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#0c2e1a]/10 bg-white px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0c2e1a]">
                  Advance Payment Method
                </p>
                <p className="mt-2 text-sm text-neutral-700">Credit / Debit Card</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  Your payment is processed securely through Stripe Checkout using the detected regional currency. Only card payments are enabled in this flow.
                </p>
              </div>

              {submitError && (
                <p className="mt-5 text-sm text-red-600">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue to Stripe"}
              </button>

              <Link
                href="/cart"
                className="mt-4 block text-center text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Back to Cart
              </Link>
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
}) {
  return (
    <label className={`space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-[#0c2e1a]/40"
      />
    </label>
  );
}