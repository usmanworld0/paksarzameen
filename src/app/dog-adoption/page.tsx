import type { Metadata } from "next";

import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { hasDatabaseConnection } from "@/lib/db";
import { listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption | Find Dogs Near You",
  description:
    "Browse rescue dogs on a live map and explore dog cards filtered by city, area, and age.",
};

const STORE_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

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

  return (
    <main className="store-shell pt-[72px]">
      <section className="border-b border-black/6 bg-white py-12 sm:py-16">
        <div className="store-container" style={{ fontFamily: STORE_FONT_FAMILY }}>
          <header>
            <p className="store-kicker">Animal Welfare</p>
            <h1 className="store-heading mt-3 font-medium">
              Adopt a Dog
            </h1>
            <p className="store-subheading mt-2 max-w-2xl">
              Give a homeless rescue dog a loving environment. Browse listings on a live map, filtered by city, area, and status.
            </p>
          </header>
        </div>
      </section>

      <section className="store-section-soft">
        <div className="store-container" style={{ fontFamily: STORE_FONT_FAMILY }}>
          {error ? (
            <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <DogMarketplace dogs={dogs} />
        </div>
      </section>
    </main>
  );
}
