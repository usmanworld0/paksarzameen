import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { authOptions } from "@/lib/auth";
import { getUserGalleryImages } from "@/lib/gallery";
import { getManualGalleryUser } from "@/lib/manual-gallery-auth";
import { GalleryUploadForm } from "@/features/gallery/components/GalleryUploadForm";
import { GalleryLogoutButton } from "@/features/gallery/components/GalleryLogoutButton";
import { ManualSignupForm } from "@/features/gallery/components/ManualSignupForm";

export const metadata: Metadata = {
  title: "Upload Art",
  description: "Sign up with name and email to upload artwork.",
};

export const dynamic = "force-dynamic";

export default async function UploadArtPage() {
  const session = await getServerSession(authOptions);
  const manualUser = await getManualGalleryUser();

  const userId = session?.user?.id ?? manualUser?.id;
  const signedInEmail = session?.user?.email ?? manualUser?.email;

  const uploads = userId ? await getUserGalleryImages(userId) : [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fffaf6]">
          <div className="store-container max-w-[1100px] space-y-8">
            <div className="rounded-[28px] border border-[#e5d8cf] bg-white p-8 shadow-[0_16px_40px_rgba(33,28,20,0.08)] sm:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0f7a47]">
                Customer&apos;s Art Gallery
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-neutral-900 sm:text-5xl">
                Upload Your Art
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                Provide your name and email to continue to the protected upload
                flow. Your submission will stay tied to your profile and
                appear in the gallery after approval.
              </p>

              {!userId ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <ManualSignupForm
                      callbackUrl="/upload-art"
                      className="w-full max-w-md"
                      submitButtonClassName="text-xs font-semibold uppercase tracking-[0.16em] sm:w-auto"
                    />
                  <a
                    href="/customers-art-gallery"
                    className="inline-flex items-center justify-center rounded-full border border-[#e5d8cf] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-800 transition-colors hover:border-[#0f7a47] hover:bg-[#fffaf5]"
                  >
                    Back to Gallery
                  </a>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#upload-form"
                    className="inline-flex items-center justify-center rounded-full border border-[#0f7a47] bg-[#0f7a47] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#081c10] hover:bg-[#081c10] hover:text-white"
                  >
                    Continue to Upload
                  </a>
                  <GalleryLogoutButton className="rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em]" />
                </div>
              )}
            </div>

            {userId ? (
              <div id="upload-form" className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <GalleryUploadForm signedInEmail={signedInEmail ?? undefined} />

                <aside className="space-y-6 rounded-[28px] border border-[#e5d8cf] bg-white p-6 shadow-[0_16px_40px_rgba(33,28,20,0.08)]">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
                      Your uploads
                    </p>
                    <p className="text-sm leading-6 text-neutral-600">
                      These entries are private until approved.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[#e5d8cf] bg-[#faf6f1] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Total uploads
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-neutral-900">{uploads.length}</p>
                    </div>
                    <div className="rounded-2xl border border-[#e5d8cf] bg-[#faf6f1] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Pending review
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-neutral-900">
                        {uploads.filter((image) => !image.approved).length}
                      </p>
                    </div>
                  </div>

                  {uploads.length > 0 ? (
                    <div className="space-y-4">
                      {uploads.slice(0, 6).map((image) => (
                        <article
                          key={image.id}
                          className="flex items-center gap-4 rounded-2xl border border-[#e5d8cf] bg-white px-4 py-3"
                        >
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#faf6f1]">
                            <img
                              src={image.thumbnailUrl ?? image.imageUrl}
                              alt={image.caption ?? "Uploaded artwork preview"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {image.caption?.trim() || image.originalFilename || "Untitled artwork"}
                            </p>
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
                    <div className="rounded-2xl border border-dashed border-[#e5d8cf] bg-[#faf6f1] p-8 text-center text-sm text-neutral-600">
                      Your gallery is empty. Upload the first piece to start the collection.
                    </div>
                  )}
                </aside>
              </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[#e5d8cf] bg-[#faf6f1] p-8 text-center text-sm text-neutral-600">
                Click the sign-up form above to unlock the protected upload form.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
