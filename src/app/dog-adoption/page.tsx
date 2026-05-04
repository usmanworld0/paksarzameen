import type { Metadata } from "next";

import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { hasDatabaseConnection } from "@/lib/db";
import { listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption | Find Dogs Near You",
  description:
    "Browse available, requested, and adopted rescue dogs on a live map and explore dog cards filtered by city, area, breed, and age.",
};

export default async function DogAdoptionPage() {
  let dogs = [] as Awaited<ReturnType<typeof listDogs>>;
  let error: string | null = null;

  try {
    if (hasDatabaseConnection()) {
      dogs = await listDogs(["available", "pending", "adopted"]);
    }
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Failed to load dogs.";
  }

  const availableCount = dogs.filter((dog) => dog.status === "available").length;
  const requestedCount = dogs.filter((dog) => dog.status === "pending").length;
  const adoptedCount = dogs.filter((dog) => dog.status === "adopted").length;

  return (
    <main className="min-h-screen bg-[#f3f3ee] pb-16 pt-24 text-slate-900 sm:pb-24">
      <div className="px-[5%]">
        <div className="mx-auto max-w-screen-xl">
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <DogMarketplace
            dogs={dogs}
            initialCounts={{
              available: availableCount,
              pending: requestedCount,
              adopted: adoptedCount,
            }}
          />
        </div>
      </div>
    </main>
  );
}
