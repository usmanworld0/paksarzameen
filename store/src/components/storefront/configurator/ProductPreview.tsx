import Image from "next/image";
import { Maximize2, Minimize2 } from "lucide-react";
import type { PreviewLayer } from "./types";

type ProductPreviewProps = {
  sceneSrc: string;
  layers: PreviewLayer[];
  mobilePinned?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

export function ProductPreview({
  sceneSrc,
  layers,
  mobilePinned = false,
  isExpanded = false,
  onToggleExpand,
}: ProductPreviewProps) {
  return (
    <section
      className={`relative flex-1 bg-[#efefed] ${
        mobilePinned ? "h-full p-2 sm:p-3 lg:p-8" : "p-3 sm:p-6 lg:p-8"
      }`}
    >
      <div
        className={`relative mx-auto w-full overflow-hidden border border-black/10 bg-white ${
          mobilePinned
            ? "h-full max-w-none"
            : "aspect-[16/9] max-w-[1220px]"
        }`}
      >
        <button
          type="button"
          onClick={onToggleExpand}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-black hover:bg-white"
          aria-label={isExpanded ? "Show customization options" : "Expand preview"}
        >
          {isExpanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              Options
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              Expand
            </>
          )}
        </button>

        <Image
          src={sceneSrc}
          alt="Luxury background scene"
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />

        <div className="absolute inset-0">
          {layers.map((layer) => (
            <div key={layer.id} className="absolute inset-0" style={{ opacity: layer.opacity ?? 1 }}>
              <Image
                src={layer.src}
                alt={layer.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 h-10 w-[56%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-2xl sm:bottom-8 sm:h-12 sm:w-[44%]" />
      </div>
    </section>
  );
}
