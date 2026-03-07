"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  storiesContent,
  HEART_MEMBERS,
  PROGRAM_CARDS,
  TESTIMONIAL_AVATARS,
} from "@/features/home/home.content";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { getBlurDataURL, VIDEO_POSTERS } from "@/lib/utils/media-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Video Sources — Local & Pexels (use SD/720p for performance) ─── */
const VIDEOS = {
  hero: "/videos/hero_video.mp4",
  banner: "/videos/banner.mp4",
  mission: "/videos/programs.mp4",
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
  programs: "/videos/programs.mp4",
} as const;

/* ─── Image Sources ─── */
const IMAGES = {
  showcase: "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
  fullImage: "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg?auto=compress&cs=tinysrgb&w=1200",
  impactHero: "https://images.pexels.com/photos/6963695/pexels-photo-6963695.jpeg?auto=compress&cs=tinysrgb&w=1200",
  transform1: "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
  transform1Overlay: "/images/WhatsApp%20Image%202026-03-06%20at%205.07.22%20AM.jpeg",
  transform2: "/images/WhatsApp%20Image%202026-03-06%20at%205.08.17%20AM.jpeg",
  transform2Overlay: "/images/WhatsApp%20Image%202026-03-06%20at%205.08.52%20AM.jpeg",
  finalBase: "/images/WhatsApp%20Image%202026-03-06%20at%205.00.43%20AM.jpeg",
  finalOverlay: "/images/hero-fallback.svg",
} as const;

/* ─── Canvas frame animation images (re-uses existing local assets) ─── */
const CANVAS_FRAME_SEEDS = [
  "/images/hero-fallback.svg",
  "/images/placeholders/10.png",
  "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
  "/images/WhatsApp%20Image%202026-03-06%20at%205.07.22%20AM.jpeg",
  "/images/WhatsApp%20Image%202026-03-06%20at%205.08.17%20AM.jpeg",
  "/images/WhatsApp%20Image%202026-03-06%20at%205.08.52%20AM.jpeg",
  "/images/WhatsApp%20Image%202026-03-06%20at%205.00.43%20AM.jpeg",
  "/images/hero-fallback.svg",
  "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "/images/placeholders/10.png",
  "/images/hero-fallback.svg",
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

  /* ─── Cinematic intro timeline ─── */
  const playIntro = useCallback(() => {
    const intro = introRef.current;
    if (!intro) return;

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
             section's z-index onto the spacer so stacking works ─── */
      function propagateZIndex(st: ScrollTrigger) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spacer = (st as any).spacer as HTMLElement | undefined;
        const trigger = st.trigger as HTMLElement | undefined;
        if (spacer && trigger) {
          const section = trigger.closest("[data-scroll-section]") || trigger;
          const z = window.getComputedStyle(section).zIndex;
          if (z && z !== "auto") {
            spacer.style.zIndex = z;
            (trigger as HTMLElement).style.zIndex = z;
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

      /* ─── Hero: start paused, play when user scrolls for the first time ─── */
      const heroVideo = (containerRef.current?.querySelector(
        ".hero-section video"
      ) || heroVideoRef.current) as HTMLVideoElement | null;

      if (heroVideo) {
        // Hard stop — video is paused and visible from the start
        heroVideo.pause();
        heroVideo.currentTime = 0;
        gsap.set(heroVideo, { autoAlpha: 1 });

        // Play on the very first scroll interaction, then remove the listener
        const onFirstScroll = () => {
          heroVideo.play().catch(() => {});
        };
        window.addEventListener("wheel",     onFirstScroll, { once: true, passive: true });
        window.addEventListener("touchmove", onFirstScroll, { once: true, passive: true });

        // Pin the hero section so it stays on screen while scrolling
        ScrollTrigger.create({
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          pin: true,
        });
      }

      /* ─── Pinned Video Sections ─── */
      createPinnedVideoTimeline(".section-mission");
      createPinnedVideoTimeline(".section-education");
      createPinnedVideoTimeline(".section-enterprise");

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

      /* ─── Scroll-reveal: headings + paragraphs in text sections ─── */
      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        const delay = parseFloat((el as HTMLElement).dataset.delay || "0");
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            delay,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* ─── Fade-in sections ─── */
      document.querySelectorAll(".fade-in-section").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
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
        end: `+=${cards.length * 130}%`,
        pin: true,
        scrub: 0.45,
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
        duration: 1.6,
        ease: "expo.out",
      });

      // ── Activate corresponding dot ──
      if (dots.length > i) {
        tl.to(dots[i], { scale: 1.4, opacity: 1, duration: 0.4 }, "<0.7");
        if (i > 0) tl.to(dots[i - 1], { scale: 0.75, opacity: 0.3, duration: 0.4 }, "<");
      }

      // ── Hold ──
      tl.to({}, { duration: 1.1 });

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
              duration: 1.1,
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
        end: `+=${total * 100}%`,
        pin: true,
        scrub: 0.5,
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
        end: "600% top",
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
        end: "bottom top",
        scrub: true,
        pin: true,
      },
    });
    
    // Animate text away
    tl.to(`${selector} .section-text`, { 
      opacity: 0,
      y: -50
    });
    
    // Animate media effect (video or image) — exclude elements with .no-filter
    tl.to(
      `${selector} video, ${selector} img:not(.no-filter)`,
      {
        filter: "blur(4px) grayscale(60%)",
        scale: 1.02,
        x: "-1%",
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any;

    const initAll = async () => {
      try {
        const LenisModule = await import("lenis");
        const Lenis = LenisModule.default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
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
        // Add small delay to ensure page layout is complete before setting up ScrollTrigger
        setTimeout(() => {
          setupGSAPAnimations();
        }, 100);
      });
    };

    initAll();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) lenis.destroy();
    };
  }, [setupGSAPAnimations, playIntro]);

  return (
    <div ref={containerRef}>
      {/* ════════════════════════════════════════════════ */}
      {/* INTRO SPLASH — Black screen with text reveal    */}
      {/* ════════════════════════════════════════════════ */}
      <div ref={introRef} className="intro-overlay">
        <div className="intro-text-wrapper">
          <div className="intro-content">
            {/* Logo animated via GSAP 3D transforms — raw img required */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/paksarzameen_logo.png"
              alt="PakSarZameen Logo"
              className="intro-logo"
              width={140}
              height={140}
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
      {/* HERO — Full-screen video with blurred overlay   */}
      {/* ════════════════════════════════════════════════ */}
      <section className="hero-section" data-scroll-section="hero">
        <video ref={heroVideoRef} src={VIDEOS.hero} muted loop playsInline preload="metadata" controls={false} autoPlay={false} poster={VIDEO_POSTERS.hero} />
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
      {/* SPLIT — Our Story                               */}
      {/* ════════════════════════════════════════════════ */}
      <section className="split-section" data-scroll-section="story">
        <div className="split-inner">
          <div className="split-left">
            <h2>Building Community Wealth.</h2>
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
            <div style={{ marginTop: "2rem", display: "flex", gap: "2rem" }}>
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
      <section className="approach-section" data-scroll-section="approach">
        {/* Background image grid — optimized with next/image */}
        <div className="approach-bg-grid" aria-hidden="true">
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 5.07.22 AM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.07.22 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/full_team.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/full_team.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 4.20.53 PM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.20.53 PM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 5.00.43 AM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 5.00.43 AM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 4.03.34 PM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.03.34 PM.jpeg")} />
          </div>
          <div className="approach-bg-item">
            <Image src="/images/WhatsApp Image 2026-03-06 at 4.04.00 PM.jpeg" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" quality={60} placeholder="blur" blurDataURL={getBlurDataURL("/images/WhatsApp Image 2026-03-06 at 4.04.00 PM.jpeg")} />
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
        <Image src="/images/members/8.png" alt="Abdullah Tanseer — Founder" className="edu-img no-filter" width={580} height={800} loading="lazy" quality={75} sizes="(max-width: 900px) 100vw, 38vw" placeholder="blur" blurDataURL={getBlurDataURL("/images/members/8.png")} />
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
      <section className="showcase-section" data-scroll-section="pillars">
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
          <Image src="/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg" alt="PakSarZameen community programs" width={1200} height={600} loading="lazy" quality={75} sizes="(max-width: 768px) 100vw, 80vw" />
        </div>

        <Link href="/get-involved">
          <button className="cta-button" type="button">Get Involved ↗</button>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* PINNED VIDEO — Enterprise                       */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-enterprise" data-scroll-section="enterprise">
        <LazyVideo src="/videos/Info.mp4" rootMargin="400px" poster={VIDEO_POSTERS.info} />
        <div className="enterprise-bg-overlay" aria-hidden="true" />
        <div className="section-text">
          <p>
            Sustainable solutions built from the ground up. Community wealth that
            grows from within, creating lasting change for generations.
          </p>
        </div>
      </section>

      
      {/* ════════════════════════════════════════════════ */}
      {/* HIGHLIGHT QUOTE                                 */}
      {/* ════════════════════════════════════════════════ */}
      <section className="highlight-section" data-scroll-section="highlight">
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
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(m.image)}
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
                  src={`/images/placeholders/${10 + i}.png`}
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
        {/* Impact Header */}
        <section className="impact-header-section">
          <div className="inner">
            <h5>Our Impact</h5>
            <h2>Breaking the Cycle of Poverty, Inequality, and Environmental Injustice.</h2>
            <p>
              Every rupee, every hour, every effort is tracked and reported.
              PakSarZameen believes in <span>radical transparency</span> —
              because the communities we serve deserve nothing less.
            </p>
            <p style={{ marginTop: "1rem", fontWeight: 600 }}>
              Operating in: Bahawalpur, Multan, Lahore, Islamabad, Hyderabad
            </p>
          </div>
        </section>

        {/* Impact Image */}
        <section className="impact-image-section">
          <div className="image-wrapper">
            <Image src={IMAGES.impactHero} alt="PSZ impact" width={1200} height={800} loading="lazy" quality={70} sizes="100vw" />
          </div>
        </section>

        {/* Impact Detail 1 */}
        <section className="impact-text-section">
          <h5>Programs That Transform</h5>
          <p>
            Our <span>Room Zia</span> initiative has brought solar-powered
            electricity to <span>120+ schools</span>, enabling evening study
            programs and digital learning. Meanwhile, our{" "}
            <span>mobile health clinics</span> have conducted over{" "}
            <span>15,000 medical consultations</span> in remote areas of Sindh
            and KPK.
          </p>
        </section>

        {/* Impact Detail 2 */}
        <section className="impact-text-section" style={{ paddingTop: "4rem" }}>
          <h5>From Intention to Action</h5>
          <p>
            In <span>2024 alone</span>, PSZ expanded operations to{" "}
            <span>15 new districts</span> across Pakistan. Our disaster response
            team provided emergency relief to <span>12,000 families</span>{" "}
            affected by flooding in Sindh. Clean water plants installed in
            Tharparkar now serve <span>8 villages</span> that previously had no
            access to potable water.
          </p>
        </section>

        {/* Impact Video + Text */}
        <section className="impact-video-section">
          <LazyVideo src={VIDEOS.volunteers} rootMargin="300px" poster={VIDEO_POSTERS.programs} />
          <div className="text-block">
            <h5>Enterprise for Dignity</h5>
            <p>
              Our ethical enterprise program empowers women and youth with{" "}
              <span>practical skills training</span>, micro-financing, and
              market access. Over <span>3,000 families</span> have started
              sustainable businesses through PSZ support.
            </p>
          </div>
        </section>

        {/* Partners CTA */}
        <section className="impact-text-section" style={{ paddingBlock: "8rem" }}>
          <h5>Our Partners &amp; Volunteers</h5>
          <p>
            PSZ works with <span>government bodies</span>,{" "}
            <span>international NGOs</span>, and <span>private sector leaders</span>{" "}
            to maximize reach and sustainability. With over{" "}
            <span>500 active volunteers</span> across Pakistan, we are a movement —
            not just an organization.
          </p>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "3rem" }}>
            <Link href="/get-involved" style={{ color: "var(--psz-green)", fontSize: "var(--fs-vs)", fontWeight: 500 }}>
              Become a Volunteer →
            </Link>
            <Link href="/contact" style={{ color: "var(--psz-green)", fontSize: "var(--fs-vs)", fontWeight: 500 }}>
              Partner With Us →
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section section-final-cta">
          
          <div className="reveal-text">
            <h5>Be Part of the Change</h5>
            <p>
              Whether you <span>volunteer, donate, or partner</span> with us —
              every action counts. Together, we build a Pakistan where every
              community thrives with dignity, education, and opportunity.
            </p>
          </div>
          <Link href="/get-involved">
            <button className="final-btn" type="button">↗ Support PakSarZameen</button>
          </Link>
        </section>
      </div>
    </div>
  );
}
