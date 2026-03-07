"use client";

import Image from "next/image";
import type { CartItem as CartItemType } from "@/lib/models/Product";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;

  return (
    <article className="flex gap-5 border-b border-neutral-100 py-6 last:border-b-0">
      {/* Thumbnail */}
      <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
          quality={70}
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">{product.category}</p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <QuantitySelector
            value={quantity}
            onChange={(qty) => onUpdateQuantity(product.id, qty)}
          />
          <p className="text-sm font-bold text-neutral-900">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(product.id)}
        className="self-start text-xs text-neutral-400 underline transition-colors hover:text-red-600"
        aria-label={`Remove ${product.name} from cart`}
      >
        Remove
      </button>
    </article>
  );
}
