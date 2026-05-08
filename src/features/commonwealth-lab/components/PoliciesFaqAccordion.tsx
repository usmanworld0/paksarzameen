"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

interface PoliciesFaqAccordionProps {
  items: FaqItem[];
}

export function PoliciesFaqAccordion({ items }: PoliciesFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#E5E5E5]" role="list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `policy-faq-panel-${index}`;
        const buttonId = `policy-faq-button-${index}`;

        return (
          <article
            key={item.question}
            className="border-b border-[#E5E5E5] py-4 last:border-b-0"
            role="listitem"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 py-0 text-left transition-colors hover:text-[#0f7a47] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a47]/30"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-sm font-black tracking-tight text-[#111111]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-[#707072] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="mt-3 pb-1 text-sm font-medium leading-relaxed text-[#707072]">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
