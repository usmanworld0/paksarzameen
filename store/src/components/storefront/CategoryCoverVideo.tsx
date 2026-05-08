"use client";

import { useState } from "react";

type Props = {
  src: string;
  webmSrc?: string;
  poster?: string;
  className?: string;
};

export default function CategoryCoverVideo({ src, webmSrc, poster, className }: Props) {
  const [muted, setMuted] = useState(true);

  return (
    <section className={`relative h-[100svh] w-full overflow-hidden bg-neutral-100 ${className ?? ""}`}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        muted={muted}
        preload="metadata"
        poster={poster}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute right-4 bottom-4 z-20">
        <button
          type="button"
          aria-pressed={!muted}
          onClick={() => setMuted((m) => !m)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 p-2 shadow-md transition hover:opacity-90"
          title={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-black">
              <path d="M16 7v10l-4-4H8V11h4l4-4z" fill="currentColor" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-black">
              <path d="M5 9v6h4l5 5V4L9 9H5z" fill="currentColor" />
              <path d="M16.5 12c0-1.77-.77-3.36-1.98-4.44l1.42-1.42A7.48 7.48 0 0 1 18.5 12c0 2-0.78 3.82-2.06 5.18l-1.42-1.42A4.99 4.99 0 0 0 16.5 12z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
