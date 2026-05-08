import type { CartItem } from "@/types";
import { getCustomizationTotal } from "@/lib/customizations";

export function getCartItemUnitPrice(item: CartItem) {
  return (item.discountedPrice ?? item.price) + getCustomizationTotal(item);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + getCartItemUnitPrice(item) * item.quantity,
    0
  );
}