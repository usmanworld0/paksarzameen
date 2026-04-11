"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
  const router = useRouter();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-neutral-700 transition-opacity hover:opacity-60 sm:gap-2 sm:text-[11px] sm:tracking-[0.16em]"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Change Model</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="text-center">
          <a href="/" className="block text-lg leading-none tracking-[-0.03em] sm:text-xl">PSZ</a>
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]">
          Customizer
        </span>
      </div>
    </header>
  );
}
