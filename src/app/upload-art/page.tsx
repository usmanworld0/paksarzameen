import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { CalendarDays, ImageIcon, ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,122,71,0.12),_transparent_32%),linear-gradient(180deg,_#f7fbf8_0%,_#eef5ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_100px_rgba(6,33,18,0.1)] backdrop-blur-2xl lg:flex-row lg:items-end lg:justify-between lg:p-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-psz-green/15 bg-psz-green/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-psz-green">
              <ShieldCheck className="h-4 w-4" />
              Protected upload space
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-psz-black sm:text-5xl">
                Upload your art for gallery review.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Every submission is tied to your Google session, stored in the
                database, and marked pending until approved for the public
                gallery.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              Signed in as <span className="font-medium text-neutral-900">{session.user.email}</span>
            </div>
            <LogoutButton className="justify-center rounded-2xl px-5" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <GalleryUploadForm />

          <aside className="space-y-6 rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_24px_100px_rgba(6,33,18,0.08)] backdrop-blur-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-psz-green">
                <ImageIcon className="h-4 w-4" />
                Your uploads
              </div>
              <p className="text-sm leading-6 text-neutral-600">
                These entries are private until approved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Total uploads
                </p>
                <p className="mt-2 text-3xl font-semibold text-psz-black">{uploads.length}</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Pending review
                </p>
                <p className="mt-2 text-3xl font-semibold text-psz-black">
                  {uploads.filter((image) => !image.approved).length}
                </p>
              </div>
            </div>

            {uploads.length > 0 ? (
              <div className="space-y-4">
                {uploads.slice(0, 6).map((image) => (
                  <article
                    key={image.id}
                    className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={image.thumbnailUrl ?? image.imageUrl}
                        alt={image.caption ?? "Uploaded artwork preview"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-medium text-psz-black">
                        {image.caption?.trim() || image.originalFilename || "Untitled artwork"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Intl.DateTimeFormat("en-PK", {
                          dateStyle: "medium",
                        }).format(image.createdAt)}
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          image.approved
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {image.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                Your gallery is empty. Upload the first piece to start the collection.
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
