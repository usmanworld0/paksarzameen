"use client";

import { useEffect, useRef } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  /** Root margin for IntersectionObserver (default: "200px") */
  rootMargin?: string;
  /** Whether to autoplay when visible (default: true) */
  autoPlayOnVisible?: boolean;
  /** Additional HTML attributes for the video element */
  "aria-hidden"?: boolean;
};

/**
 * Performance-optimized video component that defers loading
 * until the video is near the viewport via IntersectionObserver.
 * Pauses playback when scrolled out of view to save resources.
 */
export function LazyVideo({
  src,
  className,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "none",
  rootMargin = "200px",
  autoPlayOnVisible = true,
  "aria-hidden": ariaHidden,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;

        if (nowVisible && autoPlayOnVisible) {
          // Set src only once — avoid re-downloads
          if (!video.src || video.src === window.location.href) {
            video.src = src;
            video.load();
          }
          video.play().catch(() => {
            /* autoplay blocked — no-op */
          });
        } else {
          video.pause();
        }
      },
      { rootMargin, threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, rootMargin, autoPlayOnVisible]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      aria-hidden={ariaHidden}
      /* src is set lazily via IntersectionObserver — do NOT set here */
    />
  );
}
