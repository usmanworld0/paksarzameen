import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Shield, Star, Users } from "lucide-react";

import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { DogLocationMap } from "@/features/dog-adoption/components/DogLocationMap";
import { DogListingsMap } from "@/features/dog-adoption/components/DogListingsMap";
import { hasDatabaseConnection } from "@/lib/db";
import { listAdoptedDogsWithOwners, listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption | Find Your Furever Friend",
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

  const availableCount = dogs.filter((d) => d.status === "available").length;
  const adoptedCount = dogs.filter((d) => d.status === "adopted").length;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-[5%] pb-20 pt-36">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-16 lg:text-left">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <Heart className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                Rescue · Adopt · Love
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Every Dog Deserves
                <br />
                <span className="text-emerald-400">A Loving Home</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-emerald-100/80 sm:text-lg">
                Give a rescued dog a second chance at life. Browse our available dogs, submit an adoption request, and start an unforgettable journey together.
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-2 lg:justify-start">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white">{availableCount}</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-300/80">Available</span>
                </div>
                <div className="h-10 w-px self-center bg-emerald-700" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white">{adoptedCount}</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-300/80">Adopted</span>
                </div>
                <div className="h-10 w-px self-center bg-emerald-700" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white">PKR 5k</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-300/80">Fee Only</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2 lg:justify-start">
                <a
                  href="#available-dogs"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400"
                >
                  <Heart className="h-4 w-4" /> Find My Dog
                </a>
                <a
                  href="#dogs-map"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4" /> View on Map
                </a>
              </div>
            </div>

            {/* Adoption process — desktop */}
            <div className="mt-10 hidden shrink-0 lg:mt-0 lg:block lg:w-80">
              <div className="space-y-4 rounded-3xl border border-emerald-700/40 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Adoption Process</p>
                {[
                  { step: "01", title: "Browse Dogs", desc: "Explore available rescue dogs" },
                  { step: "02", title: "Customize Tag", desc: "Pick ear tag style, color & boundary" },
                  { step: "03", title: "Submit Request", desc: "Send your adoption application" },
                  { step: "04", title: "Get Approved", desc: "Team confirms via WhatsApp" },
                  { step: "05", title: "Welcome Home", desc: "Name your new family member" },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                        {item.step}
                      </div>
                      {i < arr.length - 1 && <div className="mt-1 h-6 w-px bg-emerald-700/50" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-emerald-300/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="border-b border-slate-100 bg-slate-50 px-[5%] py-4">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: Shield, text: "Verified Rescue Network" },
            { icon: Heart, text: "Compassionate Care" },
            { icon: Users, text: "Community Supported" },
            { icon: Star, text: "Trusted by Families" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Icon className="h-4 w-4 text-emerald-600" />
              {text}
            </div>
          ))}
        </div>
      </section>

      <div className="px-[5%] pb-24">
        <div className="mx-auto max-w-screen-xl space-y-20 pt-16">

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          )}

          {/* ── Available Dogs ── */}
          <section id="available-dogs" className="scroll-mt-24 space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Browse & Adopt</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Dogs Looking for Homes
              </h2>
              <p className="mt-2 text-slate-500">Each dog is checked and ready for a forever family</p>
            </div>
            {!error && !dogs.length ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <Heart className="h-10 w-10 text-slate-300" />
                <p className="font-semibold text-slate-600">No dogs listed yet</p>
                <p className="text-sm text-slate-400">Check back soon — new rescues added regularly</p>
              </div>
            ) : (
              <DogMarketplace dogs={dogs} />
            )}
          </section>

          {/* ── Dogs on Map ── */}
          {!error && dogs.length > 0 && (
            <section id="dogs-map" className="scroll-mt-24 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Find Near You</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Dogs on the Map</h2>
                <p className="mt-2 text-slate-500">
                  See where each listed dog is located — tap a marker to view their profile
                </p>
                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-4">
                  {[
                    { color: "bg-emerald-500", label: "Available" },
                    { color: "bg-amber-400", label: "Pending" },
                    { color: "bg-indigo-500", label: "Adopted" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <DogListingsMap dogs={dogs} />
            </section>
          )}

          {/* ── Rescue Hotspots Map ── */}
          <section id="rescue-map" className="scroll-mt-24 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Rescue Hotspots</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Rescue Location Map</h2>
              <p className="mt-2 text-slate-500">Active rescue hotspots in the area — tap a marker for details</p>
            </div>
            <DogLocationMap />
          </section>

          {/* ── Adopted Dogs ── */}
          {!error && (
            <section className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Success Stories</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Settled Into Loving Homes
                </h2>
                <p className="mt-2 text-slate-500">Dogs who found their forever families</p>
              </div>
              {!adoptedDogs.length ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                  No adopted records yet — be the first success story!
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {adoptedDogs.map((dog) => (
                    <article
                      key={dog.dogId}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <Image
                          src={dog.imageUrl}
                          alt={dog.dogName}
                          fill
                          sizes="(max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                          Adopted
                        </span>
                      </div>
                      <div className="space-y-2.5 p-5">
                        <div>
                          <h3 className="truncate text-lg font-bold text-slate-900">{dog.dogName}</h3>
                          <p className="text-xs text-slate-400">Rescue: {dog.rescueName}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[dog.breed, dog.color, dog.age, dog.gender].filter(Boolean).map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 pt-2.5 space-y-1">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Owner:</span> {dog.ownerName ?? "Details unavailable"}
                          </p>
                          {dog.petName && (
                            <p className="text-sm font-semibold text-indigo-600">Pet name: {dog.petName}</p>
                          )}
                        </div>
                        <Link
                          href={`/dog/${dog.dogId}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
                        >
                          View profile →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Bottom CTA ── */}
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 p-8 text-center sm:p-12">
            <Heart className="mx-auto mb-4 h-10 w-10 fill-emerald-400 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Change a Life?</h2>
            <p className="mx-auto mt-3 max-w-md text-emerald-200/80">
              Adoption fee is only PKR 5,000. Every dog gets an ear tag ID, care guidance, and a lifetime of gratitude.
            </p>
            <a
              href="#available-dogs"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/50 transition hover:bg-emerald-400"
            >
              <Heart className="h-4 w-4" /> Start Your Adoption Journey
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}
