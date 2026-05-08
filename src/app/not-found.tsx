import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3ee] px-[5%] text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">404</p>
      <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-[40ch] text-sm font-medium text-[#707072]">
        The page you&apos;re looking for may have moved, expired, or never
        existed in this section of the site.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-[#111111] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
      >
        Go Home
      </Link>
    </main>
  );
}
