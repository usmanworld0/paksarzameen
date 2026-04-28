"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "../../../lib/api";
import { AdoptDogButton } from "../../../features/dog-adoption/components/AdoptDogButton";
import Image from "next/image";
import Link from "next/link";

type DogDetail = {
  dogId: string;
  name: string;
  rescueName: string;
  petName: string | null;
  breed: string;
  color: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: string;
  status: "available" | "pending" | "adopted";
};

type DogUpdate = {
  updateId: string;
  imageUrl: string;
  caption: string;
  collarTag: string | null;
};

function isWrappedDogPayload(
  data: unknown
): data is { dog?: DogDetail; updates?: DogUpdate[] } {
  return typeof data === "object" && data !== null && ("dog" in data || "updates" in data);
}

export default function DogDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [dog, setDog] = useState<DogDetail | null>(null);
  const [updates, setUpdates] = useState<DogUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/dogs/${id}`));
        const payload = (await res.json()) as {
          data?: { dog?: DogDetail; updates?: DogUpdate[] } | DogDetail;
          error?: string;
        };
        if (!res.ok) throw new Error(payload?.error || "Failed to load dog.");
        if (mounted) {
          const data = payload.data;
          if (isWrappedDogPayload(data)) {
            setDog(data.dog ?? null);
            setUpdates(data.updates ?? []);
          } else {
            setDog(data ?? null);
            setUpdates([]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) return <div className="p-6 text-red-700">{error}</div>;
  if (!dog) return <div className="p-6">Loading…</div>;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="relative aspect-[4/3] bg-slate-100">
            <Image
              src={dog.imageUrl}
              alt={dog.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-5 rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl shadow-emerald-900/10 sm:p-8">
          <div className="space-y-2">
            <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Dog Profile</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{dog.name}</h1>
            <p className="text-xs uppercase tracking-wide text-slate-500">Rescue Name: {dog.rescueName}</p>
            {dog.petName ? <p className="text-sm font-semibold text-indigo-700">Pet Name: {dog.petName}</p> : null}
            <p className="text-sm text-slate-600 sm:text-base">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
          </div>

          <p className="text-base leading-relaxed text-slate-700">{dog.description}</p>

          {dog.status === "available" ? (
            <AdoptDogButton dogId={dog.dogId} />
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">This dog is currently marked as {dog.status}.</p>
          )}

          <Link href="/dog-adoption" className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-600">← Back to Browse Dogs</Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Life After Adoption</h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">Post-adoption moments shared by the admin team for adopted dogs.</p>
        </div>

        {!updates.length ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">No post-adoption updates uploaded yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {updates.map((item) => (
              <article key={item.updateId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">{item.caption}</p>
                  {item.collarTag ? <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Collar Tag: {item.collarTag}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
