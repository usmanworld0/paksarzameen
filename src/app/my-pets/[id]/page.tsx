import type { Metadata } from "next";
import Image from "next/image";
import { Camera, MapPin, UserRound } from "lucide-react";

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
        <div className="mx-auto max-w-5xl rounded-3xl border border-rose-200 bg-white p-6 text-sm text-rose-700">
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
        <div className="mx-auto max-w-5xl rounded-3xl border border-rose-200 bg-white p-6 text-sm text-rose-700">
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
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="border-t border-slate-200 pt-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h1 className="text-[2.6rem] font-semibold tracking-tight text-slate-900 sm:text-[3rem]">Pet Identity</h1>
              <span className="inline-flex items-center rounded-full bg-slate-500 px-4 py-2 text-[1.25rem] font-semibold text-white">
                Active
              </span>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="grid gap-8 lg:grid-cols-[220px,minmax(0,1fr)]">
                <div className="space-y-5">
                  <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-[#9ca3af] sm:h-44 sm:w-44">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                    <div className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg">
                      <Camera className="h-5 w-5 text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-2 text-center lg:text-left">
                    <p className="text-[1.2rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Owner</p>
                    <div className="inline-flex items-center gap-2 text-[1.8rem] font-medium text-slate-900">
                      <UserRound className="h-5 w-5 text-slate-500" />
                      {ownerName}
                    </div>
                  </div>
                </div>

                <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[1.3rem] text-slate-500">Name</p>
                    <p className="text-[2rem] font-medium text-slate-900">{dog.petName ?? dog.name}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[1.3rem] text-slate-500">Age</p>
                    <p className="text-[2rem] font-medium text-slate-900">{dog.age}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[1.3rem] text-slate-500">Gender</p>
                    <p className="text-[2rem] font-medium text-slate-900">{dog.gender}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[1.3rem] text-slate-500">Breed</p>
                    <p className="text-[2rem] font-medium text-slate-900">{dog.breed}</p>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-[1.3rem] text-slate-500">Location</p>
                    <div className="inline-flex items-center gap-2 text-[1.9rem] font-medium text-slate-900">
                      <MapPin className="h-5 w-5 text-slate-500" />
                      {[dog.area, dog.city].filter(Boolean).join(", ") || "Location to be confirmed"}
                    </div>
                  </div>

                  {dog.description ? (
                    <div className="sm:col-span-2">
                      <p className="text-[1.35rem] leading-7 text-slate-600">{dog.description}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} />
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
