import type { Metadata } from "next";
import Image from "next/image";

import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { getDogById, listDogPostAdoptionUpdates } from "@/lib/dog-adoption";
import { listDogMessages } from "@/lib/dog-messages";
import ChatBox from "@/components/dog/ChatBox";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const dog = await getDogById(params.id);
  return {
    title: dog ? `My Pet · ${dog.name}` : "My Pet",
  };
}

export default async function MyPetPage({ params }: { params: { id: string } }) {
  const session = await requireAuthenticatedUser();
  if (!session?.id) return null;

  const dog = await getDogById(params.id);
  if (!dog) return (
    <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">Dog not found.</div>
    </main>
  );

  const updates = await listDogPostAdoptionUpdates(params.id);
  const messages = await listDogMessages(params.id);

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
              <p className="text-sm text-slate-600">{dog.breed} • {dog.age} • {dog.gender}</p>
              <p className="text-sm text-slate-600">{dog.city ?? ''}{dog.city && dog.area ? ', ' : ''}{dog.area ?? ''}</p>
              <p className="mt-2 text-sm text-slate-700">{dog.description}</p>
            </div>
          </div>
        </div>

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
              <ChatBox dogId={params.id} initialMessages={messages} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
