"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type RendererLayer = {
  key: string;
  src: string;
  alt: string;
  order: number;
  view: string;
  part?: string;
};

interface LayeredImageRendererProps {
  fallbackSrc: string;
  fallbackAlt: string;
  layers: RendererLayer[];
  defaultView?: string;
  className?: string;
  highlightPart?: string;
}

const LayerFrame = ({
  layer,
  eager,
  onError,
  highlighted,
}: {
  layer: RendererLayer;
  eager: boolean;
  onError: () => void;
  highlighted: boolean;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-300",
        highlighted ? "opacity-100" : "opacity-[0.96]"
      )}
      style={{ zIndex: layer.order }}
      data-layer-part={layer.part || ""}
    >
      <Image
        src={layer.src}
        alt={layer.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 56vw"
        className="object-cover"
        loading={eager ? "eager" : "lazy"}
        quality={90}
        unoptimized={layer.src.startsWith("http")}
        onError={onError}
      />
    </div>
  );
};

async function exportToPng(layers: RendererLayer[]) {
  if (layers.length === 0) return;

  const firstImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = layers[0].src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = firstImage.naturalWidth || 1200;
  canvas.height = firstImage.naturalHeight || 1500;
  const context = canvas.getContext("2d");
  if (!context) return;

  for (const layer of layers) {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new window.Image();
      nextImage.crossOrigin = "anonymous";
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = reject;
      nextImage.src = layer.src;
    });

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  const href = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "customized-preview.png";
  anchor.click();
}

export function LayeredImageRenderer({
  fallbackSrc,
  fallbackAlt,
  layers,
  defaultView = "front",
  className,
  highlightPart,
}: LayeredImageRendererProps) {
  const [activeView, setActiveView] = useState(defaultView);
  const [failed, setFailed] = useState(false);

  const views = useMemo(
    () => Array.from(new Set(layers.map((layer) => layer.view).filter(Boolean))),
    [layers]
  );

  const effectiveView = views.includes(activeView)
    ? activeView
    : views[0] || defaultView;

  const visibleLayers = useMemo(
    () => layers.filter((layer) => layer.view === effectiveView).sort((a, b) => a.order - b.order),
    [effectiveView, layers]
  );

  const hasRenderableLayers = !failed && visibleLayers.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-black/8 bg-[#f7f4ef]">
        {hasRenderableLayers ? (
          <>
            {visibleLayers.map((layer, index) => (
              <LayerFrame
                key={layer.key}
                layer={layer}
                eager={index === 0}
                highlighted={Boolean(highlightPart && layer.part === highlightPart)}
                onError={() => setFailed(true)}
              />
            ))}
          </>
        ) : (
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover"
            quality={90}
            unoptimized={fallbackSrc.startsWith("http")}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {views.length > 1 ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
            {views.map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setActiveView(view)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  view === effectiveView
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:text-neutral-950"
                )}
              >
                {view}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {hasRenderableLayers ? "Layered Preview" : "Static Preview"}
          </span>
        )}

        {hasRenderableLayers && (
          <button
            type="button"
            onClick={() => {
              void exportToPng(visibleLayers);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-neutral-950"
          >
            <Download className="h-3.5 w-3.5" />
            Export Preview
          </button>
        )}
      </div>
    </div>
  );
}
