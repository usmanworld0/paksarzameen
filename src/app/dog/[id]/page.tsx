import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdoptDogButton } from "@/features/dog-adoption/components/AdoptDogButton";
import {
  getDogById,
  listDogPostAdoptionUpdates,
  normalizeDogStatus,
  type DogStatus,
} from "@/lib/dog-adoption";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_LABELS: Record<DogStatus, string> = {
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    return {
      title: "Dog Not Found",
    };
  }

  return {
    title: `${dog.name} | Dog Adoption`,
    description: `${dog.name} (${dog.breed}) is currently ${dog.status}. Read details and submit adoption request.`,
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

  return (
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell">
          <Link href="/dog-adoption" className="site-back-link">
            Back To Browse Dogs
          </Link>

          <div className="site-detail__body lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] mt-6">
            <div className="site-detail__media site-detail__media--square">
              <Image
                src={dog.imageUrl}
                alt={dog.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>

            <section className="site-panel site-panel--soft">
              <div className="site-panel__body">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="site-eyebrow">{dog.rescueName}</p>
                    <h1 className="site-display mt-4 max-w-[10ch]">{dog.name}</h1>
                  </div>
                  <span
                    className={`site-badge ${
                      normalizedStatus === "available" ? "site-badge--dark" : "site-badge--muted"
                    }`}
                  >
                    {STATUS_LABELS[normalizedStatus]}
                  </span>
                </div>

                <div className="site-meta-row mt-6">
                  <span>{dog.breed}</span>
                  <span>{dog.color}</span>
                  <span>{dog.age}</span>
                  <span>{dog.gender}</span>
                </div>

                {dog.locationLabel || dog.city || dog.area ? (
                  <div className="site-callout mt-5">
                    Rescue area: {dog.locationLabel ?? [dog.city, dog.area].filter(Boolean).join(", ")}
                  </div>
                ) : null}

                {dog.petName ? (
                  <div className="site-callout mt-5">
                    Pet name: {dog.petName}
                  </div>
                ) : null}

                <p className="site-copy mt-6">{dog.description}</p>

                <div className="site-divider mt-6 pt-6">
                  {normalizedStatus === "available" ? (
                    <AdoptDogButton dogId={dog.dogId} />
                  ) : (
                    <div className="site-callout">
                      This profile is currently marked {STATUS_LABELS[normalizedStatus].toLowerCase()} and is not available for a new request.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="site-section">
            <div>
              <p className="site-eyebrow">After adoption</p>
              <h2 className="site-heading site-heading--sm mt-3">Post-Adoption Moments</h2>
            </div>

            {!updates.length ? (
              <div className="site-empty mt-6">No post-adoption updates yet.</div>
            ) : (
              <div className="site-grid site-grid--three mt-6">
                {updates.map((item) => (
                  <article key={item.updateId} className="site-card site-card--rounded overflow-hidden">
                    <div className="site-detail__media site-detail__media--landscape">
                      <Image
                        src={item.imageUrl}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="site-card__body">
                      <p className="site-copy site-copy--sm">{item.caption}</p>
                      {item.collarTag ? (
                        <div className="site-meta-row mt-5">
                          <span>Collar tag: {item.collarTag}</span>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}
