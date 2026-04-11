type DatabaseConfigNoticeProps = {
  compact?: boolean;
};

export function DatabaseConfigNotice({ compact = false }: DatabaseConfigNoticeProps) {
  return (
    <section
      className={`rounded-2xl border border-amber-300 bg-amber-50 text-amber-950 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
        Configuration Required
      </p>
      <h2 className="mt-2 text-xl font-medium tracking-[-0.02em]">
        Store database is not connected.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
        Add <strong>DATABASE_URL</strong> in your environment (local <strong>.env</strong>/<strong>.env.local</strong> or Vercel project vars),
        then run <strong>npm run db:push</strong> and <strong>npm run db:seed</strong> in the store app.
      </p>
    </section>
  );
}
