import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Palette, Tag, Venus, Mars } from "lucide-react";

import { AdoptDogButton } from "@/features/dog-adoption/components/AdoptDogButton";
import {
  getDogById,
  getEarTagGlobalConfig,
  listDogPostAdoptionUpdates,
  normalizeDogStatus,
  type DogStatus,
} from "@/lib/dog-adoption";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_CONFIG: Record<DogStatus, { label: string; bg: string; text: string; dot: string }> = {
  available: { label: "Available", bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  adopted: { label: "Adopted", bg: "bg-indigo-100", text: "text-indigo-800", dot: "bg-indigo-500" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);
  if (!dog) return { title: "Dog Not Found" };
  return {
    title: `${dog.name} | Dog Adoption`,
    description: `${dog.name} is currently ${dog.status}. Read details and submit an adoption request.`,
  };
}

export default async function DogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dog = await getDogById(id);
  if (!dog) notFound();

  const [updates, earTagConfig] = await Promise.all([
    listDogPostAdoptionUpdates(dog.dogId),
    getEarTagGlobalConfig(),
  ]);

  const normalizedStatus = normalizeDogStatus(dog.status);
  const cfg = STATUS_CONFIG[normalizedStatus];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Sticky back nav */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-[5%] py-3 backdrop-blur-md">
        <Link
          href="/dog-adoption"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>

      <div className="px-[5%] pb-24 pt-8">
        <div className="mx-auto max-w-6xl space-y-10">

          {/* ── Profile ── */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Image */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg shadow-slate-900/5">
              <div className="relative aspect-[4/3]">
                <Image
                  src={dog.imageUrl}
                  alt={dog.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${cfg.bg} ${cfg.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Dog Profile</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{dog.name}</h1>
                {dog.rescueName && <p className="text-sm text-slate-400">Rescue name: {dog.rescueName}</p>}
                {dog.petName && <p className="text-sm font-semibold text-indigo-600">Pet name: {dog.petName}</p>}
              </div>

              {/* Attribute chips */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Palette, label: "Color", value: dog.color },
                  { icon: Calendar, label: "Age", value: dog.age },
                  {
                    icon: dog.gender?.toLowerCase() === "female" ? Venus : Mars,
                    label: "Gender",
                    value: dog.gender,
                  },
                ]
                  .filter((a) => a.value)
                  .map((attr) => (
                    <div key={attr.label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3.5 py-2.5">
                      <attr.icon className="h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">{attr.label}</p>
                        <p className="text-sm font-semibold text-slate-800">{attr.value}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {(dog.city || dog.area) && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>{[dog.area, dog.city].filter(Boolean).join(", ")}</span>
                </div>
              )}

              {dog.description && (
                <p className="text-sm leading-relaxed text-slate-600">{dog.description}</p>
              )}

              {normalizedStatus === "available" ? (
                <AdoptDogButton dogId={dog.dogId} earTagConfig={earTagConfig} />
              ) : (
                <div className={`rounded-2xl border px-4 py-3.5 ${cfg.bg}`}>
                  <p className={`text-sm font-medium ${cfg.text}`}>
                    This dog is currently <strong>{cfg.label}</strong> and not accepting new adoption requests.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── How Adoption Works (mobile) ── */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:hidden">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-600">How Adoption Works</p>
            <div className="space-y-0">
              {[
                { step: "01", title: "Browse & Choose", desc: "Find a dog that feels right" },
                { step: "02", title: "Customize Ear Tag", desc: "Pick style, color & boundary" },
                { step: "03", title: "Submit Request", desc: "We receive your application" },
                { step: "04", title: "Review & Approval", desc: "Team contacts you via WhatsApp" },
                { step: "05", title: "Welcome Home", desc: "Name your dog and celebrate!" },
              ].map((item, i, arr) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {item.step}
                    </div>
                    {i < arr.length - 1 && <div className="my-1 flex-1 w-px bg-emerald-100" style={{ minHeight: 20 }} />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Life After Adoption ── */}
          <section className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Updates</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Life After Adoption</h2>
              <p className="mt-1.5 text-sm text-slate-500">Post-adoption moments shared by our team.</p>
            </div>

            {updates.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Tag className="h-6 w-6 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-600">No updates yet</p>
                <p className="text-sm text-slate-400">Post-adoption moments will appear here</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {updates.map((item) => (
                  <article
                    key={item.updateId}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-sm leading-relaxed text-slate-700">{item.caption}</p>
                      {item.collarTag && (
                        <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Tag: {item.collarTag}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
