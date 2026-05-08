import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Palette, Venus, Mars } from "lucide-react";

import {
  getDogById,
  listDogPostAdoptionUpdates,
  normalizeDogStatus,
  type DogStatus,
} from "@/lib/dog-adoption";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STORE_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const STATUS_CONFIG: Record<
  "available" | "adopted",
  {
    label: string;
    pill: string;
    copy: string;
  }
> = {
  available: {
    label: "Available",
    pill: "border-black/10 bg-white text-neutral-700",
    copy: "Open for adoption requests.",
  },
  adopted: {
    label: "Adopted",
    pill: "border-black/10 bg-[#f7f4ee] text-neutral-500",
    copy: "This dog has already found a home.",
  },
};

function getPublicDogStatus(status: DogStatus): "available" | "adopted" {
  return status === "adopted" ? "adopted" : "available";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    return { title: "Dog Not Found" };
  }

  return {
    title: `${dog.name} | Dog Adoption`,
    description: `${dog.name} is currently ${dog.status}. Read details and submit an adoption request.`,
  };
}

export default async function DogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    notFound();
  }

  const updates = await listDogPostAdoptionUpdates(dog.dogId);

  const normalizedStatus = normalizeDogStatus(dog.status);
  const publicStatus = getPublicDogStatus(normalizedStatus);
  const statusConfig = STATUS_CONFIG[publicStatus];
  const locationLabel = [dog.area, dog.city].filter(Boolean).join(", ");

  const quickFacts = [
    {
      label: "Age",
      value: dog.age,
      icon: Calendar,
    },
    dog.color
      ? {
          label: "Color",
          value: dog.color,
          icon: Palette,
        }
      : null,
    dog.gender
      ? {
          label: "Gender",
          value: dog.gender,
          icon: dog.gender.toLowerCase() === "female" ? Venus : Mars,
        }
      : null,
    locationLabel
      ? {
          label: "Location",
          value: locationLabel,
          icon: MapPin,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof Calendar;
  }>;

  return (
    <main
      className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_58%,#f6f2ec_100%)] pt-[72px] text-neutral-950"
      style={{ fontFamily: STORE_FONT_FAMILY }}
    >
      <section className="border-b border-black/6 bg-[#fcfbf8]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-3 px-5 py-5 sm:px-8 lg:px-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            <Link href="/dog-adoption" className="transition-colors hover:text-neutral-950">
              Dog Adoption
            </Link>
            <span>/</span>
            <span className="text-neutral-700">{dog.name}</span>
          </div>

          <Link
            href="/dog-adoption"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to listings
          </Link>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-[32px] border border-black/8 bg-[#f5f2ed] shadow-[0_18px_48px_rgba(17,17,17,0.045)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-[9px] font-normal uppercase tracking-[0.28em] text-neutral-500">
                {dog.breed || "Rescue profile"}
              </p>
              <h1 className="mt-4 text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.88] tracking-[-0.08em] text-neutral-950">
                {dog.name}
              </h1>

              {dog.rescueName && dog.rescueName !== dog.name ? (
                <p className="mt-4 text-sm text-neutral-500">{dog.rescueName}</p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${statusConfig.pill}`}
                >
                  {statusConfig.label}
                </span>
                {locationLabel ? (
                  <span className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {locationLabel}
                  </span>
                ) : null}
              </div>

              {dog.description ? (
                <p className="mt-8 text-[15px] leading-8 text-neutral-600">{dog.description}</p>
              ) : null}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-[22px] border border-black/8 bg-white p-4">
                    <fact.icon className="h-5 w-5 text-neutral-500" />
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-neutral-950">{fact.value}</p>
                  </div>
                ))}

                <div className="rounded-[22px] border border-black/8 bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                    Adoption Status
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-neutral-950">{statusConfig.copy}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-black/8 pt-8">
                {publicStatus === "available" ? (
                  <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                          Adoption Request
                        </p>
                        <h2 className="mt-4 text-[clamp(2rem,4vw,3.3rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
                          Request this dog
                        </h2>
                      </div>
                      <div className="rounded-full border border-black/8 bg-[#fcfbf8] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                        Adoption fee PKR 5,000
                      </div>
                    </div>
                    <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                      {statusConfig.copy}
                    </p>
                    <Link
                      href={`/dog/${dog.dogId}/adopt`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
                    >
                      Request this dog
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                      Adoption
                    </p>
                    <h2 className="mt-4 text-[clamp(2rem,4vw,3.3rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
                      This profile is no longer accepting a new request.
                    </h2>
                    <p className="mt-4 text-[15px] leading-8 text-neutral-600">{statusConfig.copy}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/6 bg-[#fbfaf8] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[9px] font-normal uppercase tracking-[0.28em] text-neutral-500">
                After Adoption
              </p>
              <h2 className="mt-4 text-[clamp(2.3rem,4vw,4.4rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">
                Post-adoption updates.
              </h2>
            </div>
            <div className="rounded-full border border-black/8 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              {updates.length} update{updates.length === 1 ? "" : "s"}
            </div>
          </div>

          {updates.length === 0 ? (
            <div className="rounded-[28px] border border-black/8 bg-white px-6 py-16 text-center shadow-[0_18px_48px_rgba(17,17,17,0.045)]">
              <p className="text-xl tracking-[-0.03em] text-neutral-950">No updates have been shared yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {updates.map((item) => (
                <article key={item.updateId} className="group flex h-full flex-col">
                  <div className="relative overflow-hidden rounded-[28px] bg-[#f4f0ea]">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-[1rem] leading-7 tracking-[-0.01em] text-neutral-900">{item.caption}</p>
                    {item.collarTag ? (
                      <p className="mt-2 text-[0.78rem] uppercase tracking-[0.16em] text-neutral-400">
                        Tag {item.collarTag}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
