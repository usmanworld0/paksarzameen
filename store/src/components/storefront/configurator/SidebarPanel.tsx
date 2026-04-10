import { CustomizationCard } from "./CustomizationCard";
import type { CustomizationItem, CustomizationStep } from "./types";

type SidebarPanelProps = {
  sectionTitle: string;
  steps: CustomizationStep[];
  items: CustomizationItem[];
};

export function SidebarPanel({ sectionTitle, steps, items }: SidebarPanelProps) {
  return (
    <aside className="h-full overflow-y-auto border-l border-black/10 bg-white">
      <div className="space-y-6 p-5 sm:p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">{sectionTitle}</p>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-[3px] ${step.completed ? "bg-black" : "bg-neutral-300"}`}
                title={step.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <CustomizationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}
