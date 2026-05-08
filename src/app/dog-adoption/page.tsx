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
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_58%,#f6f2ec_100%)] pt-[72px] text-neutral-950">
      <section className="border-b border-black/6 bg-white">
        <div
          className="mx-auto w-full max-w-[1380px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
          style={{ fontFamily: STORE_FONT_FAMILY }}
        >
          <header>
            <p className="text-[9px] font-normal uppercase tracking-[0.28em] text-neutral-500">
              Dog Adoption
            </p>
            <h1 className="mt-4 text-[clamp(2.6rem,5vw,5.2rem)] leading-[0.9] tracking-[-0.08em] text-neutral-950">
              Dog Adoption
            </h1>
          </header>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1380px]" style={{ fontFamily: STORE_FONT_FAMILY }}>
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
