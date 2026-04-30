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
  available: "AVAILABLE",
  pending: "PENDING",
  adopted: "ADOPTED",
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
    <main className="min-h-screen bg-white pb-24 pt-28 sm:pt-32 text-[#111111]">
      <div className="mx-auto max-w-screen-2xl px-[5%]">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 border-b border-[#E5E5E5] pb-4">
          <Link href="/dog-adoption" className="text-xs font-bold uppercase tracking-widest text-[#707072] hover:text-[#111111] transition flex items-center gap-2">
            ← BACK TO BROWSE DOGS
          </Link>
        </div>

        <section className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] items-start">
          <div className="border border-[#E5E5E5] bg-[#F5F5F5] relative overflow-hidden group w-full aspect-[4/3] lg:aspect-square">
            <Image
              src={dog.imageUrl}
              alt={dog.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8 md:p-12 space-y-8">
            <div className="space-y-4 border-b border-[#E5E5E5] pb-6">
              <div className="flex justify-between items-start gap-4">
                 <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#111111] leading-none">{dog.name}</h1>
                 <span className={`inline-flex px-3 py-1.5 text-[10px] font-black tracking-widest uppercase text-white bg-[#111111]`}>
                   {STATUS_LABELS[normalizedStatus]}
                 </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div>
                    <p className="text-[10px] uppercase font-bold text-[#707072] tracking-widest">Rescue Name</p>
                    <p className="text-sm font-bold uppercase text-[#111111]">{dog.rescueName}</p>
                 </div>
                 {dog.petName && (
                   <div>
                      <p className="text-[10px] uppercase font-bold text-[#1151FF] tracking-widest">Pet Name</p>
                      <p className="text-sm font-bold uppercase text-[#111111]">{dog.petName}</p>
                   </div>
                 )}
              </div>
              
              <div className="pt-4 flex gap-4 text-sm font-bold uppercase tracking-widest text-[#707072]">
                <span>{dog.breed}</span>
                <span>/</span>
                <span>{dog.color}</span>
                <span>/</span>
                <span>{dog.age}</span>
                <span>/</span>
                <span>{dog.gender}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-base leading-relaxed text-[#111111] font-medium">{dog.description}</p>
            </div>

            <div className="pt-6">
              {normalizedStatus === "available" ? (
                <AdoptDogButton dogId={dog.dogId} />
              ) : (
                <div className="border border-[#111111] bg-[#111111] px-6 py-4 text-center text-sm font-bold tracking-widest uppercase text-white">
                  STATUS: {STATUS_LABELS[normalizedStatus]} (UNAVAILABLE)
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Life After Adoption */}
        <section className="mt-20 pt-16 border-t border-[#E5E5E5]">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="text-[3rem] font-black uppercase tracking-tighter text-[#111111] leading-none">
              AFTER ADOPTION.
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-[#707072]">
              POST-ADOPTION MOMENTS
            </p>
          </div>

          {!updates.length ? (
             <div className="border border-[#E5E5E5] bg-[#F5F5F5] p-10 text-center text-sm font-bold uppercase tracking-widest text-[#707072]">
               No post-adoption updates yet.
             </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {updates.map((item) => (
                <article key={item.updateId} className="group border border-[#E5E5E5] bg-white transition hover:border-[#111111] flex flex-col">
                  <div className="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                     <p className="text-sm font-medium leading-relaxed text-[#111111] mb-6">{item.caption}</p>
                     
                     {item.collarTag && (
                        <div className="pt-4 border-t border-[#E5E5E5]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#111111]">
                            COLLAR TAG: {item.collarTag}
                          </p>
                        </div>
                     )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}