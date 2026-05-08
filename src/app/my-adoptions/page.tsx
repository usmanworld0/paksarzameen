import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, Clock, Check, X, ArrowRight, PawPrint } from "lucide-react";

import { listMyAdoptionRequests, type AdoptionRequestStatus } from "@/lib/dog-adoption";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Adoptions",
  description: "Track your dog adoption requests and statuses.",
};

const STATUS_CONFIG: Record<
  AdoptionRequestStatus,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  approved: {
    label: "Approved",
    icon: Check,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  rejected: {
    label: "Not Approved",
    icon: X,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

function AdoptionTimeline({ status }: { status: AdoptionRequestStatus }) {
  const steps = [
    { label: "Submitted", done: true },
    { label: "In Review", done: status !== "pending" },
    { label: "Decision", done: status === "approved" || status === "rejected" },
    { label: "Welcome Home", done: status === "approved" },
  ];

  return (
    <div className="flex items-start gap-0">
      {steps.map((step, i) => {
        const isRejected = status === "rejected" && i === 2;
        const active = !step.done && steps.slice(0, i).every((s) => s.done);
        return (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition ${
                  step.done && !isRejected
                    ? "bg-emerald-500 text-white"
                    : isRejected
                    ? "bg-red-400 text-white"
                    : active
                    ? "ring-2 ring-amber-400 bg-white text-amber-600"
                    : "bg-[#f3f3ee] text-[#707072]"
                }`}
              >
                {step.done && !isRejected ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : isRejected ? (
                  <X className="h-3 w-3" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${step.done && !isRejected ? "bg-emerald-400" : "bg-[#E5E5E5]"}`} />
              )}
            </div>
            <span className={`mt-1 text-[9px] font-medium ${step.done ? "text-[#707072]" : "text-[#bbb]"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default async function MyAdoptionsPage() {
  const session = await requireAuthenticatedUser();
  if (!session?.id) redirect("/login?callbackUrl=/my-adoptions");

  let requests = [] as Awaited<ReturnType<typeof listMyAdoptionRequests>>;
  let error: string | null = null;

  try {
    requests = await listMyAdoptionRequests(session.id);
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Failed to load requests.";
  }

  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-screen bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Your Journey</p>
              <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
                My Adoptions
              </h1>
              <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
                Track your rescue dog adoption applications.
              </p>
            </div>
            <Link
              href="/dog-adoption"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
            >
              <Heart className="h-4 w-4" /> Browse More Dogs
            </Link>
          </div>

          {requests.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-2.5">
                <PawPrint className="h-4 w-4 text-[#707072]" />
                <span className="text-sm font-semibold text-[#111111]">
                  {requests.length} Request{requests.length !== 1 ? "s" : ""}
                </span>
              </div>
              {approvedCount > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{approvedCount} Approved</span>
                </div>
              )}
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">{pendingCount} Pending</span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</div>
          )}

          {!error && requests.length === 0 && (
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#E5E5E5] bg-white py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3ee]">
                <Heart className="h-7 w-7 text-[#bbb]" />
              </div>
              <div>
                <p className="font-black tracking-tighter text-[#111111]">No adoption requests yet</p>
                <p className="mt-1 text-sm font-medium text-[#707072]">Browse available dogs and submit your first request</p>
              </div>
              <Link
                href="/dog-adoption"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f7a47] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
              >
                <Heart className="h-4 w-4" /> Find a Dog to Adopt
              </Link>
            </div>
          )}

          {!error && requests.map((request) => {
            const cfg = STATUS_CONFIG[request.status];
            const StatusIcon = cfg.icon;
            return (
              <article
                key={request.requestId}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#f3f3ee] sm:h-auto sm:w-44">
                    <Image
                      src={request.dogImageUrl}
                      alt={request.dogName}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-black tracking-tighter text-[#111111]">{request.dogName}</h2>
                        <p className="text-sm font-medium text-[#707072]">{request.dogColor}</p>
                        {request.petName && (
                          <p className="mt-0.5 text-sm font-semibold text-[#0f7a47]">Pet name: {request.petName}</p>
                        )}
                      </div>
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </div>
                    </div>

                    <AdoptionTimeline status={request.status} />

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5E5] pt-3">
                      <p className="text-xs font-medium text-[#707072]">
                        Submitted {new Date(request.requestedAt).toLocaleDateString("en-PK", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/dog/${request.dogId}`}
                          className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                        >
                          View Dog
                        </Link>
                        {request.status === "approved" && (
                          <Link
                            href={`/my-pets/${request.dogId}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
                          >
                            Manage My Pet <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {request.status === "approved" && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-medium text-emerald-700">
                      Congratulations! Visit <strong>Manage My Pet</strong> to name your dog and customize their ear tag.
                    </p>
                  </div>
                )}
                {request.status === "rejected" && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-medium text-red-700">
                      This request was not approved. Browse other available dogs and try again!
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
