"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { AdoptDogButton } from "../../../features/dog-adoption/components/AdoptDogButton";
import { DogLikeButton } from "../../../components/DogLikeButton";
import { apiUrl } from "../../../lib/api";
import { parseJsonResponse } from "../../../lib/fetchHelpers";

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

function isWrappedDogPayload(data: unknown): data is { dog?: DogDetail; updates?: DogUpdate[] } {
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
        const payload = (await parseJsonResponse(res)) as {
          data?: { dog?: DogDetail; updates?: DogUpdate[] } | DogDetail;
          error?: string;
        };

        if (!res.ok) {
          throw new Error(payload?.error || `Failed to load dog. (status ${res.status})`);
        }

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

  if (error) {
    return (
      <main className="dog-shell px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl border border-black/8 bg-white p-6 text-neutral-700">
          {error}
        </div>
      </main>
    );
  }

  if (!dog) {
    return (
      <main className="dog-shell px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl border border-black/8 bg-white p-6 text-neutral-700">
          Loading…
        </div>
      </main>
    );
  }

  return (
    <main className="dog-shell px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[1380px] space-y-8">
        <div className="flex flex-col gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="dog-kicker">Dog profile</p>
            <h1 className="text-4xl font-normal uppercase tracking-[-0.06em] text-neutral-950 sm:text-6xl">{dog.name}</h1>
            <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">Rescue name: {dog.rescueName}</p>
          </div>

          <Link href="/dog-adoption" className="rounded-full border border-black px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-black hover:text-white">
            Back to adoption
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-black/8 bg-white">
            <div className="relative aspect-[4/5] bg-neutral-100 lg:aspect-[4/3]">
              <Image
                src={dog.imageUrl}
                alt={dog.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 border border-black/8 bg-white p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                {dog.status}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-600">
                {dog.gender}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-600">
                {dog.age}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Breed and color</p>
              <p className="text-xl font-normal tracking-[-0.03em] text-neutral-950">{dog.breed}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">{dog.color}</p>
              {dog.petName ? <p className="text-sm text-neutral-950">Pet name: {dog.petName}</p> : null}
            </div>

            <p className="max-w-xl text-sm leading-7 text-neutral-600">{dog.description}</p>

            <div className="flex flex-wrap gap-3">
              {dog.status === "available" ? (
                <AdoptDogButton dogId={dog.dogId} />
              ) : (
                <div className="border border-black/8 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  This dog is currently marked as {dog.status}.
                </div>
              )}
              <DogLikeButton dogId={dog.dogId} />
            </div>

            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Profile reference</p>
              <p className="mt-2 text-sm text-neutral-700">{dog.dogId}</p>
            </div>
          </div>
        </div>

        <section className="space-y-5 border-t border-black/8 pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="dog-kicker">Life after adoption</p>
              <h2 className="mt-2 text-3xl font-normal tracking-[-0.05em] text-neutral-950">Post-adoption updates</h2>
            </div>
            <p className="text-sm text-neutral-500">Shared by the admin team</p>
          </div>

          {!updates.length ? (
            <div className="border border-dashed border-black/10 bg-white p-6 text-sm text-neutral-600">
              No post-adoption updates uploaded yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {updates.map((item, index) => (
                <article key={item.updateId} className="border border-black/8 bg-white">
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                      Update {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-sm leading-7 text-neutral-700">{item.caption}</p>
                    {item.collarTag ? <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Collar tag: {item.collarTag}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
