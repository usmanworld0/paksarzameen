export default function ArtistsLoading() {
  return (
    <main className="pt-[72px] bg-white min-h-screen">
      <section className="py-24">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
          <div className="mb-16 border-b border-neutral-100 pb-10">
            <div className="h-3 w-36 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-4 w-[28rem] max-w-full animate-pulse rounded bg-neutral-100" />
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
