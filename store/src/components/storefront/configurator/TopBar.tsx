"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

type TopBarProps = {
  onOpenSidebar?: () => void;
};

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" />
          Change Model
        </button>

        <div className="text-center">
          <a href="/" className="block text-xl leading-none tracking-[-0.03em]">PSZ</a>
        </div>

        <>
          <button
            type="button"
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition-opacity hover:opacity-60 lg:inline-flex"
          >
            <FileText className="h-4 w-4" />
            Summary
          </button>

          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition-opacity hover:opacity-60 lg:hidden"
          >
            <FileText className="h-4 w-4" />
            Summary
          </button>
        </>
      </div>
    </header>
  );
}
