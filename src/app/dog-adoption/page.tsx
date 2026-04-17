import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { listDogs, type DogStatus } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption",
  description:
    "Browse available and adopted rescue dogs and submit an adoption request to give a stray dog a loving home.",
};

const STATUS_LABELS: Record<DogStatus, string> = {
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
};

function statusClass(status: DogStatus) {
  if (status === "available") return "bg-emerald-100 text-emerald-800";
  if (status === "adopted") return "bg-indigo-100 text-indigo-700";
  return "bg-amber-100 text-amber-700";
}

export default async function DogAdoptionPage() {
  let dogs = [] as Awaited<ReturnType<typeof listDogs>>;
  let error: string | null = null;

  try {
    if (process.env.DATABASE_URL) {
      dogs = await listDogs(["available", "adopted"]);
    }
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Failed to load dogs.";
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#eef6ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-xl shadow-emerald-900/10 sm:p-10">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Dog Adoption
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Adopt a Stray, Save a Soul
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Give a homeless dog a loving home. Browse verified profiles, learn their story,
            and submit your adoption request in minutes.
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

        {!error && dogs.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => (
              <article
                key={dog.dogId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{dog.name}</h2>
                      <p className="text-sm text-slate-600">
                        {dog.breed} • {dog.age}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(dog.status)}`}>
                      {STATUS_LABELS[dog.status]}
                    </span>
                  </div>

                  <Link
                    href={`/dog/${dog.dogId}`}
                    className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {dog.status === "available" ? "View / Adopt" : "View"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
