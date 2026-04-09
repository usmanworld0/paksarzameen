import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="store-container py-20">
      <div className="mb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <span className="block text-[1.05rem] font-normal tracking-[0.12em]">PAKSARZAMEEN</span>
            <span className="block text-sm font-normal text-neutral-600">Store</span>
          </div>
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-neutral-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-[18px] border border-black/6 bg-white/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
            <Skeleton className="h-4 w-1/2 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
