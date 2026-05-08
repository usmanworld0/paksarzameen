import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { CalendarDays, ImageIcon } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { getUserGalleryImages, type GalleryImageRecord } from "@/lib/gallery";
import { GalleryUploadForm } from "@/features/auth/components/GalleryUploadForm";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export const metadata: Metadata = {
  title: "Upload Art",
  description: "Upload artwork to the customer gallery.",
};

export const dynamic = "force-dynamic";

export default async function UploadArtPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/upload-art");
  }

  const uploads: GalleryImageRecord[] = await getUserGalleryImages(session.user.id);

  return (
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Gallery</p>
              <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
                Upload Art
              </h1>
              <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
                Every submission is tied to your session and marked pending until approved for the public gallery.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-medium text-[#707072]">
                Signed in as <span className="font-semibold text-[#111111]">{session.user.email}</span>
              </div>
              <LogoutButton className="justify-center rounded-xl" />
            </div>
          </div>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <GalleryUploadForm />

            <aside className="space-y-6">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#0f7a47]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Your Uploads</p>
                </div>
                <p className="text-sm font-medium text-[#707072]">These entries are private until approved.</p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Total Uploads</p>
                    <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{uploads.length}</p>
                    <p className="mt-1 text-xs font-medium text-[#707072]">All time submissions</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Pending Review</p>
                    <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">
                      {uploads.filter((image) => !image.approved).length}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#707072]">Awaiting approval</p>
                  </div>
                </div>
              </div>

              {uploads.length > 0 ? (
                <div className="space-y-3">
                  {uploads.slice(0, 6).map((image) => (
                    <article
                      key={image.id}
                      className="rounded-2xl border border-[#E5E5E5] bg-white p-4 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f3ee]">
                          <Image
                            src={image.thumbnailUrl ?? image.imageUrl}
                            alt={image.caption ?? "Uploaded artwork preview"}
                            width={64}
                            height={64}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-base font-black tracking-tighter text-[#111111]">
                            {image.caption?.trim() || image.originalFilename || "Untitled artwork"}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-medium text-[#707072]">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(image.createdAt)}
                          </div>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                              image.approved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {image.approved ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-4 py-10 text-center">
                  <p className="text-sm font-medium text-[#707072]">Your gallery is empty. Upload the first piece to start the collection.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
