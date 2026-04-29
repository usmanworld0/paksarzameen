"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DogLikeButton } from "../../components/DogLikeButton";
import { loadDogCatalog, type DogRecord } from "../../lib/dogApi";
import { useLikedDogs } from "../../lib/liked-dogs";

export default function LikedDogsPage() {
  const { likedDogIds } = useLikedDogs();
  const [dogs, setDogs] = useState<DogRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const records = await loadDogCatalog();
        if (mounted) {
          setDogs(records);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const likedDogs = useMemo(() => {
    const likedSet = new Set(likedDogIds);
    return dogs.filter((dog) => likedSet.has(dog.dogId));
  }, [dogs, likedDogIds]);

  return (
    <main className="dog-shell px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[1380px] space-y-8">
        <div className="space-y-3 border-b border-black/8 pb-5 text-center">
          <p className="dog-kicker">Saved dogs</p>
          <h1 className="text-4xl font-normal uppercase tracking-[-0.06em] text-neutral-950 sm:text-6xl">Your liked dogs</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-neutral-600">
            This list stays in your browser and follows your token on this device.
          </p>
        </div>

        {error ? <div className="border border-black/8 bg-white p-6 text-neutral-700">{error}</div> : null}

        {!error && !likedDogIds.length ? (
          <div className="border border-dashed border-black/10 bg-white p-8 text-center text-neutral-600">
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">No likes yet</p>
            <h2 className="mt-3 text-2xl font-normal tracking-[-0.04em] text-neutral-950">Save dogs from any card to build this list.</h2>
            <Link href="/dog-adoption" className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
              Browse dogs
            </Link>
          </div>
        ) : null}

        {!error && likedDogIds.length ? (
          likedDogs.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {likedDogs.map((dog) => (
                <article key={dog.dogId} className="border border-black/8 bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <Link href={`/dog/${dog.dogId}`} className="absolute inset-0 block">
                      <Image src={dog.imageUrl} alt={dog.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                    </Link>
                    <div className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white">
                      {dog.status}
                    </div>
                    <div className="absolute right-4 top-4 z-10">
                      <DogLikeButton dogId={dog.dogId} compact />
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <Link href={`/dog/${dog.dogId}`} className="block">
                      <h2 className="text-2xl font-normal tracking-[-0.04em] text-neutral-950">{dog.name}</h2>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                        {dog.breed} · {dog.age}
                      </p>
                    </Link>
                    <p className="text-sm leading-7 text-neutral-600">{dog.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-black/10 bg-white p-8 text-center text-neutral-600">
              <p className="text-sm leading-7">Your liked list is loading from the live catalog. Try refreshing in a moment.</p>
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}