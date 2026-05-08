export default function ArtistProfileLoading() {
  return (
    <main className="pt-[72px] bg-white min-h-screen">
      <section className="border-b border-neutral-100 bg-neutral-50 px-6 py-16 sm:px-10 lg:px-16 sm:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[280px_1fr]">
            <div className="aspect-[3/4] animate-pulse rounded bg-neutral-200" />
            <div className="space-y-4">
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="h-10 w-72 max-w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-[34rem] max-w-full animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-[30rem] max-w-full animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16 sm:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-10 h-8 w-56 animate-pulse rounded bg-neutral-200" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
