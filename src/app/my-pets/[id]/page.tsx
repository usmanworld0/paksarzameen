import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IdCard, MapPin, UserRound } from "lucide-react";

import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import {
  getDogById,
  listDogPostAdoptionUpdates,
  listMyAdoptionRequests,
} from "@/lib/dog-adoption";
import { listDogMessages } from "@/lib/dog-messages";
import ChatBox from "@/components/dog/ChatBox";

export const dynamic = "force-dynamic";

function formatOwnerName(raw: string | null | undefined, email: string) {
  const value = raw?.trim();
  if (value) return value;

  const base = email.split("@")[0] ?? "Pet Owner";
  return base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);
  return {
    title: dog ? `My Pet | ${dog.name}` : "My Pet",
  };
}

export default async function MyPetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuthenticatedUser();
  if (!session?.id) return null;

  const { id } = await params;
  const dog = await getDogById(id);
  if (!dog) {
    return (
      <main className="min-h-screen bg-[#f3f3ee]">
        <div className="px-[5%] pb-20 pt-28">
          <div className="mx-auto max-w-screen-xl">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              Dog not found.
            </div>
          </div>
        </div>
      </main>
    );
  }

  const myRequests = await listMyAdoptionRequests(session.id);
  const approvedRequest = myRequests.find((request) => request.dogId === id && request.status === "approved");

  if (!approvedRequest) {
    return (
      <main className="min-h-screen bg-[#f3f3ee]">
        <div className="px-[5%] pb-20 pt-28">
          <div className="mx-auto max-w-screen-xl">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              You can only access pets that are officially approved and adopted by your account.
            </div>
          </div>
        </div>
      </main>
    );
  }

  const updates = await listDogPostAdoptionUpdates(id);
  const messages = await listDogMessages(id);
  const ownerName = formatOwnerName(approvedRequest.applicantName ?? approvedRequest.userName, session.email);

  return (
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">My Pet</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            {dog.petName ?? dog.name}
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Manage your adopted dog&apos;s identity, tag, and stay connected with the team.
          </p>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl space-y-8">

          {/* Pet Identity Card */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E5] pb-5">
              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-[#707072]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Pet Identity</p>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[200px,minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl bg-[#f3f3ee] lg:mx-0">
                  <Image src={dog.imageUrl} alt={dog.name} fill sizes="160px" className="object-cover" />
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Owner</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#E5E5E5] text-[#707072]">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tighter text-[#111111]">{ownerName}</p>
                      <p className="text-xs font-medium text-[#707072]">Primary caretaker</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Name</p>
                  <p className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">{dog.petName ?? dog.name}</p>
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Age</p>
                  <p className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">{dog.age}</p>
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Gender</p>
                  <p className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">{dog.gender}</p>
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Color</p>
                  <p className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">{dog.color}</p>
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Location</p>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#707072]" />
                    <p className="text-xl font-black tracking-tighter text-[#111111]">
                      {[dog.area, dog.city].filter(Boolean).join(", ") || "Location to be confirmed"}
                    </p>
                  </div>
                </div>

                {dog.rescueName && dog.rescueName !== dog.name ? (
                  <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Rescue Name</p>
                    <p className="mt-1 text-lg font-black tracking-tighter text-[#111111]">{dog.rescueName}</p>
                  </div>
                ) : null}

                {dog.description ? (
                  <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Notes</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-[#707072]">{dog.description}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 border-t border-[#E5E5E5] pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Customization</p>
              <h2 className="mt-2 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Customize Pet Tag</h2>
              <p className="mt-1 max-w-2xl text-sm font-medium text-[#707072]">
                Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking.
              </p>
              <div className="mt-5">
                <Link
                  href={`/my-pets/${id}/customize`}
                  className="inline-flex items-center justify-center rounded-xl bg-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                >
                  Next
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Post-adoption Updates */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Journey</p>
              <h2 className="mt-2 text-2xl font-black tracking-tighter text-[#111111]">Post-adoption Updates</h2>
              <p className="mt-1 text-sm font-medium text-[#707072]">Shared moments from your pet&apos;s journey after adoption.</p>

              <div className="mt-5">
                {updates.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-[#f3f3ee] px-5 py-10 text-center">
                    <p className="text-sm font-medium text-[#707072]">No updates yet for this pet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <article key={update.updateId} className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
                        <div className="relative h-48 w-full bg-[#f3f3ee]">
                          <Image src={update.imageUrl} alt={update.caption} fill sizes="480px" className="object-cover" />
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="text-sm font-medium leading-relaxed text-[#707072]">{update.caption}</p>
                          <p className="text-xs font-medium text-[#bbb]">
                            Uploaded by {update.uploadedBy} | {new Date(update.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Communication</p>
              <h2 className="mt-2 text-2xl font-black tracking-tighter text-[#111111]">Messages</h2>
              <p className="mt-1 text-sm font-medium text-[#707072]">Stay connected with the team about your pet.</p>
              <div className="mt-5">
                <ChatBox dogId={id} initialMessages={messages} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
