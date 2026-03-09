"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    image: string;
    stock: number;
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
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center border rounded-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-neutral-50 transition-colors"
            type="button"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock, quantity + 1))
            }
            className="px-3 py-2 hover:bg-neutral-50 transition-colors"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          onClick={handleAdd}
          variant="primary"
          size="lg"
          disabled={product.stock === 0}
          className="flex-1"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {added ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
