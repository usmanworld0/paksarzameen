import type { ProductSpec } from "./types";

type BottomInfoProps = {
  productName: string;
  specs: ProductSpec[];
};

export function BottomInfo({ productName, specs }: BottomInfoProps) {
  return (
    <section className="border-t border-black/10 bg-[#f5f5f4]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-7 sm:px-6 lg:px-8">
        <h2 className="text-[2rem] font-normal tracking-[0.08em] text-neutral-900">{productName}</h2>

        <div className="mt-5 grid gap-5 border-t border-black/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="space-y-1">
              <p className="text-[1.25rem] font-normal tracking-[-0.02em] text-neutral-900">{spec.value}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{spec.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
