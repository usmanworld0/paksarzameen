import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_34%),linear-gradient(180deg,_#f8fbff_0%,_#eef5fb_100%)] px-6 py-16 sm:px-8 lg:px-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="max-w-2xl space-y-5">
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-800">
            PakSarZameen HealthCare
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Faster medical support, doctor access, and blood-bank help in one place.
          </h2>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Use the healthcare hub to search doctors, book appointments, open the blood bank, or connect through the doctor portal when you need care.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/healthcare"
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Open HealthCare Hub
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Explore services
            </a>
          </div>
        </div>

        <aside className="grid flex-1 gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 sm:grid-cols-2 lg:max-w-xl">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Doctors</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Browse doctors and book appointments from the healthcare hub.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Blood Bank</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Access emergency matching and donation support tools.</p>
          </div>
          <div id="services" className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Available entry points</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>• HealthCare hub for patient services and AI help</li>
              <li>• Doctor portal for sign up and sign in</li>
              <li>• Blood bank section for matching and support</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}