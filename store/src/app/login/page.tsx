import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { getManualGalleryUser } from "@/lib/manual-gallery-auth";
import { ManualSignupForm } from "@/features/gallery/components/ManualSignupForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign up with name and email to upload artwork to the customer gallery.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const manualUser = await getManualGalleryUser();

  if (session?.user?.id || manualUser?.id) {
    redirect("/upload-art");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/upload-art";

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[#e5d8cf] bg-white shadow-[0_24px_72px_rgba(33,28,20,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex items-end overflow-hidden bg-[#0f7a47] p-10 text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4" />
              Customer Art Gallery
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Sign up to submit your artwork.
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/80 sm:text-lg">
                Provide your name and email to upload art, keep submissions
                linked to your profile, and track pending approvals from one
                place.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/85">
              <ArrowRight className="h-4 w-4" />
              Protected uploads, review workflow, and personal gallery history.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0f7a47]">
                Sign up manually
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                Welcome back
              </h2>
              <p className="text-sm leading-6 text-neutral-600">
                Authenticate once and use the same session for uploads and your
                personal gallery.
              </p>
            </div>

            <ManualSignupForm callbackUrl={callbackUrl} className="w-full" />

            <div className="rounded-2xl border border-[#e5d8cf] bg-[#faf6f1] px-4 py-4 text-sm leading-6 text-neutral-600">
              After login, you will be redirected to the protected upload page
              where you can submit artwork for review.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}