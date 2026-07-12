import type { Metadata } from "next";
import Link from "next/link";

import { requireAuthenticatedUser } from "@/lib/supabase/authorization";
import { getDogById, getEarTagGlobalConfig, listMyAdoptionRequests } from "@/lib/dog-adoption";
import { MyPetPersonalizationPanel } from "@/features/dog-adoption/components/MyPetPersonalizationPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);
  return {
    title: dog ? `Customize Pet Tag | ${dog.petName ?? dog.name}` : "Customize Pet Tag",
  };
}

export default async function MyPetCustomizationPage({ params }: { params: Promise<{ id: string }> }) {
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

  const earTagConfig = await getEarTagGlobalConfig();

  return (
    <div className="bg-white">
      <section className="border-b border-black/6 bg-[#fcfbf8]">
        <div className="flex flex-col gap-3 px-[5%] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            <Link href="/">Home</Link><span>/</span><Link href="/my-adoptions">My adoptions</Link><span>/</span><span className="text-neutral-700">Customize pet tag</span>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">Pet personalization</p>
        </div>
      </section>
      <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} showHeader={false} />
    </div>
  );
}
