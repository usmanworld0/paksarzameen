import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="store-container py-20">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-[22px] border border-[#eadfd7] bg-white/70 p-3">
            <Skeleton className="aspect-[3/4] w-full rounded-[16px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
