export type CouponConfig = {
  code: string;
  discountPercent: number;
  description: string;
  minSubtotal?: number;
  active: boolean;
};

export const COUPON_CONFIGS: CouponConfig[] = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    description: "10% off your first Commonwealth Lab order.",
    minSubtotal: 5000,
    active: true,
  },
  {
    code: "ARTISAN15",
    discountPercent: 15,
    description: "15% off artisan collections above PKR 12,000.",
    minSubtotal: 12000,
    active: true,
  },
];

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export function getCouponByCode(code?: string | null) {
  if (!code) return null;

  const normalizedCode = normalizeCouponCode(code);
  return (
    COUPON_CONFIGS.find(
      (coupon) => coupon.active && coupon.code === normalizedCode
    ) ?? null
  );
}

export function validateCouponCode(subtotal: number, code?: string | null) {
  if (!code || !code.trim()) {
    return { coupon: null, error: null };
  }

  const coupon = getCouponByCode(code);

  if (!coupon) {
    return { coupon: null, error: "Invalid coupon code." };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      coupon: null,
      error: `This coupon requires a minimum order of PKR ${coupon.minSubtotal.toLocaleString("en-PK")}.`,
    };
  }

  return { coupon, error: null };
}

export function calculateCouponDiscount(subtotal: number, code?: string | null) {
  const { coupon, error } = validateCouponCode(subtotal, code);

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