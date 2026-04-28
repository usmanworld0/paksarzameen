"use client";

import { useEffect, useState } from "react";
import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { apiUrl } from "@/lib/api";

export default function DogAdoptionPageClient() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [adopted, setAdopted] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(apiUrl("/api/dogs?status=available&status=adopted"));
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || "Failed to load dogs.");
        if (mounted) setDogs(payload.data ?? []);

        const res2 = await fetch(apiUrl("/api/dogs/adopted"));
        const payload2 = await res2.json();
        if (res2.ok) {
          if (mounted) setAdopted(payload2.data ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#eef6ef_100%)] px-[4%] pb-20 pt-28">
      <section className="mx-auto max-w-screen-2xl space-y-8">
        <div className="rounded-2xl border border-rose-200 bg-[linear-gradient(135deg,_#fff1f2_0%,_#ffe4e6_100%)] px-5 py-4 text-center shadow-sm sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Adoption Drive</p>
          <p className="mt-1 text-lg font-semibold text-rose-900 sm:text-xl">Adopt a Stray, Save a Soul</p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        ) : null}

        {!error && !dogs.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No dogs listed yet. Please check back soon.</div>
        ) : null}

        {!error && dogs.length ? <DogMarketplace dogs={dogs} /> : null}

        {!error ? (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Adopted Dogs</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Dogs settled into loving homes</h2>
              </div>
            </div>

            {!adopted.length ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">No adopted dog records available yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {adopted.map((dog) => (
                  <article key={dog.dogId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img src={dog.imageUrl} alt={dog.dogName} className="object-cover w-full h-full" />
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg font-semibold text-slate-900">{dog.dogName}</h3>
                      <p className="text-xs text-slate-500">Rescue name: {dog.rescueName}</p>
                      <p className="text-sm text-slate-600">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
                      <p className="text-sm text-slate-700">Owner: {dog.ownerName ?? "Owner details unavailable"}</p>
                      <p className="text-sm text-indigo-700">Pet name: {dog.petName ?? "Not assigned yet"}</p>
                      <a href={`/dog/${dog.dogId}`} className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-600">View profile →</a>
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
