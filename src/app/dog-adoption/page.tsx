import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Shield, Star, Users, ArrowRight, Zap } from "lucide-react";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-teal-300/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[60px]" />

        <div className="relative mx-auto max-w-screen-xl px-[5%] pb-28 pt-36 text-center">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-sm">
            <Heart className="h-3 w-3 fill-emerald-400 text-emerald-400" />
            Rescue · Adopt · Love
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Every Dog Deserves{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              A Loving Home
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-emerald-100/70 sm:text-lg">
            Give a rescued dog a second chance at life. Browse available rescues, customise your ear tag, and start an unforgettable journey together.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-extrabold text-white">{availableCount}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Available</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-extrabold text-white">{adoptedCount}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Adopted</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-extrabold text-white">PKR 5k</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Fee Only</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#available-dogs"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-300"
            >
              <Heart className="h-4 w-4" />
              Find My Dog
            </a>
            <a
              href="#explore-maps"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <MapPin className="h-4 w-4" />
              Explore Map
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Curved bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 56 C360 0 1080 0 1440 56 V56 H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="border-b border-slate-100 bg-white px-[5%] py-5">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-6 sm:gap-12">
          {[
            { icon: Shield, text: "Verified Rescue Network" },
            { icon: Zap, text: "Fast Approvals" },
            { icon: Users, text: "Community Supported" },
            { icon: Star, text: "Trusted by Families" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm font-semibold text-slate-500">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                <Icon className="h-4 w-4 text-emerald-600" />
              </span>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="px-[5%] pb-28">
        <div className="mx-auto max-w-screen-xl space-y-24 pt-20">

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {/* ── Explore Maps (first) ── */}
          <section id="explore-maps" className="scroll-mt-24">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Explore</p>
              <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Dogs &amp; Rescue Spots Near You
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Browse listed dogs on the map or discover active rescue hotspots in your area.
              </p>
            </div>

            {/* Map legend */}
            <div className="mb-5 flex flex-wrap justify-center gap-4">
              {[
                { color: "bg-emerald-500", label: "Available" },
                { color: "bg-amber-400", label: "Pending" },
                { color: "bg-indigo-500", label: "Adopted" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Two maps side by side */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Listed dogs map */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <MapPin className="h-4 w-4 text-emerald-700" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Listed Dogs</p>
                    <p className="text-xs text-slate-400">Tap a marker to view their profile</p>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {dogs.length} dogs
                  </span>
                </div>
                <div className="h-[400px]">
                  {!error && dogs.length > 0 ? (
                    <DogListingsMap dogs={dogs} />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-400">
                      No dogs with locations to show yet
                    </div>
                  )}
                </div>
              </div>

              {/* Rescue hotspots map */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                    <Heart className="h-4 w-4 text-rose-600" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Rescue Hotspots</p>
                    <p className="text-xs text-slate-400">Active rescue areas — tap for details</p>
                  </div>
                </div>
                <div className="h-[400px]">
                  <DogLocationMap />
                </div>
              </div>
            </div>
          </section>

          {/* ── Available Dogs ── */}
          <section id="available-dogs" className="scroll-mt-24">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Browse &amp; Adopt</p>
              <div className="mt-1.5 flex flex-wrap items-end gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Dogs Looking for Homes
                </h2>
                {availableCount > 0 && (
                  <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                    {availableCount} available
                  </span>
                )}
              </div>
              <p className="mt-2 text-slate-500">Each dog is health-checked and ready for their forever family</p>
            </div>

            {!error && !dogs.length ? (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Heart className="h-7 w-7 text-slate-300" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700">No dogs listed yet</p>
                  <p className="mt-1 text-sm text-slate-400">Check back soon — new rescues added regularly</p>
                </div>
              </div>
            ) : (
              <DogMarketplace dogs={dogs} />
            )}
          </section>

          {/* ── Adopted Dogs / Success Stories ── */}
          {!error && adoptedDogs.length > 0 && (
            <section className="scroll-mt-24">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Success Stories</p>
                <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Happy in Their Forever Homes
                </h2>
                <p className="mt-2 text-slate-500">Dogs who found their families — and the families who found them</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {adoptedDogs.map((dog) => (
                  <article
                    key={dog.dogId}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={dog.imageUrl}
                        alt={dog.dogName}
                        fill
                        sizes="(max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <h3 className="text-lg font-extrabold text-white drop-shadow">{dog.dogName}</h3>
                        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
                          Adopted ✓
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 p-5">
                      <p className="text-xs text-slate-400">Rescue: {dog.rescueName}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[dog.breed, dog.color, dog.age, dog.gender].filter(Boolean).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-xs text-slate-500">
                            Owner: <span className="font-semibold text-slate-800">{dog.ownerName ?? "—"}</span>
                          </p>
                          {dog.petName && (
                            <p className="mt-0.5 text-xs font-semibold text-indigo-600">&ldquo;{dog.petName}&rdquo;</p>
                          )}
                        </div>
                        <Link
                          href={`/dog/${dog.dogId}`}
                          className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-700"
                        >
                          Profile <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── How It Works ── */}
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="grid gap-0 lg:grid-cols-2">
              {/* Left: steps */}
              <div className="space-y-6 p-8 sm:p-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Process</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">How Adoption Works</h2>
                </div>
                <ol className="space-y-5">
                  {[
                    { n: "01", title: "Browse Dogs", desc: "Explore available rescue dogs and find your match" },
                    { n: "02", title: "Customise Ear Tag", desc: "Pick style, color & reflective boundary" },
                    { n: "03", title: "Submit Request", desc: "Fill out your details — no account needed" },
                    { n: "04", title: "Get Approved", desc: "Team confirms via WhatsApp within 24 hrs" },
                    { n: "05", title: "Welcome Home", desc: "Pay PKR 5,000 fee and meet your new companion" },
                  ].map((step, i, arr) => (
                    <li key={step.n} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-extrabold text-emerald-400">
                          {step.n}
                        </span>
                        {i < arr.length - 1 && <div className="mt-1 h-5 w-px bg-emerald-700/40" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-bold text-white">{step.title}</p>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-center sm:p-12">
                <Heart className="h-12 w-12 fill-white/30 text-white" />
                <div>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to Change a Life?</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-white/80">
                    Adoption fee is only PKR 5,000. Every dog gets an ear tag ID and a lifetime of love.
                  </p>
                </div>
                <a
                  href="#available-dogs"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-800 shadow-xl transition hover:bg-emerald-50"
                >
                  <Heart className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                  Start Your Adoption Journey
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
