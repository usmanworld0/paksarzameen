import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdoptDogButton } from "@/features/dog-adoption/components/AdoptDogButton";
import {
  getDogById,
  getEarTagGlobalConfig,
  normalizeDogStatus,
  type DogStatus,
} from "@/lib/dog-adoption";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STORE_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

function getPublicDogStatus(status: DogStatus): "available" | "adopted" {
  return status === "adopted" ? "adopted" : "available";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    return { title: "Dog Not Found" };
  }

  return {
    title: `Adoption Request: ${dog.name} | Dog Adoption`,
    description: `Submit an adoption request for ${dog.name}.`,
  };
}

export default async function DogAdoptPage({ params }: PageProps) {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    notFound();
  }

  const normalizedStatus = normalizeDogStatus(dog.status);
  const publicStatus = getPublicDogStatus(normalizedStatus);

  if (publicStatus !== "available") {
    redirect(`/dog/${dog.dogId}`);
  }

  const earTagConfig = await getEarTagGlobalConfig();

  return (
    <main
      className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_58%,#f6f2ec_100%)] pt-[72px] text-neutral-950"
      style={{ fontFamily: STORE_FONT_FAMILY }}
    >
      <section className="border-b border-black/6 bg-[#fcfbf8]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-3 px-5 py-5 sm:px-8 lg:px-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            <Link href="/dog-adoption" className="transition-colors hover:text-neutral-950">
              Dog Adoption
            </Link>
            <span>/</span>
            <Link href={`/dog/${dog.dogId}`} className="transition-colors hover:text-neutral-950">
              {dog.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-700">Adoption Request</span>
          </div>

          <Link
            href={`/dog/${dog.dogId}`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {dog.name}
          </Link>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-4xl">
          <AdoptDogButton dogId={dog.dogId} dogName={dog.name} earTagConfig={earTagConfig} />
        </div>
      </section>
    </main>
  );
}
