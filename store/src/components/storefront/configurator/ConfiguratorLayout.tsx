"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { TopBar } from "./TopBar";
import { ProductPreview } from "./ProductPreview";
import { SidebarPanel } from "./SidebarPanel";
import { BottomInfo } from "./BottomInfo";
import type {
  CustomizationItem,
  CustomizationStep,
  PreviewControl,
  PreviewLayer,
  ProductSpec,
} from "./types";

type ConfiguratorLayoutProps = {
  sectionTitle?: string;
  sceneSrc: string;
  layers: PreviewLayer[];
  controls: PreviewControl[];
  steps?: CustomizationStep[];
  customizationItems?: CustomizationItem[];
  productName?: string;
  specs?: ProductSpec[];
  sidebarContent?: ReactNode;
  hideBottomInfo?: boolean;
  immersive?: boolean;
  useStoreNavbar?: boolean;
  mobilePinnedPreview?: boolean;
};

export function ConfiguratorLayout({
  sectionTitle,
  sceneSrc,
  layers,
  controls,
  steps = [],
  customizationItems = [],
  productName,
  specs = [],
  sidebarContent,
  hideBottomInfo = false,
  immersive = false,
  useStoreNavbar = false,
  mobilePinnedPreview = false,
}: ConfiguratorLayoutProps) {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const renderSidebarContent = () => {
    if (sidebarContent) {
      return <div className="p-4 sm:p-5">{sidebarContent}</div>;
    }

    return (
      <SidebarPanel
        sectionTitle={sectionTitle ?? "01/06: Exterior"}
        steps={steps}
        items={customizationItems}
      />
    );
  };

  return (
    <div
      className={`bg-white text-neutral-900 ${
        useStoreNavbar
          ? "h-[calc(100svh-72px)] overflow-hidden"
          : immersive
          ? "min-h-screen lg:h-screen lg:overflow-hidden"
          : "min-h-screen"
      }`}
    >
      {!useStoreNavbar ? <TopBar /> : null}

      <div
        className={`mx-auto grid w-full max-w-[1800px] ${
          mobilePinnedPreview
            ? isPreviewExpanded
              ? "h-full grid-rows-[1fr_0fr] lg:grid-cols-[1fr_0fr] lg:grid-rows-1"
              : "h-full grid-rows-[minmax(220px,34svh)_1fr] lg:grid-cols-[7fr_3fr] lg:grid-rows-1"
            : "lg:grid-cols-[7fr_3fr]"
        } ${
          useStoreNavbar
            ? "h-full overflow-hidden"
            : immersive
            ? "lg:h-[calc(100vh-72px)] lg:overflow-hidden"
            : "lg:min-h-[calc(100vh-72px-220px)]"
        } transition-[grid-template-columns,grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      >
        <ProductPreview
          sceneSrc={sceneSrc}
          layers={layers}
          mobilePinned={mobilePinnedPreview}
          isExpanded={isPreviewExpanded}
          onToggleExpand={() => setIsPreviewExpanded((previous) => !previous)}
        />

        <aside
          className={`bg-white lg:hidden ${
            mobilePinnedPreview
              ? isPreviewExpanded
                ? "max-h-0 overflow-hidden border-t-0 opacity-0"
                : "overflow-y-auto border-t border-black/10 opacity-100"
              : "border-t border-black/10"
          }`}
          aria-hidden={isPreviewExpanded ? "true" : "false"}
        >
          {renderSidebarContent()}
        </aside>

        <aside
          className={`hidden h-full overflow-y-auto border-l border-black/10 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
            isPreviewExpanded
              ? "translate-x-8 opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
          aria-hidden={isPreviewExpanded ? "true" : "false"}
        >
          {renderSidebarContent()}
        </aside>
      </div>

      {!hideBottomInfo && productName ? <BottomInfo productName={productName} specs={specs} /> : null}
    </div>
  );
}
