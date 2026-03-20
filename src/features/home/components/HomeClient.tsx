"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/motion-primitives";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  storiesContent,
  HEART_MEMBERS,
  PROGRAM_CARDS,
  TESTIMONIAL_AVATARS,
  PSZ_CHAPTERS,
} from "@/features/home/home.content";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { getBlurDataURL, getOptimizedImagePath, VIDEO_POSTERS } from "@/lib/utils/media-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Video Sources — Local & Pexels (use SD/720p for performance) ─── */
const VIDEOS = {
  hero: "/videos/hero_video.webm",
  banner: "/videos/banner.webm",
  mission: "/videos/programs.webm",
  // Reduced from UHD → 720p variants for faster loading
  education:
    "https://www.pexels.com/download/video/3209298/",
  empowerment:
    "https://videos.pexels.com/video-files/3191572/3191572-hd_1280_720_25fps.mp4",
  enterprise:
    "https://www.pexels.com/download/video/16118544/",
  impact:
    "https://videos.pexels.com/video-files/4492224/4492224-hd_1280_720_25fps.mp4",
  volunteers:
    "https://www.pexels.com/download/video/6646701/",
  programs: "/videos/programs.webm",
} as const;



/* ─── Canvas frame animation images (optimized WebP versions) ─── */
const CANVAS_FRAME_SEEDS = [
  "/images/hero-fallback.svg",
  "/images/optimized/placeholders/10-md.webp",
  "/images/optimized/whatsapp-image-2026-03-06-at-5-01-33-am-md.webp",
  "/images/optimized/whatsapp-image-2026-03-06-at-5-07-22-am-md.webp",
  "/images/optimized/whatsapp-image-2026-03-06-at-5-08-52-am-sm.webp",
  "/images/optimized/whatsapp-image-2026-03-06-at-5-00-43-am-md.webp",
  "/images/hero-fallback.svg",
  "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "/images/optimized/placeholders/10-md.webp",
  "/images/hero-fallback.svg",
  "/images/optimized/full-team-md.webp",
  "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
] as const;

function getCanvasFrameUrl(index: number): string {
  return CANVAS_FRAME_SEEDS[index % CANVAS_FRAME_SEEDS.length];
}

export function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const revealHeroImmediately = useCallback(() => {
    const intro = introRef.current;
    if (intro) {
      intro.style.display = "none";
      intro.style.pointerEvents = "none";
      intro.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";

    const heroVideo = (containerRef.current?.querySelector(
      ".hero-section video"
    ) || heroVideoRef.current) as HTMLVideoElement | null;

    if (heroVideo) {
      gsap.set(heroVideo, { autoAlpha: 1 });
    }

    gsap.set(".hero-label", { opacity: 1, y: 0 });
    gsap.set(".hero-title", { opacity: 1, y: 0 });
    gsap.set(".hero-desc", { opacity: 1, y: 0 });
  }, []);

  /* ─── Cinematic intro timeline ─── */
  const playIntro = useCallback(() => {
    const intro = introRef.current;
    if (!intro) return;

    // Skip intro on repeat visits within the same session
    try {
      if (sessionStorage.getItem("psz-intro-seen")) {
        intro.style.display = "none";
        document.body.style.overflow = "";
        // Reveal hero text immediately
        gsap.set(".hero-label", { opacity: 1, y: 0 });
        gsap.set(".hero-title", { opacity: 1, y: 0 });
        gsap.set(".hero-desc", { opacity: 1, y: 0 });
        return;
      }
      sessionStorage.setItem("psz-intro-seen", "1");
    } catch {
      /* sessionStorage unavailable — play intro normally */
    }

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // keep pointer-events disabled once complete
        intro.style.pointerEvents = "none";
      },
    });

    // 0. Logo scales in with softer rotation + 3D settle
    tl.fromTo(
      ".intro-logo",
      { scale: 0.78, rotationZ: -18, rotationX: 8, opacity: 0, transformOrigin: "50% 50%" },
      {
        scale: 1,
        rotationZ: 0,
        rotationX: 0,
        opacity: 1,
        duration: 0.75,
        ease: "back.out(1.2)",
      },
      0
    );

    // 1. Staggered letter reveal (slide up + rotate)
    tl.fromTo(
      ".intro-letter",
      { y: 36, opacity: 0, rotateX: 40 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.6,
        ease: "back.out(1.1)",
        stagger: 0.055,
      },
      0.25
    );

    // gentle settle bob for the logo to make the reveal feel organic
    tl.to(
      ".intro-logo",
      { y: -4, duration: 0.5, ease: "power2.out", yoyo: true, repeat: 1 },
      ">=0.05"
    );

    // 2. Tagline fades in underneath
    tl.fromTo(
      ".intro-tagline",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.15"
    );

    // 3. Hold for a beat
    tl.to({}, { duration: 0.35 });

    // 4. Text scales up and fades out
    tl.to(".intro-text-wrapper", {
      scale: 1.1,
      opacity: 0,
      duration: 0.55,
      ease: "power3.in",
    });

    // 5. Overlay shrinks into a circle and reveals the hero video behind
    // Re-enable scrolling when the reveal begins so the page isn't blocked
    tl.to(
      intro,
      {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.85,
        ease: "power4.inOut",
        onStart: () => {
          try { document.body.style.overflow = ""; } catch {}
        },
      },
      "-=0.35"
    );

    // 6. Clean up DOM element after transition
    tl.set(intro, { display: "none" });

    // 7. Staggered hero text reveal — label → title → description
    tl.fromTo(
      ".hero-label",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.1"
    );
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      "-=0.45"
    );
    tl.fromTo(
      ".hero-desc",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.45"
    );
  }, []);

  const setupGSAPAnimations = useCallback(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {

      /* ─── Helper: after GSAP creates a pin-spacer, copy the
             section's z-index AND background onto the spacer so
             (a) stacking works and (b) the post-pin "dead zone"
             shows the section colour instead of the raw body bg ─── */
      function propagateZIndex(st: ScrollTrigger) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spacer = (st as any).spacer as HTMLElement | undefined;
        const trigger = st.trigger as HTMLElement | undefined;
        if (spacer && trigger) {
          const section = trigger.closest("[data-scroll-section]") || trigger;
          const computed = window.getComputedStyle(section as HTMLElement);
          const z = computed.zIndex;
          if (z && z !== "auto") {
            spacer.style.zIndex = z;
            (trigger as HTMLElement).style.zIndex = z;
          }
          // Copy background-color so the spacer never shows the raw page bg
          const bg = computed.backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            spacer.style.backgroundColor = bg;
          }
        }
      }

      /* refresh all spacer z-indexes after layout settles */
      ScrollTrigger.addEventListener("refresh", () => {
        ScrollTrigger.getAll().forEach(propagateZIndex);
      });
      /* ─── Pre-hide hero text so it reveals after intro ─── */
      gsap.set(".hero-label", { opacity: 0, y: 30 });
      gsap.set(".hero-title",  { opacity: 0, y: 50 });
      gsap.set(".hero-desc",   { opacity: 0, y: 30 });

      /* ─── Hero: autoplay video ─── */
      const heroVideo = (containerRef.current?.querySelector(
        ".hero-section video"
      ) || heroVideoRef.current) as HTMLVideoElement | null;

      if (heroVideo) {
        gsap.set(heroVideo, { autoAlpha: 1 });
      }

        // Pin the hero section — pinSpacing:false so the next section
        // physically slides OVER the hero as you scroll (Ochi overlap effect)
        ScrollTrigger.create({
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });

        // Hero content drifts up + fades as the next section covers it
        gsap.to(".hero-content", {
          y: -70,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        // Hero video subtly scales up as it's being covered — adds depth
        gsap.to(".hero-section video", {
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

      /* ─── Pinned Video Sections ─── */
      createPinnedVideoTimeline(".section-mission");
      createPinnedVideoTimeline(".section-education");

      /* ─── Heart members reveal timeline ─── */
      /* NOTE: heart section is before programs in the DOM, so register it first
         so ScrollTrigger calculates pin-spacer heights in document order */
      createMembersTimeline();

      /* ─── Programs — sequential center-stage animation ─── */
      createProgramsTimeline();

      /* ─── Canvas frame animation ─── */
      setupCanvasAnimation();

      /* Force ScrollTrigger to recalculate positions after pinned sections are set up */
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      /* ─── Ochi-style per-section parallax speed variation ─── */
      /* Non-pinned sections get varying y-translations based on scroll,
         creating a breathing depth effect like Ochi Design */
      const parallaxSections: { selector: string; speed: number }[] = [
        { selector: ".split-section", speed: -0.15 },
        { selector: ".approach-section", speed: 0.08 },
        { selector: ".showcase-section", speed: -0.1 },
        { selector: ".highlight-section", speed: 0.12 },
        { selector: ".testimonials-section", speed: -0.08 },
        { selector: ".chapters-section", speed: 0.06 },
        { selector: ".impact-text-section", speed: -0.05 },
      ];

      parallaxSections.forEach(({ selector, speed }) => {
        const els = document.querySelectorAll(selector);
        els.forEach((el) => {
          gsap.to(el, {
            y: () => speed * 120,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      });

      /* ─── Ochi-style section entrance reveals ─── */
      /* Sections reveal with a clip-path + scale transition as they enter viewport */
      document.querySelectorAll(".ochi-section-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          {
            clipPath: "inset(8% 4% 8% 4% round 20px)",
            scale: 0.96,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 25%",
              scrub: 0.4,
            },
          }
        );
      });

      /* ─── Scroll text blocks parallax ─── */
      document.querySelectorAll(".scroll-text-block").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          }
        );
      });

      gsap.to(".section-final-cta .overlay-img", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-final-cta",
          start: "top 20%",
          end: "bottom 80%",
          scrub: true,
          pin: true,
        },
      });

      /* ─── Scroll-reveal: Ochi-style cubic-bezier clip-path reveals ─── */
      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        const delay = parseFloat((el as HTMLElement).dataset.delay || "0");
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            delay,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* ─── Ochi-style highlight text word reveal ─── */
      document.querySelectorAll(".highlight-section p span").forEach((span, i) => {
        gsap.fromTo(
          span,
          { opacity: 0.3, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: span,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* ─── Fade-in sections with Ochi easing ─── */
      document.querySelectorAll(".fade-in-section").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
              scrub: true,
            },
          }
        );
      });

      /* ─── Stats counter animation ─── */
      document.querySelectorAll(".stat-number").forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
          onUpdate: () => {
            (el as HTMLElement).textContent =
              Math.floor(obj.val).toLocaleString() + "+";
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createProgramsTimeline() {
    const container = containerRef.current;
    if (!container) return;

    const section = container.querySelector(".programs-stack-section") as HTMLElement | null;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".stack-card")) as HTMLElement[];
    const dots = Array.from(section.querySelectorAll(".prog-dot")) as HTMLElement[];
    if (!cards.length) return;

    // Initial state — all cards hidden below with blur + tilt
    gsap.set(cards, {
      y: "110%",
      rotation: 4,
      scale: 0.88,
      filter: "blur(24px)",
      opacity: 0,
      transformOrigin: "50% 100%",
    });
    if (dots.length) {
      gsap.set(dots, { scale: 0.75, opacity: 0.3 });
      gsap.set(dots[0], { scale: 1.4, opacity: 1 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".programs-stack-section",
        start: "top top",
        end: `+=${cards.length * 50}%`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
      },
    });

    cards.forEach((card, i) => {
      // ── Enter: slide up, lose blur, settle ──
      tl.to(card, {
        y: 0,
        rotation: 0,
        scale: 1,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });

      // ── Activate corresponding dot ──
      if (dots.length > i) {
        tl.to(dots[i], { scale: 1.4, opacity: 1, duration: 0.3 }, "<0.5");
        if (i > 0) tl.to(dots[i - 1], { scale: 0.75, opacity: 0.3, duration: 0.3 }, "<");
      }

      // ── Hold ──
      tl.to({}, { duration: 0.6 });

      // ── Push all previous cards back with depth blur ──
      if (i < cards.length - 1) {
        cards.slice(0, i + 1).forEach((prev, j) => {
          const depth = i - j + 1;
          tl.to(
            prev,
            {
              scale: 1 - depth * 0.042,
              y: `-${depth * 1.8}%`,
              filter: `blur(${Math.min(depth * 3, 14)}px)`,
              rotationX: depth * 1.0,
              opacity: Math.max(0.7 - depth * 0.18, 0.15),
              duration: 0.8,
              ease: "power3.inOut",
            },
            "<"
          );
        });
      }
    });
  }

  function createMembersTimeline() {
    const container = containerRef.current;
    if (!container) return;

    const section = container.querySelector(".heart-section") as HTMLElement | null;
    if (!section) return;

    const images = Array.from(section.querySelectorAll(".heart-member-img")) as HTMLElement[];
    const infos = Array.from(section.querySelectorAll(".heart-member-info")) as HTMLElement[];
    const counter = section.querySelector(".heart-counter-current") as HTMLElement | null;
    const progressBar = section.querySelector(".heart-progress-bar") as HTMLElement | null;
    if (!images.length) return;

    const total = images.length;

    gsap.set(images, { opacity: 0, scale: 1.08, filter: "blur(12px)" });
    gsap.set(infos, { opacity: 0, y: 40, filter: "blur(6px)" });
    gsap.set(images[0], { opacity: 1, scale: 1, filter: "blur(0px)" });
    gsap.set(infos[0], { opacity: 1, y: 0, filter: "blur(0px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".heart-section",
        start: "top top",
        end: `+=${total * 35}%`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * total), total - 1);
          if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
          if (progressBar) progressBar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    for (let i = 0; i < total - 1; i++) {
      const crossStart = i + 0.65;

      tl.to(
        images[i],
        {
          opacity: 0,
          scale: 0.95,
          filter: "blur(8px)",
          duration: 0.35,
          ease: "power2.in",
        },
        crossStart
      );
      tl.to(
        infos[i],
        { opacity: 0, y: -24, filter: "blur(6px)", duration: 0.35, ease: "power2.in" },
        crossStart
      );

      tl.to(
        images[i + 1],
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
        crossStart + 0.15
      );
      tl.to(
        infos[i + 1],
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power3.out" },
        crossStart + 0.18
      );
    }

    tl.to({}, { duration: 0.5 }, total - 0.5);
  }

  function setupCanvasAnimation() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1200;
    canvas.height = 800;

    const frameCount = 12;
    const images: HTMLImageElement[] = [];
    const imageSeq = { frame: 0 };
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new globalThis.Image();
      img.crossOrigin = "anonymous";
      img.src = getCanvasFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) renderFrame(img, context);
      };
      images.push(img);
    }

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ".canvas-section",
        start: "top top",
        end: "200% top",
        scrub: 0.15,
        pin: true,
      },
      onUpdate: () => {
        const img = images[Math.round(imageSeq.frame)];
        if (img && img.complete) renderFrame(img, context);
      },
    });
  }

  function renderFrame(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const shiftX = (canvas.width - img.width * ratio) / 2;
    const shiftY = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img, 0, 0, img.width, img.height,
      shiftX, shiftY, img.width * ratio, img.height * ratio
    );
  }

  function createPinnedVideoTimeline(selector: string) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: selector,
        start: "top top",
        end: "80% top",
        scrub: 0.5,
        pin: true,
        // pinSpacing: false keeps the spacer = section's own height only.
        // The next section therefore starts right after the section content,
        // so it slides OVER the still-visible pinned section (Ochi card effect)
        // rather than sliding over an empty dark-background dead zone.
        pinSpacing: false,
      },
    });

    // ── Hold: text visible for the first 35% of the scroll journey
    tl.to({}, { duration: 0.25 });

    // ── Then smoothly fade text away in the remaining 40%
    tl.to(`${selector} .section-text`, {
      opacity: 0,
      y: -50,
      ease: "power3.inOut",
      duration: 0.4,
    });

    // ── Media blurs out simultaneously
    tl.to(
      `${selector} video, ${selector} img:not(.no-filter)`,
      {
        filter: "blur(4px) grayscale(60%)",
        scale: 1.02,
        x: "-1%",
        duration: 0.4,
        ease: "power2.out",
      },
      "<"
    );
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any;
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

    const isMobileLite =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileLite) {
      revealHeroImmediately();
      return () => {
        if (idleHandle !== null && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleHandle);
        }
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      };
    }

    const initAll = async () => {
      try {
        const LenisModule = await import("lenis");
        const Lenis = LenisModule.default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          lerp: 0.08,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(1000, 16);
      } catch {
        /* Fallback without Lenis */
      }
      // Play intro first, then set up scroll animations
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        playIntro();
        timeoutHandle = setTimeout(() => {
          setupGSAPAnimations();
        }, 100);
      });
    };

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(() => {
        void initAll();
      }, { timeout: 1200 });
    } else {
      void initAll();
    }

    return () => {
      if (idleHandle !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) lenis.destroy();
    };
  }, [setupGSAPAnimations, playIntro, revealHeroImmediately]);

  return (
    <div ref={containerRef}>
      {/* ════════════════════════════════════════════════ */}
      {/* INTRO SPLASH — Black screen with text reveal    */}
      {/* ════════════════════════════════════════════════ */}
      <div ref={introRef} className="intro-overlay">
        <div className="intro-text-wrapper">
          <div className="intro-content">
            <Image
              src="/paksarzameen_logo.png"
              alt="PakSarZameen Logo"
              className="intro-logo"
              width={140}
              height={140}
              priority
            />
            {/* Animated text reveal */}
            <h1 className="intro-title" aria-hidden>
              {"PakSarZameen".split("").map((ch, i) => (
                <span
                  key={i}
                className={`intro-letter${
                  ch === "S" || ch === "a" || ch === "r"
                    ? i >= 3 && i <= 5
                      ? " green"
                      : ""
                    : ""
                }`}
              >
                {ch}
              </span>
            ))}
            </h1>
            <p className="intro-tagline">Nurturing character as the foundation of meaningful education — تربیت سے تعلیم</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* HERO — Full-screen video with dark overlay      */}
      {/* ════════════════════════════════════════════════ */}
      <section className="hero-section" data-scroll-section="hero">
        <video ref={heroVideoRef} src={VIDEOS.hero} muted loop playsInline preload="none" controls={false} autoPlay={true} poster={VIDEO_POSTERS.hero} />
        <div className="blur-overlay" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-label">Introducing</p>
          <h1 className="hero-title">
            Pak<span className="green">Sar</span>Zameen
          </h1>
          <p
            className="hero-desc"
            style={{
              fontSize: "var(--fs-vs)",
              color: "rgba(255,255,255,0.85)",
              marginTop: "2rem",
              maxWidth: "640px",
              lineHeight: 1.6,
            }}
          >
            Nurturing character as the foundation of meaningful education.
            <br />
            <em style={{ display: "block", marginTop: "0.6rem", fontSize: "0.95em" }}>تربیت سے تعلیم</em>
          </p>
        </div>
      </section>
      
     
      {/* ════════════════════════════════════════════════ */}
      {/* PINNED VIDEO — Mission                          */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-mission" data-scroll-section="mission">
        <LazyVideo src={VIDEOS.mission} rootMargin="400px" poster={VIDEO_POSTERS.programs} />
        <div className="mission-bg-overlay" aria-hidden="true" />
        <div className="section-text">
          <p>
            A seamless blend of social impact and community empowerment.
            Transforming lives across Pakistan through education, compassion, and
            grassroots progress.
          </p>
        </div>
      </section>
       {/* ════════════════════════════════════════════════ */}
      {/* OCHI-STYLE MARQUEE BANNER                        */}
      {/* ════════════════════════════════════════════════ */}
      <section className="ochi-marquee-section" aria-hidden="true">
        <div className="ochi-marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="ochi-marquee-word">
              PakSarZameen &mdash; Nurturing Character &mdash; Building Community Wealth &mdash;&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SPLIT — Our Story                               */}
      {/* ════════════════════════════════════════════════ */}
      <section className="split-section ochi-section-reveal" data-scroll-section="story">
        <div className="split-inner">
          <div className="split-left">
            <TextReveal text="Building Community Wealth." as="h2" staggerDelay={0.035} className="split-left-heading" />
          </div>
          <div className="split-right">
            <p>
              PakSarZameen bridges the gap between intention and action. Our
              mission-driven approach creates sustainable pathways for education,
              healthcare, and economic empowerment in underserved communities
              across Pakistan.
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              Founded on the belief that every community has the power to rise,
              PSZ works hand-in-hand with local leaders to design programs that
              are practical, scalable, and culturally rooted.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", columnGap: "2rem", rowGap: "0.9rem" }}>
              <Link href="/programs">
                <span>Explore Our Programs</span> →
              </Link>
              <Link href="/about">
                <span>Our Story</span> →
              </Link>
            </div>
          </div>
        </div>
      </section>

 {/* ════════════════════════════════════════════════ */}
      {/* OUR APPROACH                                    */}
      {/* ════════════════════════════════════════════════ */}
      <section className="approach-section ochi-section-reveal" data-scroll-section="approach">
        {/* Background image grid — optimized with next/image */}
        <div className="approach-bg-grid" aria-hidden="true">
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 5.07.22 AM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.07.22 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/full_team.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/full_team.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 4.20.53 PM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.20.53 PM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 5.00.43 AM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.00.43 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 4.03.34 PM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.03.34 PM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 4.04.00 PM.jpeg", "md")} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.04.00 PM.jpeg")} />
          </div>
        </div>
        <div className="approach-bg-overlay" aria-hidden="true" />
        <h5 className="scroll-reveal" data-delay="0">Our Approach</h5>
        <h2 className="scroll-reveal" data-delay="0.1">Grassroots innovation for lasting impact.</h2>
        <p className="scroll-reveal" data-delay="0.2">
          We invest in practical, high-impact local solutions shaped by community
          realities. Every initiative is designed to be sustainable, scalable,
          and deeply rooted in the needs of the people it serves.
        </p>
      </section>


     
      {/* ════════════════════════════════════════════════ */}
      {/* PINNED VIDEO — Education                        */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-education" data-scroll-section="education">
        <Image src="/images/optimized/members/8.webp" alt="Abdullah Tanseer — Founder" className="edu-img no-filter" width={580} height={800} loading="lazy" quality={75} sizes="(max-width: 900px) 100vw, 38vw" />
        {/* Blurred logo backdrop */}
        <Image src="/paksarzameen_logo.png" alt="" aria-hidden className="edu-logo-backdrop" width={620} height={620} loading="lazy" quality={30} />
        <div className="section-text edu-section-text">
          {/* Animated eyebrow label */}
          <div className="edu-textmasker">
            <motion.span
              className="edu-label"
              initial={{ y: "105%" }}
              whileInView={{ y: 0 }}
              transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.65 }}
              viewport={{ once: true }}
            >
              Founder — PakSarZameen
            </motion.span>
          </div>
          {/* Static name (removed animation so it's always visible) */}
          <div className="edu-name-static">
            <span className="edu-name-word">Abdullah</span>
            <span className="edu-name-word">Tanseer</span>
          </div>
          {/* Bio */}
          <motion.p
            className="edu-bio"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.6, delay: 0.38 }}
            viewport={{ once: true }}
          >
            Abdullah Tanseer founded PakSarZameen with a vision to create measurable,
            community-driven impact across education, healthcare, and livelihoods.
            PSZ focuses on practical, scalable solutions that prioritize dignity and local ownership.
          </motion.p>
          {/* Achievements */}
          <motion.ul
            className="edu-achievements"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.6, delay: 0.52 }}
            viewport={{ once: true }}
          >
            <li><strong>50,000+</strong><span>Lives Impacted</span></li>
            <li><strong>120+</strong><span>Schools Powered</span></li>
            <li><strong>15,000+</strong><span>Medical Consultations</span></li>
            <li><strong>3,000+</strong><span>Families Empowered</span></li>
          </motion.ul>
        </div>
      </section>

      
      {/* ════════════════════════════════════════════════ */}
      {/* MISSION PILLARS — Stats & CTA                   */}
      {/* ════════════════════════════════════════════════ */}
      <section className="showcase-section ochi-section-reveal" data-scroll-section="pillars">
        <div className="logo-container">
            <h2
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#1d1d1f",
              textAlign: "center",
              letterSpacing: "-0.03em",
            }}
          >
            Pak<span style={{ color: "var(--psz-green)" }}>Sar</span>Zameen
          </h2>
          <p
            style={{
              fontSize: "var(--fs-vs)",
              color: "var(--light-white)",
              textAlign: "center",
              marginTop: "1rem",
              lineHeight: 1.6,
            }}
          >
            Serving humanity through actionable compassion
          </p>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card fade-in-section">
            <span className="stat-number" data-target="50000">0+</span>
            <span className="stat-label">Lives Impacted</span>
          </div>
          <div className="stat-card fade-in-section">
            <span className="stat-number" data-target="120">0+</span>
            <span className="stat-label">Schools Powered</span>
          </div>
          <div className="stat-card fade-in-section">
            <span className="stat-number" data-target="15000">0+</span>
            <span className="stat-label">Medical Consultations</span>
          </div>
          <div className="stat-card fade-in-section">
            <span className="stat-number" data-target="3000">0+</span>
            <span className="stat-label">Families Empowered</span>
          </div>
        </div>

        <div className="cta-links" style={{ marginTop: "3rem" }}>
          <Link href="/about"><span>Watch our story</span> →</Link>
          <Link href="/programs"><span>Explore programs</span> →</Link>
        </div>

        <div className="showcase-image">
          <Image src={getOptimizedImagePath("/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg", "lg")} alt="PakSarZameen community programs" width={1200} height={600} loading="lazy" quality={75} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>

        <Link href="/get-involved">
          <button className="cta-button" type="button">Get Involved ↗</button>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* PINNED VIDEO — Enterprise                       */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-enterprise" data-scroll-section="enterprise">
        <LazyVideo src="/videos/Info.webm" rootMargin="400px" poster={VIDEO_POSTERS.info} />
        <div className="enterprise-bg-overlay" aria-hidden="true" />
        <div className="section-text">
          <p>
            Sustainable solutions built from the ground up. Community wealth that
            grows from within, creating lasting change for generations.
          </p>
        </div>
      </section>

       {/* ════════════════════════════════════════════════ */}
      {/* OCHI-STYLE MARQUEE BANNER 2                      */}
      {/* ════════════════════════════════════════════════ */}
      <section className="ochi-marquee-section ochi-marquee-reverse" aria-hidden="true">
        <div className="ochi-marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="ochi-marquee-word">
              Impact &mdash; Education &mdash; Healthcare &mdash; Enterprise &mdash; Compassion &mdash;&nbsp;
            </span>
          ))}
        </div>
      </section>

     
      {/* ════════════════════════════════════════════════ */}
      {/* HIGHLIGHT QUOTE                                 */}
      {/* ════════════════════════════════════════════════ */}
      <section className="highlight-section ochi-section-reveal" data-scroll-section="highlight">
        <p>
          Since our inception, PakSarZameen has{" "}
          <span>reached over 50,000 individuals</span> across Pakistan. From
          solar-powered schools in Sindh to mobile health clinics in KPK, our
          programs <span>deliver measurable results</span> in education,
          healthcare, and <span>sustainable livelihoods</span> — driven entirely
          by the communities we serve.
        </p>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* TESTIMONIALS — Community Voices (horizontal marquee) */}
      {/* ════════════════════════════════════════════════ */}
      <section className="testimonials-section" data-scroll-section="voices">
        {/* decorative background elements */}
        <div className="voices-orb voices-orb-1" aria-hidden="true" />
        <div className="voices-orb voices-orb-2" aria-hidden="true" />
        <div className="voices-dot-grid" aria-hidden="true" />

        <div className="voices-header">
          <span className="voices-label scroll-reveal">What People Say</span>
          <h2 className="voices-title scroll-reveal" data-delay="0.1">Community Voices</h2>
          <p className="voices-subtitle scroll-reveal" data-delay="0.2">Real stories from real people whose lives have been touched by PSZ.</p>
        </div>

        {/* big decorative open-quote */}
        <div className="voices-quote-mark" aria-hidden="true">“</div>

        <div className="testimonials-marquee" aria-hidden={false}>
          <div className="marquee-track" role="list">
            {storiesContent.concat(storiesContent).map((s, idx) => {
              const photoUrl = TESTIMONIAL_AVATARS[s.author];
              return (
                <div className="testimonial-card" key={idx} role="listitem">
                  <div className="testimonial-card-quote">“</div>
                  <blockquote>{s.quote}</blockquote>
                  <div className="testimonial-author">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={s.author} className="author-avatar author-avatar-photo" width={80} height={80} loading="lazy" quality={60} />
                    ) : (
                      <div className="author-avatar">{s.author.charAt(0)}</div>
                    )}
                    <div>
                      <strong>{s.author}</strong>
                      <span>{s.role}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* HEART OF PAKSARZAMEEN — Scroll-driven team      */}
      {/* ════════════════════════════════════════════════ */}
      <section className="heart-section" data-scroll-section="heart">
        {/* Decorative bg elements */}
        <div className="heart-bg-gradient" aria-hidden="true" />
        <div className="heart-bg-grid" aria-hidden="true" />

        {/* Section header */}
        <div className="heart-header">
          <span className="heart-label scroll-reveal">Our People</span>
          <h2 className="heart-title scroll-reveal" data-delay="0.1">Heart of PakSarZameen</h2>
        </div>

        {/* Main showcase */}
        <div className="heart-showcase">
          {/* LEFT: Image stack */}
          <div className="heart-image-col">
            <div className="heart-image-frame">
              {HEART_MEMBERS.map((m, i) => (
                <Image
                  key={i}
                  src={m.image}
                  alt={m.name || "Team member"}
                  className="heart-member-img"
                  width={600}
                  height={750}
                  loading={i === 0 ? "eager" : "lazy"}
                  quality={70}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  draggable={false}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Info stack */}
          <div className="heart-info-col">
            {HEART_MEMBERS.map((m, i) => (
              <div key={i} className="heart-member-info">
                <span className="heart-info-designation">{m.designation}</span>
                <h3 className="heart-info-name">{m.name}</h3>
                <blockquote className="heart-info-quote">&ldquo;{m.quote}&rdquo;</blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar: counter + progress */}
        <div className="heart-bottom-bar">
          <div className="heart-counter">
            <span className="heart-counter-current">01</span>
            <span className="heart-counter-sep">/</span>
            <span className="heart-counter-total">{String(HEART_MEMBERS.length).padStart(2, "0")}</span>
          </div>
          <div className="heart-progress">
            <div className="heart-progress-bar" />
          </div>
        </div>
      </section>

     
      {/* ════════════════════════════════════════════════ */}
      {/* PROGRAMS — Stacking Cards Reveal                 */}
      {/* ════════════════════════════════════════════════ */}
      <section className="programs-stack-section" data-scroll-section="programs">
        {/* Background video — lazy-loaded */}
        <LazyVideo
          className="prog-bg-video"
          src={VIDEOS.banner}
          aria-hidden={true}
          rootMargin="600px"
          poster={VIDEO_POSTERS.banner}
        />
        {/* Green overlay */}
        <div className="prog-bg-overlay" aria-hidden="true" />
        {/* Ambient background orbs */}
        <div className="prog-bg-orb prog-orb-1" />
        <div className="prog-bg-orb prog-orb-2" />

        <div className="programs-stack-header">
          <span className="programs-stack-label scroll-reveal">Our Departments</span>
          <h2 className="programs-stack-title scroll-reveal" data-delay="0.1">What We Do</h2>
          <p className="programs-stack-subtitle scroll-reveal" data-delay="0.2">Six specialized departments working in harmony to uplift communities across Pakistan.</p>
        </div>

        <div className="programs-stack-viewport">
          {PROGRAM_CARDS.map((program, i) => (
            <div
              key={program.name}
              className="stack-card"
              data-index={i}
              style={{ "--card-tag-color": program.tagColor } as React.CSSProperties}
            >
              {/* Left — Illustration panel */}
              <div className="stack-card-illus" style={{ background: program.bg }}>
                <div className="illus-shape illus-shape-a" />
                <div className="illus-shape illus-shape-b" />
                <div className="illus-shape illus-shape-c" />
                {/* Placeholder illustration from public/images/placeholders */}
                <Image
                  src={`/images/optimized/placeholders/${10 + i}-md.webp`}
                  alt={`${program.name} icon`}
                  className="illus-icon-img"
                  width={400}
                  height={400}
                  loading="lazy"
                  quality={65}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span className="illus-num">{'0' + (i + 1)}</span>
              </div>

              {/* Right — Content panel */}
              <div className="stack-card-content">
                <span className="stack-card-tag">{program.tag}</span>
                <h3 className="stack-card-name">{program.name}</h3>
                <p className="stack-card-subtitle">{program.subtitle}</p>
                <p className="stack-card-desc">{program.desc}</p>
                <div className="stack-card-counter">
                  <span className="counter-num">{'0' + (i + 1)}</span>
                  <span className="counter-sep"> / 06</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="programs-progress">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="prog-dot" />
          ))}
        </div>

        <div className="programs-stack-cta">
          <Link href="/programs" className="view-all-link">Explore All Programs →</Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* DARK BOTTOM — Impact Sections                   */}
      {/* ════════════════════════════════════════════════ */}
      <div className="dark-bottom" data-scroll-section="impact">
        {/* ── Our Chapters ── */}
        <section className="chapters-section">
          {/* Diagonal flowing city names backdrop */}
          <div className="chapters-diag-bg" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="chapters-diag-col">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i}>PakSarZameen &bull; Bahawalpur &bull; Islamabad &bull; Hyderabad &bull; Multan &bull; Lahore</span>
                ))}
              </div>
            ))}
          </div>

          {/* Background orbs */}
          <div className="chapters-orb chapters-orb-1" />
          <div className="chapters-orb chapters-orb-2" />

          <div className="chapters-header">
            <p className="chapters-label scroll-reveal">Where We Operate</p>
            <h2 className="chapters-title scroll-reveal" data-delay="0.1">Our Chapters</h2>
            <p className="chapters-subtitle scroll-reveal" data-delay="0.2">
              PakSarZameen is on the ground across Pakistan — each chapter tailored to
              regional challenges and opportunities.
            </p>
          </div>

          {/* Globe + Connecting Lines (decorative SVG) */}
          <div className="chapters-globe scroll-reveal" data-delay="0.15">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="chapters-globe-svg">
              <circle cx="60" cy="60" r="54" stroke="rgba(15,122,71,0.18)" strokeWidth="1.2"/>
              <ellipse cx="60" cy="60" rx="54" ry="22" stroke="rgba(15,122,71,0.14)" strokeWidth="0.8"/>
              <ellipse cx="60" cy="60" rx="22" ry="54" stroke="rgba(15,122,71,0.14)" strokeWidth="0.8"/>
              <line x1="60" y1="6" x2="60" y2="114" stroke="rgba(15,122,71,0.1)" strokeWidth="0.6"/>
              <line x1="6" y1="60" x2="114" y2="60" stroke="rgba(15,122,71,0.1)" strokeWidth="0.6"/>
              {/* Pin dots for each city */}
              <circle cx="62" cy="32" r="3" fill="#0f7a47" opacity="0.9"><animate attributeName="r" values="3;4.5;3" dur="2.5s" repeatCount="indefinite"/></circle>
              <circle cx="50" cy="48" r="3" fill="#c4a265" opacity="0.9"><animate attributeName="r" values="3;4.5;3" dur="2.8s" repeatCount="indefinite"/></circle>
              <circle cx="42" cy="65" r="3" fill="#3b82f6" opacity="0.9"><animate attributeName="r" values="3;4.5;3" dur="3.1s" repeatCount="indefinite"/></circle>
              <circle cx="55" cy="44" r="3" fill="#ef4444" opacity="0.9"><animate attributeName="r" values="3;4.5;3" dur="2.2s" repeatCount="indefinite"/></circle>
              <circle cx="48" cy="52" r="3" fill="#8b5cf6" opacity="0.9"><animate attributeName="r" values="3;4.5;3" dur="2.6s" repeatCount="indefinite"/></circle>
            </svg>
          </div>

          {/* Chapter cards grid */}
          <div className="chapters-grid">
            {PSZ_CHAPTERS.map((ch, i) => (
              <div
                key={ch.city}
                className="chapter-card fade-in-section"
                style={{ "--chapter-accent": ch.accent } as React.CSSProperties}
              >
                {/* Landmark icon */}
                <div className="chapter-icon">
                  {ch.icon === "faisal-mosque" && (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 4L8 32h8l-4 24h40l-4-24h8L32 4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M32 4v14M24 56V38a8 8 0 0116 0v18" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="32" cy="22" r="3" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                  {ch.icon === "noor-mahal" && (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="12" y="28" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M20 28V20a12 12 0 0124 0v8" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="32" cy="16" r="3" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="12" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                      <rect x="27" y="44" width="10" height="12" rx="5" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="8" y1="56" x2="12" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="56" y1="56" x2="52" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  )}
                  {ch.icon === "pakka-qila" && (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="24" width="44" height="32" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="6" y="20" width="8" height="36" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="50" y="20" width="8" height="36" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M6 20l4-8 4 8M50 20l4-8 4 8" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="26" y="40" width="12" height="16" rx="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M22 24h20v4H22z" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                    </svg>
                  )}
                  {ch.icon === "minar-e-pakistan" && (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 4v52M24 56h16" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M28 56l-4 4h16l-4-4" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M32 12l-8 16h16L32 12z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="32" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M26 36h12v6H26z" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                      <path d="M29 42h6v14h-6z" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                    </svg>
                  )}
                  {ch.icon === "shah-rukn-e-alam" && (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 6a18 18 0 0118 18v4H14v-4A18 18 0 0132 6z" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="14" y="28" width="36" height="28" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="27" y="38" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="32" cy="14" r="3" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="32" y1="4" x2="32" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="32" cy="3" r="1.5" fill="currentColor" opacity="0.6"/>
                    </svg>
                  )}
                </div>

                {/* City info */}
                <h3 className="chapter-city">{ch.city}</h3>
                <p className="chapter-tagline">{ch.tagline}</p>

                {/* Accent bottom bar */}
                <div className="chapter-bar" />

                {/* Index number */}
                <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Detail 1 */}
        <section className="impact-text-section">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}>
            <Link href="/blood-bank" style={{
              background: "linear-gradient(90deg,#cf2c2c,#9f1717)",
              color: "#fff",
              padding: "0.8rem 1.2rem",
              borderRadius: "999px",
              fontWeight: 800,
              boxShadow: "0 8px 30px rgba(207,44,44,0.18)",
              textDecoration: "none",
            }}>
              24/7 Blood Availability — Open Blood Bank
            </Link>
          </div>
          <h5>Measurable Impact</h5>
          <p>
            Our <span>Room Zia</span> initiative powers <span>120+ schools</span> with solar electricity.
            Our <span>mobile health clinics</span> have delivered <span>15,000+ medical consultations</span>
            in remote areas of Sindh and KPK.
          </p>
        </section>

        {/* Impact Detail 2 */}
        <section className="impact-text-section" style={{ paddingTop: "4rem" }}>
          <h5>Scale & Reach</h5>
          <p>
            In <span>2024</span>, we expanded to <span>15 new districts</span>. Our disaster response provided
            relief to <span>12,000 families</span> affected by flooding. Clean water installations
            now serve <span>8 villages</span> in Tharparkar with no prior access to potable water.
          </p>
        </section>

        {/* Partners CTA */}
        <section className="impact-text-section impact-partners-section">
          <h5>500+ Volunteers. One Mission.</h5>
          <p>
            We partner with <span>government bodies</span>, <span>international NGOs</span>,
            and <span>private sector leaders</span>. With <span>500+ active volunteers</span>
            across Pakistan, we are a movement united by purpose.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: "2rem", rowGap: "0.9rem", justifyContent: "center", marginTop: "3rem" }}>
            <Link href="/get-involved" style={{ color: "var(--psz-green)", fontSize: "var(--fs-vs)", fontWeight: 500 }}>
              Become a Volunteer →
            </Link>
            <Link href="/contact" style={{ color: "var(--psz-green)", fontSize: "var(--fs-vs)", fontWeight: 500 }}>
              Partner With Us →
            </Link>
            <a
              href="https://pk.linkedin.com/company/pak-sar-zameen-development-org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--psz-green)", fontSize: "var(--fs-vs)", fontWeight: 500 }}
            >
              LinkedIn →
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section section-final-cta">
          <div className="reveal-text">
            <h5>Ready to Make a Difference?</h5>
            <p>
              Whether you <span>volunteer, donate, or partner</span> — your action creates impact.
              Together, we build a Pakistan where every community thrives with dignity.
            </p>
          </div>
          <Link href="/get-involved">
            <button className="final-btn" type="button">→ Get Involved</button>
          </Link>
        </section>

      </div>
    </div>
  );
}
