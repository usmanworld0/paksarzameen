import type { Metadata } from "next";
import Image from "next/image";
import { IdCard, MapPin, UserRound } from "lucide-react";

import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import {
  getDogById,
  getEarTagGlobalConfig,
  listDogPostAdoptionUpdates,
  listMyAdoptionRequests,
} from "@/lib/dog-adoption";
import { listDogMessages } from "@/lib/dog-messages";
import ChatBox from "@/components/dog/ChatBox";
import { MyPetPersonalizationPanel } from "@/features/dog-adoption/components/MyPetPersonalizationPanel";

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
      <main className="min-h-screen bg-[#f7f6f2] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-rose-200 bg-white p-6 text-sm text-rose-700">
          Dog not found.
        </div>
      </main>
    );
  }

  const myRequests = await listMyAdoptionRequests(session.id);
  const approvedRequest = myRequests.find((request) => request.dogId === id && request.status === "approved");

  if (!approvedRequest) {
    return (
      <main className="min-h-screen bg-[#f7f6f2] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-rose-200 bg-white p-6 text-sm text-rose-700">
          You can only access pets that are officially approved and adopted by your account.
        </div>
      </main>
    );
  }

  const updates = await listDogPostAdoptionUpdates(id);
  const messages = await listDogMessages(id);
  const earTagConfig = await getEarTagGlobalConfig();
  const ownerName = formatOwnerName(approvedRequest.applicantName ?? approvedRequest.userName, session.email);

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="border-b border-slate-200 pb-7">
            <div className="grid gap-6 lg:grid-cols-[340px,minmax(0,1fr)] lg:items-start">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-[1.8rem] font-semibold tracking-tight text-slate-900">
                  <IdCard className="h-5 w-5 text-slate-700" />
                  Pet Identity
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-500 px-4 py-2 text-[1.2rem] font-semibold text-white">
                  Active Profile
                </span>
              </div>

              <div>
                <h1 className="text-[3rem] font-semibold tracking-tight text-slate-900">Customize Pet Tag</h1>
                <p className="mt-2 max-w-4xl text-[1.55rem] leading-7 text-slate-600">
                  Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking capabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[340px,minmax(0,1fr)] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white p-4 sm:p-6 lg:p-0">
                <div className="grid gap-6 sm:grid-cols-[120px,minmax(0,1fr)] lg:grid-cols-1">
                  <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full bg-[#9ca3af] sm:h-40 sm:w-40 lg:mx-0">
                    <Image src={dog.imageUrl} alt={dog.name} fill sizes="160px" className="object-cover" />
                  </div>

                  <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[1.3rem] text-slate-500">Name</p>
                      <p className="text-[1.9rem] font-medium text-slate-900">{dog.petName ?? dog.name}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[1.3rem] text-slate-500">Age</p>
                      <p className="text-[1.9rem] font-medium text-slate-900">{dog.age}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[1.3rem] text-slate-500">Gender</p>
                      <p className="text-[1.9rem] font-medium text-slate-900">{dog.gender}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[1.3rem] text-slate-500">Breed</p>
                      <p className="text-[1.9rem] font-medium text-slate-900">{dog.breed}</p>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-[1.3rem] text-slate-500">Location</p>
                      <div className="inline-flex items-center gap-2 text-[1.8rem] font-medium text-slate-900">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {[dog.area, dog.city].filter(Boolean).join(", ") || "Location to be confirmed"}
                      </div>
                    </div>
                  </div>
                </div>

                {dog.description ? (
                  <p className="mt-5 text-[1.35rem] leading-7 text-slate-600">{dog.description}</p>
                ) : null}
              </div>

              <div>
                <p className="mb-3 text-[1.2rem] font-semibold uppercase tracking-[0.12em] text-slate-700">
                  Owner Information
                </p>
                <div className="flex items-center gap-4 rounded-[18px] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[1.6rem] font-semibold text-slate-900">{ownerName}</p>
                    <p className="text-[1.25rem] text-slate-500">Primary Caretaker</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} showHeader={false} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-4">
              <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900">Post-adoption Updates</h2>
              <p className="mt-1 text-[1.35rem] text-slate-500">Shared moments from your pet's journey after adoption.</p>
            </div>

            {updates.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-[1.4rem] text-slate-500">
                No updates yet for this pet.
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <article key={update.updateId} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="relative h-48 w-full bg-slate-100">
                      <Image src={update.imageUrl} alt={update.caption} fill sizes="480px" className="object-cover" />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-[1.45rem] leading-7 text-slate-700">{update.caption}</p>
                      <p className="text-[1.2rem] text-slate-400">
                        Uploaded by {update.uploadedBy} | {new Date(update.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-4">
              <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900">Messages</h2>
              <p className="mt-1 text-[1.35rem] text-slate-500">Stay connected with the team about your pet.</p>
            </div>
            <ChatBox dogId={id} initialMessages={messages} />
          </div>
        </div>
      </section>
    </main>
  );
}
