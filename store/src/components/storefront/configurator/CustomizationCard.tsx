import Image from "next/image";
import { Info } from "lucide-react";
import type { CustomizationItem } from "./types";

type CustomizationCardProps = {
  item: CustomizationItem;
};

export function CustomizationCard({ item }: CustomizationCardProps) {
  return (
    <article
      className={`group overflow-hidden border bg-white transition-all duration-300 ${
        item.selected
          ? "border-black shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          : "border-black/10 hover:border-black/30 hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="flex min-h-[128px]">
        <div className="relative h-auto w-[128px] shrink-0 border-r border-black/10 bg-neutral-100">
          <Image src={item.thumbnail} alt={item.title} fill sizes="128px" className="object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[1.02rem] font-normal tracking-[-0.02em] text-neutral-900">{item.title}</h3>
            {item.showInfo ? <Info className="mt-0.5 h-4 w-4 text-neutral-500" /> : null}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className={`inline-flex h-9 items-center justify-center border px-4 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                item.actionLabel === "Remove"
                  ? "border-black bg-black text-white hover:bg-neutral-800"
                  : "border-black/20 bg-white text-neutral-900 hover:border-black hover:bg-black hover:text-white"
              }`}
            >
              {item.actionLabel}
            </button>

            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {item.selected ? "Active" : "Available"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
