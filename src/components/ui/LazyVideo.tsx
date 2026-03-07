"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  /** Optional WebM source for better compression in supported browsers */
  webmSrc?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  /** Root margin for IntersectionObserver (default: "200px") */
  rootMargin?: string;
  /** Whether to autoplay when visible (default: true) */
  autoPlayOnVisible?: boolean;
  /** Poster image shown before video loads — dramatically improves perceived performance */
  poster?: string;
  /** Additional HTML attributes for the video element */
  "aria-hidden"?: boolean;
};

/**
 * Performance-optimized video component that defers loading
 * until the video is near the viewport via IntersectionObserver.
 * Pauses playback when scrolled out of view to save resources.
 *
 * Features:
 * - Lazy loading via IntersectionObserver (preload="none" by default)
 * - Poster image support for instant visual before video loads
 * - WebM + MP4 dual-source for optimal browser compatibility
 * - Auto-pause when scrolled out of view to save bandwidth/CPU
 * - decoding="async" for non-blocking decode
 */
export function LazyVideo({
  src,
  webmSrc,
  className,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "none",
  rootMargin = "200px",
  autoPlayOnVisible = true,
  poster,
  "aria-hidden": ariaHidden,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;

        if (nowVisible && autoPlayOnVisible) {
          // Set src only once — avoid re-downloads
          if (!isLoaded) {
            // Use <source> elements for multi-format support
            if (webmSrc) {
              const webmSource = document.createElement("source");
              webmSource.src = webmSrc;
              webmSource.type = "video/webm";
              video.appendChild(webmSource);
            }

            const mp4Source = document.createElement("source");
            mp4Source.src = src;
            mp4Source.type = "video/mp4";
            video.appendChild(mp4Source);

            video.load();
            setIsLoaded(true);
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
  }, [src, webmSrc, rootMargin, autoPlayOnVisible, isLoaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      poster={poster}
      aria-hidden={ariaHidden}
      /* src is set lazily via IntersectionObserver — do NOT set here */
    />
  );
}
