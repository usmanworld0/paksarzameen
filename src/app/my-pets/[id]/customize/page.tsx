import type { Metadata } from "next";

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
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Customization</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Customize Pet Tag
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking.
          </p>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <MyPetPersonalizationPanel dog={dog} earTagConfig={earTagConfig} showHeader={false} />
        </div>
      </div>
    </main>
  );
}
