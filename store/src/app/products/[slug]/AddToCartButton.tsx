"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import type { StoreRegion } from "@/lib/pricing";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    image: string;
    available: boolean;
    region: StoreRegion;
  };
  customizationOptions: CustomizationOption[];
}

export function AddToCartButton({
  product,
  customizationOptions,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<
    Record<string, string>
  >({});
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.image,
      quantity,
      region: product.region,
      customizations:
        Object.keys(customizations).length > 0 ? customizations : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Customization fields */}
      {customizationOptions.map((opt) => (
        <div key={opt.id} className="space-y-1.5">
          <Label>
            {opt.name}
            {opt.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          {opt.type === "text" ? (
            <Input
              placeholder={`Enter ${opt.name.toLowerCase()}`}
              onChange={(e) =>
                setCustomizations((p) => ({ ...p, [opt.name]: e.target.value }))
              }
            />
          ) : (
            <select
              className="w-full border rounded-sm px-3 py-2 text-sm bg-white"
              onChange={(e) =>
                setCustomizations((p) => ({ ...p, [opt.name]: e.target.value }))
              }
              defaultValue=""
            >
              <option value="" disabled>
                Select {opt.name.toLowerCase()}
              </option>
              {(opt.options as string[])?.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Quantity + Add to Cart */}
      <div className="space-y-3 pt-2">
        {/* Quantity selector — rounded pill style */}
        <div className="inline-flex items-center rounded-full border border-neutral-200">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
            type="button"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-4 text-sm min-w-[2.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(quantity + 1)
            }
            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Full-width CTA */}
        <button
          onClick={handleAdd}
          disabled={!product.available}
          className="w-full bg-neutral-900 text-white text-sm font-medium tracking-wider uppercase py-4 hover:bg-neutral-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          type="button"
        >
          {added ? "Added to Cart" : product.available ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
