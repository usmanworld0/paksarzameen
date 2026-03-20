import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(15,122,71,0.12),_transparent_28%),linear-gradient(180deg,_#f8faf8_0%,_#ffffff_100%)] px-6">
      <div className="max-w-xl rounded-[2rem] border border-neutral-200 bg-white/90 p-8 text-center shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-psz-green">PakSarZameen</p>
        <h1 className="mt-4 text-6xl font-bold text-neutral-900 sm:text-7xl">404</h1>
        <p className="mt-4 text-2xl font-semibold text-neutral-900">Page Not Found</p>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-neutral-600">
          The page you&apos;re looking for may have moved, expired, or never existed in this section of the site.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-psz-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-psz-green-light"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
