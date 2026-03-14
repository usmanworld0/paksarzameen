"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { getCartItemUnitPrice } from "@/lib/cart-pricing";

export function getCartItemKey(item: CartItem) {
  const customizationKey = (item.customizations ?? [])
    .slice()
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((entry) => `${entry.key}:${entry.value}:${entry.priceAdjustment}`);

  return `${item.productId}::${item.region ?? "PAK"}::${JSON.stringify(
    customizationKey
  )}`;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const itemKey = getCartItemKey(item);
          const existing = state.items.find(
            (entry) => getCartItemKey(entry) === itemKey
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                getCartItemKey(i) === itemKey
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (itemKey) =>
        set((state) => ({
          items: state.items.filter((item) => getCartItemKey(item) !== itemKey),
        })),

      updateQuantity: (itemKey, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => getCartItemKey(item) !== itemKey)
              : state.items.map((i) =>
                  getCartItemKey(i) === itemKey ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + getCartItemUnitPrice(i) * i.quantity,
          0
        ),
    }),
    { name: "cwl-cart" }
  )
);
