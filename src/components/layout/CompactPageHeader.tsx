import type { ReactNode } from "react";

type CompactPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function CompactPageHeader({
  title,
  description,
  actions,
}: CompactPageHeaderProps) {
  return (
    <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-12 md:pb-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="max-w-[14ch] text-[10vw] font-black uppercase leading-[0.9] tracking-tighter text-[#111111] md:text-[6rem]">
            {title}
          </h1>
          <p className="mt-2 max-w-[72rem] text-sm font-medium tracking-wide text-[#707072] md:text-base">
            {description}
          </p>
        </div>

        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
