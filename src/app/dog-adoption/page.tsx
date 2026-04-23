import type { Metadata } from "next";

import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { hasDatabaseConnection } from "@/lib/db";
import { listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption",
  description:
    "Browse available and adopted rescue dogs and submit an adoption request to give a stray dog a loving home.",
};

export default async function DogAdoptionPage() {
  let dogs = [] as Awaited<ReturnType<typeof listDogs>>;
  let error: string | null = null;

  try {
    if (hasDatabaseConnection()) {
      dogs = await listDogs(["available", "adopted"]);
    }
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Failed to load dogs.";
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#eef6ef_100%)] px-[4%] pb-20 pt-28">
      <section className="mx-auto max-w-screen-2xl space-y-8">
        <div className="rounded-2xl border border-rose-200 bg-[linear-gradient(135deg,_#fff1f2_0%,_#ffe4e6_100%)] px-5 py-4 text-center shadow-sm sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Adoption Drive</p>
          <p className="mt-1 text-lg font-semibold text-rose-900 sm:text-xl">Adopt a dog, save a life for 3500 only</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-xl shadow-emerald-900/10 sm:p-10">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Dog Adoption
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Adopt a Stray, Save a Soul
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Browse rescue dogs in a marketplace-style layout, compare profiles quickly, and open any listing to adopt when you are ready.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        ) : null}

        {!error && !dogs.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            No dogs listed yet. Please check back soon.
          </div>
        ) : null}

        {!error && dogs.length ? <DogMarketplace dogs={dogs} /> : null}
      </section>
    </main>
  );
}
