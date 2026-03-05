import { missionCards } from "@/features/home/home.content";

export function WhatIsPSZ() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="what-is-psz-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-psz-olive">
          What Is PakSarZameen?
        </p>
        <h2
          id="what-is-psz-heading"
          className="mt-4 font-heading text-4xl leading-tight text-psz-forest sm:text-5xl"
        >
          A Community-Led Model For Ethical Progress
        </h2>
        <p className="mt-5 text-base leading-relaxed text-psz-charcoal/80 sm:text-lg">
          PakSarZameen advances social wellbeing by connecting education,
          environmental stewardship, health support, and inclusive opportunity.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {missionCards.map((card) => (
          <article
            key={card.title}
            className="group rounded-3xl border border-psz-forest/10 bg-white/80 p-6 shadow-panel backdrop-blur transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-psz-forest text-xs font-bold tracking-wider text-psz-cream">
              {card.symbol}
            </div>
            <h3 className="font-heading text-2xl text-psz-forest">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-psz-charcoal/80">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
