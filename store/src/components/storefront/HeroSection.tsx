import Image from "next/image";
import Link from "next/link";
import type { StorefrontHeroData } from "@/types/storefront";

type HeroSectionProps = {
  data: StorefrontHeroData;
};

export function Hero({ data }: HeroSectionProps) {
  const {
    eyebrow,
    title,
    subtitle,
    ctaLabel,
    ctaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    media,
  } = data;

  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden bg-black text-white">
      {media.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={media.poster}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="100vw"
          className="object-cover"
          quality={92}
          priority
          unoptimized={media.src.startsWith("http")}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.1)_32%,rgba(0,0,0,0.4)_72%,rgba(0,0,0,0.58)_100%)]" />

      <div className="relative z-10 flex min-h-[90vh] items-end justify-center px-6 pb-14 pt-24 text-center sm:pb-16 lg:pb-20">
        <div className="max-w-[720px]">
          {eyebrow ? (
            <p className="text-[11px] font-normal text-white/90 tracking-normal">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-[clamp(1.15rem,2.4vw,1.9rem)] font-normal leading-[1.06] tracking-[-0.02em] text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-xl text-[13px] leading-7 text-white/78 sm:text-sm">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {ctaLabel && ctaHref ? (
              <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center border-b border-white/72 pb-1 text-[clamp(0.85rem,1vw,1rem)] font-normal leading-none tracking-[-0.01em] text-white transition-opacity hover:opacity-70"
                >
                  {ctaLabel}
                </Link>
            ) : null}
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-3.5 py-1.5 text-[0.75rem] uppercase tracking-[0.12em] text-white/88 transition hover:bg-white/10"
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = Hero;
