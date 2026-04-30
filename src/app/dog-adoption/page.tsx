import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    <main className="min-h-screen bg-white pb-24 pt-28 sm:pt-32 text-[#111111]">
      <section className="mx-auto max-w-screen-2xl space-y-12 px-[5%]">
        
        {/* HERO HEADER */}
        <header className="border-b border-[#E5E5E5] pb-8 md:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[10vw] md:text-[6rem] leading-[0.9] font-black uppercase tracking-tighter">
              ADOPT.
            </h1>
            <p className="mt-2 text-[#707072] text-sm md:text-base tracking-wide font-medium">
              EVERY DOG DESERVES A HOME.
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 p-4 bg-[#F5F5F5] border border-[#E5E5E5]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#707072]">
              ADOPTION DRIVE
            </p>
            <p className="text-sm font-bold text-[#D30005]">
              ADOPT A DOG FOR PKR 3,500
            </p>
          </div>
        </header>

        {error ? (
          <div className="border-l-4 border-[#D30005] bg-[#FAFAFA] p-4 text-[#D30005] font-medium text-sm">
            {error}
          </div>
        ) : null}

        {!error && !dogs.length ? (
          <div className="border border-[#E5E5E5] bg-[#F5F5F5] p-6 text-center text-sm font-medium tracking-wide uppercase text-[#707072]">
            NO DOGS LISTED YET. PLEASE CHECK BACK SOON.
          </div>
        ) : null}

        {!error && dogs.length ? <DogMarketplace dogs={dogs} /> : null}

        {!error ? (
          <section className="pt-12 md:pt-16 border-t border-[#E5E5E5]">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#707072] mb-1">Success Stories</p>
              <h2 className="text-3xl font-medium tracking-tight text-[#111111]">
                SETTLED IN LOVING HOMES
              </h2>
            </div>

            {!adoptedDogs.length ? (
              <p className="border border-[#E5E5E5] bg-[#F5F5F5] px-6 py-4 text-sm font-medium tracking-wide uppercase text-[#707072]">
                NO ADOPTED DOG RECORDS AVAILABLE YET.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {adoptedDogs.map((dog) => (
                  <article key={dog.dogId} className="group border border-[#E5E5E5] bg-white transition hover:border-[#111111]">
                    <div className="relative aspect-[4/3] bg-[#F5F5F5]">
                      <Image src={dog.imageUrl} alt={dog.dogName} fill sizes="(max-width: 1280px) 50vw, 33vw" className="object-cover transition-opacity duration-300 group-hover:opacity-90" />
                    </div>
                    <div className="p-6 flex flex-col justify-between h-[200px]">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">{dog.dogName}</h3>
                           <span className="bg-[#111111] text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">ADOPTED</span>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-widest text-[#707072] mb-3">Rescue Name: {dog.rescueName}</p>
                        <p className="text-sm font-medium text-[#111111]">{dog.breed} / {dog.age} / {dog.gender}</p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                           <p className="text-[10px] uppercase text-[#707072] font-semibold">OWNER: {dog.ownerName ?? "N/A"}</p>
                           <p className="text-[10px] uppercase text-[#1151FF] font-semibold">PET NAME: {dog.petName ?? "N/A"}</p>
                        </div>
                        <Link href={`/dog/${dog.dogId}`} className="text-xs font-bold uppercase tracking-wide text-[#111111] hover:text-[#707072] underline underline-offset-4 decoration-2 transition">
                          View profile
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}