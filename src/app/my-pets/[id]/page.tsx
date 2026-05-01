import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ChatBox from "@/components/dog/ChatBox";
import { MyPetPersonalizationPanel } from "@/features/dog-adoption/components/MyPetPersonalizationPanel";
import {
  getDogById,
  getEarTagGlobalConfig,
  listDogPostAdoptionUpdates,
  listMyAdoptionRequests,
} from "@/lib/dog-adoption";
import { listDogMessages } from "@/lib/dog-messages";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);
  return {
    title: dog ? `My Pet · ${dog.name}` : "My Pet",
  };
}

export default async function MyPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuthenticatedUser();
  if (!session?.id) return null;

  const { id } = await params;
  const dog = await getDogById(id);
  if (!dog) {
    return (
      <main className="site-page">
        <article className="site-detail">
          <div className="site-shell--narrow">
            <div className="site-empty">Dog not found.</div>
          </div>
        </article>
      </main>
    );
  }

  const myRequests = await listMyAdoptionRequests(session.id);
  const canAccessPet = myRequests.some(
    (request) => request.dogId === id && request.status === "approved",
  );

  if (!canAccessPet) {
    return (
      <main className="site-page">
        <article className="site-detail">
          <div className="site-shell--narrow">
            <div className="site-callout site-callout--error">
              You can only access pets that are officially approved and adopted by your account.
            </div>
          </div>
        </article>
      </main>
    );
  }

  const updates = await listDogPostAdoptionUpdates(id);
  const messages = await listDogMessages(id);
  const earTagConfig = await getEarTagGlobalConfig();

  return (
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell--narrow">
          <Link href="/my-adoptions" className="site-back-link">
            Back To My Adoptions
          </Link>

          <header className="site-panel site-panel--rounded mt-6">
            <div className="site-panel__body">
              <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-center">
                <div className="site-detail__media site-detail__media--square">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="site-eyebrow">{dog.rescueName}</p>
                  <h1 className="site-display mt-4 max-w-[10ch]">{dog.name}</h1>
                  <div className="site-meta-row mt-5">
                    <span>{dog.breed}</span>
                    <span>{dog.color}</span>
                    <span>{dog.age}</span>
                    <span>{dog.gender}</span>
                  </div>
                  {dog.petName ? (
                    <div className="site-callout mt-5">Pet name: {dog.petName}</div>
                  ) : null}
                  <p className="site-copy mt-5">{dog.description}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="site-section">
            <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} />
          </section>

          <section className="site-grid site-grid--two">
            <article className="site-panel site-panel--rounded">
              <div className="site-panel__body">
                <p className="site-card__eyebrow">Updates</p>
                <h2 className="site-heading site-heading--sm mt-3">Updates</h2>

                {updates.length === 0 ? (
                  <div className="site-empty mt-6">No updates have been added yet.</div>
                ) : (
                  <div className="site-stack mt-6">
                    {updates.map((update) => (
                      <article key={update.updateId} className="site-card site-card--rounded overflow-hidden">
                        <div className="site-detail__media site-detail__media--landscape">
                          <Image
                            src={update.imageUrl}
                            alt={update.caption}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="site-card__body">
                          <p className="site-copy site-copy--sm text-[#111111]">{update.caption}</p>
                          <div className="site-meta-row mt-4">
                            <span>Uploaded by {update.uploadedBy}</span>
                            <span>{new Date(update.uploadedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </article>

            <article className="site-panel site-panel--rounded">
              <div className="site-panel__body">
                <p className="site-card__eyebrow">Messages</p>
                <h2 className="site-heading site-heading--sm mt-3">Messages</h2>
                <div className="mt-6">
                  <ChatBox dogId={id} initialMessages={messages} />
                </div>
              </div>
            </article>
          </section>
        </div>
      </article>
    </main>
  );
}
