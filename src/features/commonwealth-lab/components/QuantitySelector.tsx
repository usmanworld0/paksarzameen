"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#E5E5E5]">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-2 text-sm text-[#707072] transition hover:bg-[#f3f3ee] hover:text-[#111111] disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="border-x border-[#E5E5E5] px-3 text-sm font-black text-[#111111] tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-2 text-sm text-[#707072] transition hover:bg-[#f3f3ee] hover:text-[#111111] disabled:opacity-30"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
