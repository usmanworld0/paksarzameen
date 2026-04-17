import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { listMyAdoptionRequests, type AdoptionRequestStatus } from "@/lib/dog-adoption";
import { requireAuthenticatedUser } from "@/lib/supabase/authorization";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Adoptions",
  description: "Track your dog adoption requests and statuses.",
};

const STATUS_LABELS: Record<AdoptionRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function statusClass(status: AdoptionRequestStatus) {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "rejected") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export default async function MyAdoptionsPage() {
  const session = await requireAuthenticatedUser();

  if (!session?.id) {
    redirect("/login?callbackUrl=/my-adoptions");
  }

  let requests = [] as Awaited<ReturnType<typeof listMyAdoptionRequests>>;
  let error: string | null = null;

  try {
    requests = await listMyAdoptionRequests(session.id);
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Failed to load requests.";
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fcf8_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-7 shadow-lg shadow-emerald-900/10 sm:p-9">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">My Adoption Requests</h1>
          <p className="mt-2 text-base text-slate-600">
            Track the status of all requests you submitted for rescue dogs.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        {!error && !requests.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            You have not submitted any adoption requests yet.
          </div>
        ) : null}

        {!error && requests.length ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <article
                key={request.requestId}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
                  <Image
                    src={request.dogImageUrl}
                    alt={request.dogName}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-slate-900">{request.dogName}</h2>
                  <p className="text-sm text-slate-600">{request.dogBreed}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested on {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
                    {STATUS_LABELS[request.status]}
                  </span>
                  {request.status === "approved" ? (
                    <a
                      href={`/my-pets/${request.dogId}`}
                      className="rounded-full border border-emerald-700 px-3 py-1 text-xs font-semibold text-emerald-700"
                    >
                      View My Pet →
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
