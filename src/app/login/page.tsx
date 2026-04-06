import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { LoginWithGoogleButton } from "@/features/auth/components/LoginWithGoogleButton";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in with Google to upload artwork to the customer gallery.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/upload-art");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/upload-art";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,122,71,0.14),_transparent_34%),linear-gradient(180deg,_#f7fbf8_0%,_#eef5ef_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-[0_30px_120px_rgba(6,33,18,0.12)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex items-end overflow-hidden bg-psz-green p-10 text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4" />
              Customer Art Gallery
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Sign in to submit your artwork.
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/78 sm:text-lg">
                Use your Google account to upload art, keep your submissions
                linked to your profile, and track pending approvals from one
                place.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <ArrowRight className="h-4 w-4" />
              Protected uploads, review workflow, and personal gallery history.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
                Google Authentication
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-psz-black">
                Welcome back
              </h2>
              <p className="text-sm leading-6 text-neutral-600">
                Authenticate once and use the same session for uploads and your
                personal gallery.
              </p>
            </div>

            <LoginWithGoogleButton callbackUrl={callbackUrl} />

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-600">
              After login, you will be redirected to the protected upload page
              where you can submit artwork for review.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
