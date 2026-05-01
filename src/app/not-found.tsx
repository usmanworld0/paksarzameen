import Link from "next/link";

export default function NotFound() {
  const displayFont = {
    fontFamily: '"Arial Narrow", Helvetica, Arial, sans-serif',
  } as const;

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="border-b border-[#e5e5e5] bg-[#111111] text-white">
        <div className="mx-auto flex min-h-[52svh] w-full max-w-[1440px] items-end px-6 pb-12 pt-28 sm:px-10 lg:px-12">
          <div className="max-w-[72rem]">
            <p className="text-[1.1rem] font-medium uppercase tracking-[0.2em] text-white/68">
              PakSarZameen
            </p>
            <h1
              style={displayFont}
              className="mt-4 text-[clamp(6rem,15vw,14rem)] font-bold uppercase leading-[0.88] tracking-[-0.08em]"
            >
              404
            </h1>
            <p className="mt-4 max-w-[46rem] text-[1.6rem] leading-[1.75] text-white/82">
              The page you&apos;re looking for isn&apos;t here.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        <div className="grid gap-8 border border-[#e5e5e5] bg-white p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:p-10">
          <div>
            <p className="text-[1.1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">
              Placeholder screen
            </p>
            <h2
              style={displayFont}
              className="mt-3 text-[clamp(3.2rem,6vw,5.8rem)] font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[#111111]"
            >
              Page not found.
            </h2>
            <p className="mt-4 max-w-[52rem] text-[1.55rem] leading-[1.8] text-[#707072]">
              It may have moved, expired, or never existed in this section of the site.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-6 border-t border-[#e5e5e5] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="space-y-3">
              <div className="h-[1.1rem] w-[9rem] rounded-full bg-[#e5e5e5]" aria-hidden="true" />
              <div className="h-[1.1rem] w-full max-w-[24rem] rounded-full bg-[#f5f5f5]" aria-hidden="true" />
              <div className="h-[1.1rem] w-full max-w-[18rem] rounded-full bg-[#f5f5f5]" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full bg-[#111111] px-6 text-[1.2rem] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#707072]"
              >
                Return Home
              </Link>
              <Link
                href="/programs"
                className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full border border-[#cacacb] bg-white px-6 text-[1.2rem] font-medium uppercase tracking-[0.14em] text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#f5f5f5]"
              >
                Browse Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
