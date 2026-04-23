type AdminDataNoticeProps = {
  title?: string;
  message: string;
};

export function AdminDataNotice({
  title = "Live data unavailable",
  message,
}: AdminDataNoticeProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
        {title}
      </p>
      <p className="mt-2 leading-relaxed text-amber-900/90">{message}</p>
    </div>
  );
}
