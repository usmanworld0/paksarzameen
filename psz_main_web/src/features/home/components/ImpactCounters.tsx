"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import type { ImpactStat } from "@/lib/models/ImpactStat";

type ImpactCountersProps = {
  stats: ImpactStat[];
};

const statIconMap: Record<string, string> = {
  users: "US",
  map: "RG",
  package: "PD",
  heart: "IM",
};

export function ImpactCounters({ stats }: ImpactCountersProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [countedValues, setCountedValues] = useState<number[]>(
    () => stats.map(() => 0),
  );

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame = 0;
    const duration = 1300;
    const startedAt = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCountedValues(stats.map((item) => Math.round(item.value * progress)));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isInView, stats]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-psz-forest py-20"
      aria-labelledby="impact-counters-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(211,180,131,0.24),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.12),transparent_35%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-psz-sand">
            Impact Snapshot
          </p>
          <h2
            id="impact-counters-heading"
            className="mt-3 font-heading text-4xl leading-tight text-psz-cream sm:text-5xl"
          >
            Numbers That Reflect Collective Progress
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.id}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-3xl border border-psz-cream/15 bg-white/10 p-6 backdrop-blur"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-psz-sand/50 text-xs font-bold tracking-wider text-psz-sand">
                {statIconMap[stat.icon] ?? "PS"}
              </div>
              <p className="mt-5 font-heading text-4xl text-psz-cream sm:text-5xl">
                {new Intl.NumberFormat("en-US").format(countedValues[index] ?? 0)}+
              </p>
              <p className="mt-2 text-sm text-psz-cream/85">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
