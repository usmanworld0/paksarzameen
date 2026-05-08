"use client";

import { useState } from "react";
import type { CustomizationOption } from "@prisma/client";

import { normalizeImageSrc } from "@/lib/utils";
import { ConfiguratorLayout } from "@/components/storefront/configurator/ConfiguratorLayout";
import { CategoryCustomizationPanel } from "@/components/storefront/CategoryCustomizationPanel";

type CategoryCustomizationConfiguratorProps = {
  categoryName: string;
  categorySlug: string;
  categoryImage?: string | null;
  categoryProductCount: number;
  options: CustomizationOption[];
};

export function CategoryCustomizationConfigurator({
  categoryName,
  categorySlug,
  categoryImage,
  categoryProductCount,
  options,
}: CategoryCustomizationConfiguratorProps) {
  const fallbackImage = normalizeImageSrc(categoryImage, "/images/commonwealth_header.jpeg");
  const [baseImage, setBaseImage] = useState(fallbackImage);
  const [layerImages, setLayerImages] = useState<
    Array<{ id: string; src: string; alt: string; order: number }>
  >([]);

  return (
    <ConfiguratorLayout
      sectionTitle="01/06: Customization"
      sceneSrc={fallbackImage}
      layers={[
        {
          id: "base",
          src: baseImage,
          alt: `${categoryName} base preview`,
        },
        ...layerImages.map((layer) => ({
          id: layer.id,
          src: layer.src,
          alt: layer.alt,
        })),
      ]}
      controls={[
        { id: "front", label: "Front View", active: true },
        { id: "side", label: "Side View" },
        { id: "detail", label: "Detail View" },
      ]}
      steps={[
        { id: "customize", label: "Customize", completed: true },
        { id: "materials", label: "Materials" },
        { id: "details", label: "Details" },
        { id: "summary", label: "Summary" },
        { id: "review", label: "Review" },
        { id: "next", label: "Next" },
      ]}
      productName={categoryName.toUpperCase()}
      specs={[
        { label: "Customization Groups", value: `${options.length}` },
        { label: "Category Products", value: `${categoryProductCount}` },
      ]}
      sidebarContent={
        <CategoryCustomizationPanel
          categoryName={categoryName}
          categorySlug={categorySlug}
          options={options}
          embedded
          baseImageFallback={fallbackImage}
          onBaseImageChange={setBaseImage}
          onLayerImagesChange={setLayerImages}
          showBillingSummary={false}
          proceedLabel="Proceed"
        />
      }
      hideBottomInfo
      immersive
      useStoreNavbar
      mobilePinnedPreview
    />
  );
}
