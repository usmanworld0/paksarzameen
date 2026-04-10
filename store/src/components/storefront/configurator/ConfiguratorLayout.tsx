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
}: ConfiguratorLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className={`bg-white text-neutral-900 ${immersive ? "min-h-screen lg:h-screen lg:overflow-hidden" : "min-h-screen"}`}>
      <TopBar onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <div
        className={`mx-auto grid w-full max-w-[1800px] lg:grid-cols-[7fr_3fr] ${
          immersive ? "lg:h-[calc(100vh-72px)] lg:overflow-hidden" : "lg:min-h-[calc(100vh-72px-220px)]"
        }`}
      >
        <ProductPreview sceneSrc={sceneSrc} layers={layers} controls={controls} />

        <aside className="hidden h-full overflow-y-auto border-l border-black/10 bg-white lg:block">
          {renderSidebarContent()}
        </aside>
      </div>

      {!hideBottomInfo && productName ? <BottomInfo productName={productName} specs={specs} /> : null}

      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity lg:hidden ${
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-[70] h-full w-[min(88vw,420px)] border-l border-black/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.2)] transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-black/10 px-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Summary</p>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="text-[11px] uppercase tracking-[0.16em] text-neutral-700"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-72px)] overflow-y-auto">
          {renderSidebarContent()}
        </div>
      </div>
    </div>
  );
}
