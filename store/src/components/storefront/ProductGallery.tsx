"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

export function ProductGallery({
  images,
  productName,
  model3DUrl,
}: ProductGalleryProps) {
  const normalizedImages = images.map((image) => ({
    ...image,
    imageUrl: normalizeImageSrc(image.imageUrl),
  }));
  const hasImages = normalizedImages.length > 0;
  const has3DModel = Boolean(model3DUrl);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"image" | "3d">(
    () => (!hasImages && has3DModel ? "3d" : "image")
  );
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const selectedImage = normalizedImages[selectedIndex] ?? null;

  useEffect(() => {
    if (!hasImages && has3DModel) {
      setViewMode("3d");
      return;
    }

    if (!has3DModel) {
      setViewMode("image");
    }
  }, [has3DModel, hasImages]);

  useEffect(() => {
    setViewerReady(false);
  }, [model3DUrl, viewMode]);

  useEffect(() => {
    setViewerError(null);
  }, [model3DUrl]);

  if (!hasImages && !has3DModel) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] border border-black/8 bg-[#f7f4ef]">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
      {normalizedImages.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[720px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 scrollbar-thin">
          {normalizedImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-[18px] border transition-all duration-300 lg:w-full ${
                index === selectedIndex
                  ? "border-neutral-950 shadow-[0_16px_34px_rgba(17,17,17,0.08)]"
                  : "border-black/8 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${index + 1}`}
                fill
                sizes="88px"
                className="object-cover"
                quality={68}
                unoptimized={img.imageUrl.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 space-y-4 lg:order-2">
        {has3DModel ? (
          <div className="flex flex-wrap gap-2">
            {hasImages ? (
              <button
                type="button"
                onClick={() => setViewMode("image")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  viewMode === "image"
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-black/10 bg-white text-neutral-700 hover:border-neutral-950 hover:text-neutral-950"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Image View
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setViewerError(null);
                setViewMode("3d");
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                viewMode === "3d"
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/10 bg-white text-neutral-700 hover:border-neutral-950 hover:text-neutral-950"
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              3D View
            </button>
          </div>
        ) : null}

        {viewerError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            {viewerError}
          </div>
        ) : null}

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-black/8 bg-[#f7f4ef]">
          {viewMode === "3d" && model3DUrl ? (
            <>
              {selectedImage ? (
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || productName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className={`object-cover transition-opacity duration-500 ${
                    viewerReady ? "opacity-0" : "opacity-100"
                  }`}
                  priority
                  quality={90}
                  unoptimized={selectedImage.imageUrl.startsWith("http")}
                />
              ) : null}

              {!viewerReady ? (
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-white/86 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-600 backdrop-blur-md">
                  Loading 3D
                </div>
              ) : (
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-white/86 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-600 backdrop-blur-md">
                  3D View
                </div>
              )}

              <div className="absolute inset-0">
                <Product3DViewer
                  modelUrl={model3DUrl}
                  posterUrl={selectedImage?.imageUrl}
                  alt={productName}
                  onReady={() => setViewerReady(true)}
                  onError={() => {
                    setViewerReady(false);
                    if (normalizedImages.length > 0) {
                      setViewMode("image");
                    }
                    setViewerError("The 3D model could not be loaded, so image view is shown instead.");
                  }}
                />
              </div>
            </>
          ) : selectedImage ? (
            <>
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.altText || productName}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover transition-opacity duration-500"
                priority
                quality={90}
                unoptimized={selectedImage.imageUrl.startsWith("http")}
              />
              <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/82 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-600 backdrop-blur-md">
                {selectedIndex + 1} / {normalizedImages.length}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
              No image available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
