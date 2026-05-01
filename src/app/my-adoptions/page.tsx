import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

function statusBadgeClass(status: AdoptionRequestStatus) {
  if (status === "approved") return "site-badge site-badge--dark";
  if (status === "rejected") return "site-badge site-badge--muted";
  return "site-badge";
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
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell--narrow">
          <header className="site-detail__hero">
            <p className="site-eyebrow">Adoption dashboard</p>
            <h1 className="site-display mt-4 max-w-[11ch]">My Adoptions.</h1>
            <p className="site-copy mt-4">
              Track request status and open approved pet profiles.
            </p>
          </header>

          {error ? <div className="site-callout site-callout--error mt-6">{error}</div> : null}

          {!error && !requests.length ? (
            <div className="site-empty mt-6">
              You have not submitted any adoption requests yet.
            </div>
          ) : null}

          {!error && requests.length ? (
            <div className="site-stack mt-6">
              {requests.map((request) => (
                <article key={request.requestId} className="site-panel site-panel--rounded">
                  <div className="site-panel__body flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="site-detail__media h-24 w-full max-w-[12.8rem] sm:h-24 sm:w-32 sm:flex-none">
                      <Image
                        src={request.dogImageUrl}
                        alt={request.dogName}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="site-card__eyebrow">{request.dogBreed}</p>
                      <h2 className="site-heading site-heading--sm mt-3">{request.dogName}</h2>
                      <p className="site-copy site-copy--sm mt-3">
                        {request.dogColor} / Requested on{" "}
                        {new Date(request.requestedAt).toLocaleString()}
                      </p>
                      {request.petName ? (
                        <div className="site-meta-row mt-4">
                          <span>Pet name: {request.petName}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="site-stack w-full sm:w-auto sm:items-end">
                      <span className={statusBadgeClass(request.status)}>
                        {STATUS_LABELS[request.status]}
                      </span>
                      {request.status === "approved" ? (
                        <Link href={`/my-pets/${request.dogId}`} className="site-button-secondary">
                          View My Pet
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
