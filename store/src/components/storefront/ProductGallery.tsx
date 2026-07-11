"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Box } from "lucide-react";
import { useState } from "react";
import type { ProductImage } from "@prisma/client";
import { normalizeImageSrc } from "@/lib/utils";

const Product3DViewer = dynamic(
  () => import("@/components/Product3DViewer").then((module) => module.Product3DViewer),
  { ssr: false }
);

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  model3DUrl?: string | null;
}

export function ProductGallery({ images, productName, model3DUrl }: ProductGalleryProps) {
  const normalizedImages = images.map((image) => ({
    ...image,
    imageUrl: normalizeImageSrc(image.imageUrl),
  }));
  const hasImages = normalizedImages.length > 0;
  const has3DModel = Boolean(model3DUrl);
  const [showModel, setShowModel] = useState(!hasImages && has3DModel);
  const [viewerError, setViewerError] = useState<string | null>(null);

  if (!hasImages && !has3DModel) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-[#f7f4ef]">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 lg:space-y-3">
      {has3DModel ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setViewerError(null);
              setShowModel((previous) => !previous);
            }}
            className="inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-800 transition-colors hover:bg-neutral-950 hover:text-white"
          >
            <Box className="h-3.5 w-3.5" />
            {showModel ? "Show images" : "Explore in 3D"}
          </button>
        </div>
      ) : null}

      {viewerError ? (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {viewerError}
        </div>
      ) : null}

      {showModel && model3DUrl ? (
        <div className="relative aspect-[4/5] min-h-[430px] overflow-hidden bg-[#f7f4ef] sm:min-h-[560px]">
          <Product3DViewer
            modelUrl={model3DUrl}
            posterUrl={normalizedImages[0]?.imageUrl}
            alt={productName}
            onError={() => {
              setShowModel(false);
              setViewerError("The 3D model could not be loaded, so product images are shown instead.");
            }}
          />
        </div>
      ) : null}

      {!showModel && normalizedImages.map((image, index) => (
        <figure key={image.id} className="relative aspect-[4/5] overflow-hidden bg-[#f7f4ef]">
          <Image
            src={image.imageUrl}
            alt={image.altText || `${productName} image ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={index === 0}
            quality={90}
            unoptimized={image.imageUrl.startsWith("http")}
          />
          <figcaption className="absolute right-3 top-3 border border-white/30 bg-white/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-600 backdrop-blur-sm">
            {index + 1} / {normalizedImages.length}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}