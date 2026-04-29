"use client";

import { useEffect, useState } from "react";
import { DogMarketplace } from "../../features/dog-adoption/components/DogMarketplace";
import { apiUrl } from "../../lib/api";
import { parseJsonResponse } from "../../lib/fetchHelpers";

type DogRecord = {
  dogId: string;
  name: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  city: string | null;
  area: string | null;
  description: string;
  imageUrl: string;
  status: "available" | "pending" | "adopted";
  createdAt: string;
};

type AdoptedDogRecord = {
  dogId: string;
  dogName: string;
  rescueName: string;
  petName: string | null;
  breed: string;
  color: string;
  age: string;
  gender: string;
  imageUrl: string;
  ownerName: string | null;
};

export default function DogAdoptionPageClient() {
  const [dogs, setDogs] = useState<DogRecord[]>([]);
  const [adopted, setAdopted] = useState<AdoptedDogRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(apiUrl("/api/dogs?status=available&status=adopted"));
        const payload = (await parseJsonResponse(res)) as { data?: DogRecord[]; error?: string };
        if (!res.ok) throw new Error(payload?.error || `Failed to load dogs. (status ${res.status})`);
        if (mounted) setDogs(payload.data ?? []);

        const res2 = await fetch(apiUrl("/api/dogs/adopted"));
        const payload2 = (await parseJsonResponse(res2)) as { data?: AdoptedDogRecord[]; error?: string };
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
    <main className="dog-shell px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[1380px] space-y-8">
        <div className="dog-surface rounded-[30px] px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 border-b border-black/6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="dog-kicker">Adoption drive</p>
              <h2 className="dog-heading">Adopt a stray, save a soul</h2>
              <p className="dog-subheading max-w-2xl">
                Browse available dogs, filter by what matters, and open a profile when you’re ready to send an adoption request.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-black/8 bg-neutral-50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Available</p>
                <p className="mt-2 text-xl font-normal text-neutral-950">{dogs.length}</p>
              </div>
              <div className="rounded-[22px] border border-black/8 bg-neutral-50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Adopted</p>
                <p className="mt-2 text-xl font-normal text-neutral-950">{adopted.length}</p>
              </div>
              <a href="/" className="rounded-[22px] border border-black/8 bg-neutral-950 px-4 py-3 text-sm text-white transition hover:bg-neutral-800">
                Back home
              </a>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-[24px] border border-black/8 bg-white p-4 text-neutral-700 shadow-[0_18px_48px_-42px_rgba(17,17,17,0.55)]">{error}</div>
        ) : null}

        {!error && !dogs.length ? (
          <div className="rounded-[24px] border border-dashed border-black/10 bg-white p-6 text-neutral-600 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.42)]">No dogs listed yet. Please check back soon.</div>
        ) : null}

        {!error && dogs.length ? <DogMarketplace dogs={dogs} /> : null}

        {!error ? (
          <section className="space-y-4 rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_-42px_rgba(17,17,17,0.5)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="dog-kicker">Adopted dogs</p>
                <h2 className="mt-1 text-3xl font-normal tracking-[-0.04em] text-neutral-950 sm:text-4xl">Dogs settled into loving homes</h2>
              </div>
            </div>

            {!adopted.length ? (
              <p className="rounded-[22px] border border-black/8 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">No adopted dog records available yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {adopted.map((dog) => (
                  <article key={dog.dogId} className="overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_18px_48px_-46px_rgba(17,17,17,0.5)]">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img src={dog.imageUrl} alt={dog.dogName} className="object-cover w-full h-full" />
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg font-normal tracking-[-0.03em] text-neutral-950">{dog.dogName}</h3>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Rescue name: {dog.rescueName}</p>
                      <p className="text-sm text-neutral-600">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
                      <p className="text-sm text-neutral-700">Owner: {dog.ownerName ?? "Owner details unavailable"}</p>
                      <p className="text-sm text-neutral-950">Pet name: {dog.petName ?? "Not assigned yet"}</p>
                      <a href={`/dog/${dog.dogId}`} className="inline-flex text-sm font-normal uppercase tracking-[0.18em] text-neutral-950 hover:opacity-70">View profile →</a>
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
