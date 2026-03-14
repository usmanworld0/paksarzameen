import { NextResponse } from "next/server";
import { z } from "zod";
import type { CartItem } from "@/types";
import { getCheckoutPricing } from "@/lib/checkout";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  discountedPrice: z.number().positive().optional(),
  image: z.string().optional().default(""),
  quantity: z.number().int().min(1),
  region: z.enum(["PAK", "US", "UK"]).optional(),
  customizations: z
    .array(
      z.object({
        key: z.string().min(1),
        optionName: z.string().min(1),
        groupLabel: z.string().min(1),
        value: z.string().min(1),
        valueLabel: z.string().min(1),
        priceAdjustment: z.number(),
      })
    )
    .optional(),
});

const couponValidationSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Your cart is empty."),
  couponCode: z.string().optional().nullable(),
  region: z.enum(["PAK", "US", "UK"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = couponValidationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Unable to validate coupon for this cart." },
        { status: 400 }
      );
    }

    const { items, couponCode, region } = parsed.data;
    const pricing = await getCheckoutPricing(
      items as CartItem[],
      couponCode,
      region ?? items[0]?.region ?? "PAK"
    );

    if (pricing.couponError) {
      return NextResponse.json({ error: pricing.couponError }, { status: 400 });
    }

    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to validate coupon.",
      },
      { status: 500 }
    );
  }
}