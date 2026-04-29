import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_34%),linear-gradient(180deg,_#fffef8_0%,_#f4f7f2_100%)] px-6 py-16 sm:px-8 lg:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="max-w-2xl space-y-5">
          <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
            PakSarZameen Dogs
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Give a stray dog a safe home and a better tomorrow.
          </h2>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Browse the rescue dogs available for adoption, read their profiles, and start a simple adoption request when you find the right companion.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dog-adoption"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Explore Dogs
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              How it works
            </a>
          </div>
        </div>

        <aside className="grid flex-1 gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 sm:grid-cols-2 lg:max-w-xl">
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Adopt</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">View available dogs and submit an adoption request from each profile.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">Support</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">See adopted dogs and post-adoption updates from the rescue team.</p>
          </div>
          <div id="how-it-works" className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">How it works</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>1. Browse dogs on the adoption page.</li>
              <li>2. Open a profile to review details and photos.</li>
              <li>3. Send an adoption request when you’re ready.</li>
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}