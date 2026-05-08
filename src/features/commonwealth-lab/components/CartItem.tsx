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
    <div className="flex gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-4 mb-3">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f3f3ee]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
          quality={70}
        />
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="text-base font-black tracking-tighter text-[#111111] line-clamp-1">
          {product.name}
        </p>
        <p className="text-sm font-medium text-[#707072]">{product.category}</p>
        <p className="mt-2 text-lg font-black text-[#111111]">
          PKR {(product.price * quantity).toLocaleString()}
        </p>

        <div className="mt-3 flex items-center gap-4">
          <QuantitySelector
            value={quantity}
            onChange={(qty) => onUpdateQuantity(product.id, qty)}
          />
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#707072] transition-colors hover:text-red-600"
            aria-label={`Remove ${product.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
