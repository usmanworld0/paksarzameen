"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { getCartItemKey, useCartStore } from "@/store/cart";
import { getCartItemUnitPrice, getCartSubtotal } from "@/lib/cart-pricing";
import { getCustomizationTotal } from "@/lib/customizations";
import { formatRegionalPrice, getRegionBadgeLabel } from "@/lib/pricing";
import { useStoreRegion } from "@/hooks/useStoreRegion";

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

export function CustomizationBillingPanel() {
  const items = useCartStore((state) => state.items);
  const detectedRegion = useStoreRegion();
  const [billing, setBilling] = useState<BillingFormState>(initialBillingState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customizedItems = useMemo(
    () => items.filter((item) => (item.customizations?.length ?? 0) > 0),
    [items]
  );

  const region = useMemo(
    () => customizedItems[0]?.region || detectedRegion,
    [customizedItems, detectedRegion]
  );

  const baseSubtotal = useMemo(
    () =>
      customizedItems.reduce(
        (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
        0
      ),
    [customizedItems]
  );

  const optionsSubtotal = useMemo(
    () =>
      customizedItems.reduce(
        (sum, item) => sum + getCustomizationTotal(item) * item.quantity,
        0
      ),
    [customizedItems]
  );

  const subtotal = useMemo(() => getCartSubtotal(customizedItems), [customizedItems]);

  function updateBillingField(field: keyof BillingFormState, value: string) {
    setBilling((current) => ({ ...current, [field]: value }));
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (customizedItems.length === 0) {
      setSubmitError("Add at least one customized item before continuing.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: customizedItems,
          couponCode: null,
          billing,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to start custom order checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to start custom order checkout."
      );
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]">
        Custom Order Billing
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-neutral-900">
        Bill Customized Orders From This Page
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        This calculator uses customized cart items only, then opens Stripe checkout with
        full billing details.
      </p>

      {customizedItems.length === 0 ? (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          No customized items in cart yet. Configure a product first, then return here to bill it.
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Customized Items
              </h3>

              <div className="mt-4 space-y-4">
                {customizedItems.map((item) => (
                  <div key={getCartItemKey(item)} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">Qty {item.quantity}</p>
                        {item.customizations?.map((selection) => (
                          <p key={selection.key} className="mt-1 text-xs text-neutral-500">
                            {selection.groupLabel}: {selection.valueLabel} ({selection.priceAdjustment === 0 ? formatRegionalPrice(0, region) : `+${formatRegionalPrice(selection.priceAdjustment, region)}`})
                          </p>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatRegionalPrice(getCartItemUnitPrice(item) * item.quantity, region)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Billing Details
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-neutral-200 bg-neutral-50 p-6 lg:sticky lg:top-24">
            <h3 className="text-base font-semibold text-neutral-900">Custom Order Summary</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {getRegionBadgeLabel(region)}
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Base Subtotal</span>
                <span className="font-medium text-neutral-900">{formatRegionalPrice(baseSubtotal, region)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Customization Total</span>
                <span className="font-medium text-neutral-900">{formatRegionalPrice(optionsSubtotal, region)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                <span className="font-semibold text-neutral-900">Grand Total</span>
                <span className="font-semibold text-neutral-900">{formatRegionalPrice(subtotal, region)}</span>
              </div>
            </div>

            {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Customized Order"}
            </button>

            <Link
              href="/cart"
              className="mt-3 block text-center text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Review Full Cart
            </Link>
          </aside>
        </form>
      )}
    </section>
  );
}

function Field({
  className,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
}: {
  className?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#0c2e1a]/40"
      />
    </label>
  );
}
