import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { hasDatabaseConnection } from "@/lib/db";
import { listAdoptedDogsWithOwners, listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption",
  description:
    "Browse available and adopted rescue dogs and submit an adoption request to give a stray dog a loving home.",
};

export default async function DogAdoptionPage() {
  let dogs = [] as Awaited<ReturnType<typeof listDogs>>;
  let adoptedDogs = [] as Awaited<ReturnType<typeof listAdoptedDogsWithOwners>>;
  let error: string | null = null;

  try {
    if (hasDatabaseConnection()) {
      dogs = await listDogs(["available", "adopted"]);
      adoptedDogs = await listAdoptedDogsWithOwners();
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

        {!error ? (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Adopted Dogs</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Dogs settled into loving homes
                </h2>
              </div>
            </div>

            {!adoptedDogs.length ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                No adopted dog records available yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {adoptedDogs.map((dog) => (
                  <article key={dog.dogId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image src={dog.imageUrl} alt={dog.dogName} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover" />
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg font-semibold text-slate-900">{dog.dogName}</h3>
                      <p className="text-xs text-slate-500">Rescue name: {dog.rescueName}</p>
                      <p className="text-sm text-slate-600">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
                      <p className="text-sm text-slate-700">Owner: {dog.ownerName ?? "Owner details unavailable"}</p>
                      <p className="text-sm text-indigo-700">Pet name: {dog.petName ?? "Not assigned yet"}</p>
                      <Link href={`/dog/${dog.dogId}`} className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-600">
                        View profile →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}
