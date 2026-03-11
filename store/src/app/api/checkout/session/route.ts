import { NextResponse } from "next/server";
import { z } from "zod";
import type { CartItem } from "@/types";
import { buildDiscountedStripeLineItems, getCheckoutPricing } from "@/lib/checkout";
import { detectRegionFromHeaders, isStoreRegion } from "@/lib/pricing";
import { getStripeClient, getStoreUrl, getStripeCurrency } from "@/lib/stripe";

export const runtime = "nodejs";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  discountedPrice: z.number().positive().optional(),
  image: z.string().optional().default(""),
  quantity: z.number().int().min(1),
  region: z.enum(["PAK", "US", "UK"]).optional(),
  customizations: z.record(z.string()).optional(),
});

const checkoutSessionSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Your cart is empty."),
  couponCode: z.string().optional().nullable(),
  billing: z.object({
    firstName: z.string().min(2, "First name is required."),
    lastName: z.string().min(2, "Last name is required."),
    email: z.string().email("Valid email is required."),
    phone: z.string().min(7, "Phone number is required."),
    addressLine1: z.string().min(5, "Address is required."),
    addressLine2: z.string().optional().nullable(),
    city: z.string().min(2, "City is required."),
    postalCode: z.string().min(3, "Postal code is required."),
    country: z.string().length(2).default("PK"),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSessionSchema.safeParse(body);

    if (!parsed.success) {
      const fieldError = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .find(Boolean);

      return NextResponse.json(
        { error: fieldError || "Please complete the billing details." },
        { status: 400 }
      );
    }

    const { items, couponCode, billing } = parsed.data;
    const pricing = getCheckoutPricing(items as CartItem[], couponCode);
    const regionFromItems = items[0]?.region;
    const region =
      regionFromItems && isStoreRegion(regionFromItems)
        ? regionFromItems
        : detectRegionFromHeaders(request.headers);

    if (pricing.couponError) {
      return NextResponse.json({ error: pricing.couponError }, { status: 400 });
    }

    const stripe = getStripeClient();
    const origin = getStoreUrl();
    const lineItems = buildDiscountedStripeLineItems(items as CartItem[], couponCode, region);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: getStripeCurrency(region),
      billing_address_collection: "required",
      customer_email: billing.email,
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      line_items: lineItems,
      metadata: {
        customerName: `${billing.firstName} ${billing.lastName}`,
        customerEmail: billing.email,
        phone: billing.phone,
        addressLine1: billing.addressLine1,
        addressLine2: billing.addressLine2 ?? "",
        city: billing.city,
        postalCode: billing.postalCode,
        country: billing.country,
        region,
        couponCode: pricing.appliedCouponCode ?? "",
        subtotal: String(pricing.subtotal),
        discountAmount: String(pricing.discountAmount),
        total: String(pricing.total),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start Stripe checkout.",
      },
      { status: 500 }
    );
  }
}