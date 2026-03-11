import "server-only";

import type { Coupon } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatRegionalPrice, type StoreRegion } from "./pricing";

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export async function getCouponByCode(code?: string | null) {
  if (!code || !code.trim()) {
    return null;
  }

  const normalizedCode = normalizeCouponCode(code);
  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  return coupon?.active ? coupon : null;
}

export async function validateCouponCode(
  subtotal: number,
  code?: string | null,
  region: StoreRegion = "PAK"
) {
  if (!code || !code.trim()) {
    return { coupon: null, error: null };
  }

  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { coupon: null, error: "Invalid coupon code." };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      coupon: null,
      error: `This coupon requires a minimum order of ${formatRegionalPrice(coupon.minSubtotal, region)}.`,
    };
  }

  return { coupon, error: null };
}

export async function calculateCouponDiscount(
  subtotal: number,
  code?: string | null,
  region: StoreRegion = "PAK"
): Promise<{
  coupon: Coupon | null;
  discountAmount: number;
  error: string | null;
}> {
  const { coupon, error } = await validateCouponCode(subtotal, code, region);

  if (!coupon) {
    return {
      coupon: null,
      discountAmount: 0,
      error,
    };
  }

  return {
    coupon,
    discountAmount: Math.round(subtotal * (coupon.discountPercent / 100)),
    error: null,
  };
}