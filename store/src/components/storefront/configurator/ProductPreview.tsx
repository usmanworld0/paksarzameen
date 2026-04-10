import Image from "next/image";
import { Camera, RotateCcw, Sofa, Sun } from "lucide-react";
import type { PreviewControl, PreviewLayer } from "./types";

type ProductPreviewProps = {
  sceneSrc: string;
  layers: PreviewLayer[];
  controls: PreviewControl[];
};

const CONTROL_ICONS = [Camera, RotateCcw, Sofa, Sun];

export function ProductPreview({ sceneSrc, layers, controls }: ProductPreviewProps) {
  return (
    <section className="relative flex-1 bg-[#efefed] p-4 sm:p-6 lg:p-8">
      <div className="relative mx-auto aspect-[16/9] w-full max-w-[1220px] overflow-hidden border border-black/10 bg-white">
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

        <div className="pointer-events-none absolute bottom-8 left-1/2 h-12 w-[44%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-2xl" />

        <div className="absolute bottom-5 left-5 flex items-center gap-2">
          {controls.map((control, index) => {
            const Icon = CONTROL_ICONS[index % CONTROL_ICONS.length];
            return (
              <button
                key={control.id}
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-neutral-800 transition-all duration-300 ${
                  control.active
                    ? "border-black bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                    : "border-black/30 bg-white/94 hover:border-black hover:bg-white"
                }`}
                aria-label={control.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
