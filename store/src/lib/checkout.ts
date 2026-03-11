import type { CartItem } from "@/types";
import { calculateCouponDiscount } from "./coupons";
import { getCurrencyForRegion, type StoreRegion } from "./pricing";

export type CheckoutPricing = {
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedCouponCode: string | null;
  couponError: string | null;
};

type FlattenedCartUnit = {
  name: string;
  image: string;
  amount: number;
};

export function getCartItemUnitPrice(item: CartItem) {
  return item.discountedPrice ?? item.price;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + getCartItemUnitPrice(item) * item.quantity,
    0
  );
}

export function getCheckoutPricing(items: CartItem[], couponCode?: string | null): CheckoutPricing {
  const subtotal = getCartSubtotal(items);
  const { coupon, discountAmount, error } = calculateCouponDiscount(
    subtotal,
    couponCode
  );
  const total = Math.max(subtotal - discountAmount, 0);

  return {
    subtotal,
    discountAmount,
    total,
    appliedCouponCode: coupon?.code ?? null,
    couponError: error,
  };
}

function flattenCartItems(items: CartItem[]): FlattenedCartUnit[] {
  return items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      name: item.name,
      image: item.image,
      amount: getCartItemUnitPrice(item),
    }))
  );
}

export function buildDiscountedStripeLineItems(
  items: CartItem[],
  couponCode?: string | null,
  region: StoreRegion = "PAK"
) {
  const units = flattenCartItems(items);
  const { subtotal, discountAmount, total } = getCheckoutPricing(items, couponCode);
  const currency = getCurrencyForRegion(region).toLowerCase();

  if (subtotal <= 0 || total <= 0) {
    throw new Error("Your cart total must be greater than zero.");
  }

  let remainingDiscount = discountAmount;

  return units.map((unit, index) => {
    const isLastUnit = index === units.length - 1;
    const proportionalDiscount = isLastUnit
      ? remainingDiscount
      : Math.min(
          remainingDiscount,
          Math.round((discountAmount * unit.amount) / subtotal)
        );

    remainingDiscount -= proportionalDiscount;

    const finalUnitAmount = Math.max(unit.amount - proportionalDiscount, 1);

    return {
      price_data: {
        currency,
        product_data: {
          name: unit.name,
          images: unit.image ? [unit.image] : undefined,
        },
        unit_amount: Math.max(Math.round(finalUnitAmount * 100), 50),
      },
      quantity: 1,
    };
  });
}