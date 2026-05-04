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
                    : "bg-slate-200 text-slate-400"
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
                <div className={`flex-1 h-0.5 ${step.done && !isRejected ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </div>
            <span className={`mt-1 text-[9px] font-medium ${step.done ? "text-slate-500" : "text-slate-300"}`}>
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
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-[5%] pb-6 pt-28">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Your Journey</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Adoption Requests
              </h1>
              <p className="mt-1.5 text-slate-500">Track your rescue dog adoption applications</p>
            </div>
            <Link
              href="/dog-adoption"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              <Heart className="h-4 w-4" /> Browse More Dogs
            </Link>
          </div>

          {requests.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <PawPrint className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
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
      </div>

      <div className="px-[5%] py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {!error && requests.length === 0 && (
            <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Heart className="h-7 w-7 text-slate-300" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">No adoption requests yet</p>
                <p className="mt-1 text-sm text-slate-400">Browse available dogs and submit your first request</p>
              </div>
              <Link
                href="/dog-adoption"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-500"
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
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${cfg.border}`}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-44">
                    <Image
                      src={request.dogImageUrl}
                      alt={request.dogName}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{request.dogName}</h2>
                        <p className="text-sm text-slate-500">{request.dogColor}</p>
                        {request.petName && (
                          <p className="mt-0.5 text-sm font-semibold text-indigo-600">Pet name: {request.petName}</p>
                        )}
                      </div>
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </div>
                    </div>

                    <AdoptionTimeline status={request.status} />

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-400">
                        Submitted {new Date(request.requestedAt).toLocaleDateString("en-PK", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/dog/${request.dogId}`}
                          className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                        >
                          View Dog
                        </Link>
                        {request.status === "approved" && (
                          <Link
                            href={`/my-pets/${request.dogId}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                          >
                            Manage My Pet <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {request.status === "approved" && (
                  <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-3">
                    <p className="text-xs font-medium text-emerald-700">
                      Congratulations! Visit <strong>Manage My Pet</strong> to name your dog and customize their ear tag.
                    </p>
                  </div>
                )}
                {request.status === "rejected" && (
                  <div className="border-t border-red-200 bg-red-50 px-5 py-3">
                    <p className="text-xs text-red-600">
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
