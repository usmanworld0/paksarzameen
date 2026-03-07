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
    <div className="inline-flex items-center rounded-full border border-neutral-300">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center text-lg text-neutral-600 transition-colors hover:text-neutral-900 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums text-neutral-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center text-lg text-neutral-600 transition-colors hover:text-neutral-900 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
