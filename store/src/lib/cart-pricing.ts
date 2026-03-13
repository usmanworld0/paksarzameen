import type { CartItem } from "@/types";

export function getCartItemUnitPrice(item: CartItem) {
  return item.discountedPrice ?? item.price;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + getCartItemUnitPrice(item) * item.quantity,
    0
  );
}