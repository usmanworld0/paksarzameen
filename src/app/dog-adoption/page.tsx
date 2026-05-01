import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CompactPageHeader } from "@/components/layout/CompactPageHeader";
import { DogMarketplace } from "@/features/dog-adoption/components/DogMarketplace";
import { hasDatabaseConnection } from "@/lib/db";
import { listAdoptedDogsWithOwners, listDogs } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dog Adoption",
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

  return (
    <main className="site-page">
      <CompactPageHeader
        title="Adopt A Dog."
        description="Browse rescue dogs and submit an adoption request."
      />

      <section className="site-section">
        <div className="site-shell">
          {error ? <div className="site-callout site-callout--error">{error}</div> : null}

          {!error && !dogs.length ? (
            <div className="site-empty">No dogs are listed yet. Please check back soon.</div>
          ) : null}

          {!error && dogs.length ? <DogMarketplace dogs={dogs} /> : null}

          {!error ? (
            <section className="site-section">
              <div>
                <p className="site-eyebrow">Success stories</p>
                <h2 className="site-heading site-heading--sm mt-3">Now In Loving Homes</h2>
              </div>

              {!adoptedDogs.length ? (
                <div className="site-empty mt-6">No adopted dog records are available yet.</div>
              ) : (
                <div className="site-grid site-grid--three mt-6">
                  {adoptedDogs.map((dog) => (
                    <article key={dog.dogId} className="site-card site-card--rounded overflow-hidden">
                      <div className="site-detail__media site-detail__media--landscape">
                        <Image
                          src={dog.imageUrl}
                          alt={dog.dogName}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="site-card__body">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="site-card__eyebrow">{dog.rescueName}</p>
                            <h3 className="site-card__title">{dog.dogName}</h3>
                          </div>
                          <span className="site-badge site-badge--dark">Adopted</span>
                        </div>
                        <p className="site-card__text mt-4">
                          {dog.breed} / {dog.age} / {dog.gender}
                        </p>
                        <div className="site-meta-row mt-5">
                          <span>Owner: {dog.ownerName ?? "N/A"}</span>
                          <span>Pet name: {dog.petName ?? "N/A"}</span>
                        </div>
                        <Link href={`/dog/${dog.dogId}`} className="site-card-link mt-5">
                          View Profile
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
