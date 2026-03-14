"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import type { StoreRegion } from "@/lib/pricing";

type ValueOption = {
  value: string;
  label: string;
};

type OptionGroup = {
  label: string;
  values: ValueOption[];
};

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

function parseOptionGroups(raw: unknown): OptionGroup[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const group = item as Record<string, unknown>;
      const values = Array.isArray(group.values) ? group.values : [];

      return {
        label: typeof group.label === "string" ? group.label : "Options",
        values: values
          .filter((value) => value && typeof value === "object" && !Array.isArray(value))
          .map((value) => {
            const option = value as Record<string, unknown>;

            return {
              value: String(option.value ?? ""),
              label: String(option.label ?? option.value ?? ""),
            };
          })
          .filter((value) => value.value),
      };
    })
    .filter((group) => group.values.length > 0);
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
  const hasMissingRequiredCustomization = customizationOptions.some(
    (option) => option.required && !customizations[option.name]
  );

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
      {customizationOptions.map((opt) => {
        const groups = parseOptionGroups(opt.options);

        if (groups.length === 0) {
          return null;
        }

        return (
          <div key={opt.id} className="space-y-1.5">
            <Label>
              {opt.name}
              {opt.required && <span className="ml-0.5 text-red-500">*</span>}
            </Label>
            <select
              className="w-full rounded-sm border bg-white px-3 py-2 text-sm"
              onChange={(e) =>
                setCustomizations((previous) => ({
                  ...previous,
                  [opt.name]: e.target.value,
                }))
              }
              value={customizations[opt.name] ?? ""}
            >
              <option value="" disabled>
                Select {opt.name.toLowerCase()}
              </option>
              {groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.values.map((value) => (
                    <option key={value.value} value={value.label}>
                      {value.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        );
      })}

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
          disabled={!product.available || hasMissingRequiredCustomization}
          className="w-full bg-neutral-900 text-white text-sm font-medium tracking-wider uppercase py-4 hover:bg-neutral-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          type="button"
        >
          {added ? "Added to Cart" : product.available ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
