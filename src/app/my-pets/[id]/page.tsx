import type { Metadata } from "next";
import Image from "next/image";

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);
  return {
    title: dog ? `My Pet · ${dog.name}` : "My Pet",
  };
}

export default async function MyPetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuthenticatedUser();
  if (!session?.id) return null;

  const { id } = await params;
  const dog = await getDogById(id);
  if (!dog) return (
    <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">Dog not found.</div>
    </main>
  );

  const myRequests = await listMyAdoptionRequests(session.id);
  const canAccessPet = myRequests.some((request) => request.dogId === id && request.status === "approved");

  if (!canAccessPet) {
    return (
      <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          You can only access pets that are officially approved and adopted by your account.
        </div>
      </main>
    );
  }

  const updates = await listDogPostAdoptionUpdates(id);
  const messages = await listDogMessages(id);
  const earTagConfig = await getEarTagGlobalConfig();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-7 shadow-lg sm:p-9">
          <div className="flex gap-6">
            <div className="relative h-40 w-40 overflow-hidden rounded-xl bg-slate-100">
              <Image src={dog.imageUrl} alt={dog.name} fill sizes="160px" className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{dog.name}</h1>
              <p className="text-xs uppercase tracking-wide text-slate-500">Rescue Name: {dog.rescueName}</p>
              {dog.petName ? <p className="text-sm font-semibold text-indigo-700">Pet Name: {dog.petName}</p> : null}
              <p className="text-sm text-slate-600">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
              <p className="text-sm text-slate-600">{dog.city ?? ''}{dog.city && dog.area ? ', ' : ''}{dog.area ?? ''}</p>
              <p className="mt-2 text-sm text-slate-700">{dog.description}</p>
            </div>
          </div>
        </div>

        <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Post-adoption Updates</h2>
            <div className="mt-3 space-y-3">
              {updates.map((u) => (
                <article key={u.updateId} className="rounded-md border border-slate-100 p-2">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image src={u.imageUrl} alt={u.caption} fill sizes="320px" className="object-cover" />
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{u.caption}</p>
                  <p className="text-xs text-slate-500">Uploaded by {u.uploadedBy} • {new Date(u.uploadedAt).toLocaleString()}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="mt-3">
              <ChatBox dogId={id} initialMessages={messages} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
