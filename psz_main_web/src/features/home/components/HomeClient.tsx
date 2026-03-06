"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Different Pexels Free Videos — NGO / Humanity / Community ─── */
const VIDEOS = {
  // Hero: new Pexels hero video (download link provided)
  hero: "https://www.pexels.com/download/video/6192775/" ,
  // Mission: children studying in classroom
  mission:
    "https://www.pexels.com/download/video/9036212/",
  // Education: teacher with students
  education:
    "https://www.pexels.com/download/video/3209298/",
  // Empowerment: people working together / community
  empowerment:
    "https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4",
  // Enterprise: market / small business / hands working
  enterprise:
    "https://www.pexels.com/download/video/16118544/",
  // Impact: healthcare / medical help
  impact:
    "https://videos.pexels.com/video-files/4492224/4492224-uhd_2560_1440_25fps.mp4",
  // Grid video: nature / farming
  // grid video removed
  // Dark section: volunteers hands
  volunteers:
    "https://www.pexels.com/download/video/6646701/",
};

/* ─── Different images for each section ─── */
const IMAGES = {
  showcase: "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
  fullImage: "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg",
  impactHero: "https://images.pexels.com/photos/6963695/pexels-photo-6963695.jpeg",
  transform1: "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
  transform1Overlay: "/images/WhatsApp%20Image%202026-03-06%20at%205.07.22%20AM.jpeg",
  transform2: "/images/WhatsApp%20Image%202026-03-06%20at%205.08.17%20AM.jpeg",
  transform2Overlay: "/images/WhatsApp%20Image%202026-03-06%20at%205.08.52%20AM.jpeg",
  finalBase: "/images/WhatsApp%20Image%202026-03-06%20at%205.00.43%20AM.jpeg",
  finalOverlay: "/images/hero-fallback.svg",
};

/* ─── Canvas frame animation images (NGO related) ─── */
function getCanvasFrameUrl(index: number): string {
  const seeds = [
    "/images/hero-fallback.svg",
    "/images/placeholders/program-photo.svg",
    "/images/WhatsApp%20Image%202026-03-06%20at%205.01.33%20AM.jpeg",
    "/images/WhatsApp%20Image%202026-03-06%20at%205.07.22%20AM.jpeg",
    "/images/WhatsApp%20Image%202026-03-06%20at%205.08.17%20AM.jpeg",
    "/images/WhatsApp%20Image%202026-03-06%20at%205.08.52%20AM.jpeg",
    "/images/WhatsApp%20Image%202026-03-06%20at%205.00.43%20AM.jpeg",
    "/images/hero-fallback.svg",
    "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg",
    "/images/placeholders/program-photo.svg",
    "/images/hero-fallback.svg",
    "https://images.pexels.com/photos/4614166/pexels-photo-4614166.jpeg",
  ];
  return `${seeds[index % seeds.length]}?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&seed=${index}`;
}

/* ─── Scroll-reveal text blocks alongside the canvas ─── */
const SCROLL_TEXT_BLOCKS = [
  {
    title: "Room Zia",
    description:
      "Solar-powered learning spaces that bring electricity and education to remote villages. Over 120 schools illuminated.",
  },
  {
    title: "Mobile Health Clinics",
    description:
      "Bringing essential healthcare to doorsteps. 15,000+ consultations in areas with no hospital access.",
  },
  {
    title: "Skills for Tomorrow",
    description:
      "Vocational training programs equipping youth with digital literacy, tailoring, and agricultural skills.",
  },
  {
    title: "Clean Water Initiative",
    description:
      "Installing water filtration plants across Punjab and Sindh. Safe drinking water for 30,000+ people.",
  },
  {
    title: "Women Enterprise Hub",
    description:
      "Micro-financing and mentorship for women entrepreneurs. 3,000 families lifted through sustainable business.",
  },
  {
    title: "Community Kitchens",
    description:
      "Daily nutritious meals for 5,000+ individuals in urban slums and disaster-affected regions.",
  },
];

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
      { scale: 0.65, rotationZ: -140, rotationX: 18, opacity: 0, transformOrigin: "50% 50%" },
      {
        scale: 1,
        rotationZ: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1.25,
        ease: "back.out(1.4)",
      },
      0
    );

    // 1. Staggered letter reveal (slide up + rotate)
    tl.fromTo(
      ".intro-letter",
      { y: 100, opacity: 0, rotateX: 90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "back.out(1.2)",
        stagger: 0.08,
      },
      0.5
    );

    // gentle settle bob for the logo to make the reveal feel organic
    tl.to(
      ".intro-logo",
      { y: -8, duration: 0.9, ease: "power2.out", yoyo: true, repeat: 1 },
      ">=0.1"
    );

    // 2. Tagline fades in underneath
    tl.fromTo(
      ".intro-tagline",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    );

    // 3. Hold for a beat
    tl.to({}, { duration: 0.8 });

    // 4. Text scales up and fades out
    tl.to(".intro-text-wrapper", {
      scale: 1.4,
      opacity: 0,
      duration: 0.9,
      ease: "power3.in",
    });

    // 5. Overlay shrinks into a circle and reveals the hero video behind
    // Re-enable scrolling when the reveal begins so the page isn't blocked
    tl.to(
      intro,
      {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.2,
        ease: "power4.inOut",
        onStart: () => {
          try { document.body.style.overflow = ""; } catch {}
        },
      },
      "-=0.5"
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
          end: "400% top",
          pin: true,
          scrub: 1,
          onLeave: () => heroVideo.pause(),
          onEnterBack: () => heroVideo.play().catch(() => {}),
          onLeaveBack: () => heroVideo.pause(),
        });
      }

      /* ─── Pinned Video Sections ─── */
      createPinnedVideoTimeline(".section-mission");
      createPinnedVideoTimeline(".section-education");
      createPinnedVideoTimeline(".section-enterprise");

      /* ─── Canvas frame animation ─── */
      setupCanvasAnimation();

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
              scrub: 1,
            },
          }
        );
      });

      /* ─── Overlay Reveals ─── */
      gsap.to(".section-transform-1 .overlay-img", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-transform-1",
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1,
          pin: true,
        },
      });

      gsap.to(".section-transform-2 .overlay-img", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-transform-2",
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1,
          pin: true,
        },
      });

      gsap.to(".section-final-cta .overlay-img", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".section-final-cta",
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1,
          pin: true,
        },
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
      const img = new Image();
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
        end: "300% top",
        scrub: 1,
        pin: true,
      },
    });
    tl.to(`${selector} .section-text`, { opacity: 0, scale: 0.8, duration: 0.5 }, 0);
    tl.to(
      `${selector} video`,
      { filter: "blur(15px) grayscale(1) brightness(0.3)", scale: 0.8, borderRadius: "30px", duration: 0.5 },
      ">-0.3"
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
        gsap.ticker.lagSmoothing(0);
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
            {/* Logo animated in */}
            <img
              src="/paksarzameen_logo.png"
              alt="PakSarZameen Logo"
              className="intro-logo"
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
      <section className="hero-section">
        <video ref={heroVideoRef} src={VIDEOS.hero} muted loop playsInline preload="metadata" controls={false} autoPlay={false} />
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
      <section className="pinned-video-section section-mission">
        <video src={VIDEOS.mission} autoPlay muted loop playsInline preload="auto" />
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
      <section className="split-section">
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
      {/* PINNED VIDEO — Education                        */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-education">
        <video src={VIDEOS.education} autoPlay muted loop playsInline preload="auto" />
        <div className="section-text">
          <p>
            A revolutionary approach to grassroots development. Empowering
            communities through education and ethical enterprise — one village at
            a time.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* VIDEO OVERLAY — Community Empowerment           */}
      {/* ════════════════════════════════════════════════ */}
      <section className="video-overlay-section">
        <video src={VIDEOS.empowerment} autoPlay muted loop playsInline preload="auto" />
        <p>
          Navigate the path to change. From education to healthcare, PSZ creates
          opportunities where they&apos;re needed most.
        </p>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* MISSION PILLARS — Stats & CTA                   */}
      {/* ════════════════════════════════════════════════ */}
      <section className="showcase-section">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.showcase} alt="PakSarZameen community programs" loading="lazy" />
        </div>

        <Link href="/get-involved">
          <button className="cta-button" type="button">Get Involved ↗</button>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* PINNED VIDEO — Enterprise                       */}
      {/* ════════════════════════════════════════════════ */}
      <section className="pinned-video-section section-enterprise">
        <video src={VIDEOS.enterprise} autoPlay muted loop playsInline preload="auto" />
        <div className="section-text">
          <p>
            Sustainable solutions built from the ground up. Community wealth that
            grows from within, creating lasting change for generations.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* OUR APPROACH                                    */}
      {/* ════════════════════════════════════════════════ */}
      <section className="approach-section">
        <h5>Our Approach</h5>
        <h2>Grassroots innovation for lasting impact.</h2>
        <p>
          We invest in practical, high-impact local solutions shaped by community
          realities. Every initiative is designed to be sustainable, scalable,
          and deeply rooted in the needs of the people it serves.
        </p>
      </section>


      {/* ════════════════════════════════════════════════ */}
      {/* HIGHLIGHT QUOTE                                 */}
      {/* ════════════════════════════════════════════════ */}
      <section className="highlight-section">
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
      {/* TESTIMONIALS — Community Voices                 */}
      {/* ════════════════════════════════════════════════ */}
      <section className="testimonials-section">
        <h5 className="fade-in-section">Community Voices</h5>
        <div className="testimonials-grid">
          <div className="testimonial-card fade-in-section">
            <blockquote>
              &ldquo;PakSarZameen transformed our village. My children now have
              access to quality education and my husband started a sustainable
              business through their enterprise program.&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <strong>Fatima Bibi</strong>
              <span>Community Member, Multan</span>
            </div>
          </div>
          <div className="testimonial-card fade-in-section">
            <blockquote>
              &ldquo;The Room Zia initiative brought light — literally and
              figuratively — to our community. Solar panels power our school and
              clinic now.&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <strong>Ahmed Khan</strong>
              <span>Village Elder, Swat</span>
            </div>
          </div>
          <div className="testimonial-card fade-in-section">
            <blockquote>
              &ldquo;As a partner organization, we&apos;ve seen PSZ deliver
              real, measurable impact. Their approach to grassroots development
              is unmatched in Pakistan.&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <strong>Dr. Sara Malik</strong>
              <span>Director, Rural Health Initiative</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* FULL-WIDTH IMAGE CTA                            */}
      {/* ════════════════════════════════════════════════ */}
      <section className="full-image-section">
        <div className="image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.fullImage} alt="Join PakSarZameen" loading="lazy" />
        </div>
        <Link href="/get-involved">
          <button className="cta-overlay-btn" type="button">↗ Join Our Mission</button>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* PROGRAMS OVERVIEW                               */}
      {/* ════════════════════════════════════════════════ */}
      <section className="programs-overview-section">
        <h5 className="fade-in-section">What We Do</h5>
        <div className="programs-grid">
          {[
            { name: "Mahkma Shajarkari (Plantation Unit)", desc: "Promoting environmental responsibility through plantation drives and sustainability initiatives.", stat: "Environmental Action" },
            { name: "Ehsas ul Haiwanat (Animal Welfare Section)", desc: "Advocating compassion toward animals and supporting their welfare and protection.", stat: "Animal Welfare" },
            { name: "Room Zia (Bureau for empowering Marginalizing Communities)", desc: "Providing care, support, and opportunities for orphaned, transgender, and specially-abled people to build a secure and hopeful future.", stat: "Social Care" },
            { name: "Dar ul Aloom (Agency of Educational Development)", desc: "Advancing access to knowledge and learning through educational programs and community awareness.", stat: "Education" },
            { name: "Tibi Imdad (Bureau for Improving Health Standards)", desc: "Working to improve community health through medical support, awareness campaigns, and welfare services.", stat: "Healthcare" },
            { name: "Wajood-e-Zan (Women Empowerment Department)", desc: "Promoting the dignity, education, and empowerment of women so they can actively participate in shaping society.", stat: "Women Empowerment" },
          ].map((program) => (
            <div key={program.name} className="program-card fade-in-section">
              <h4>{program.name}</h4>
              <p>{program.desc}</p>
              <span className="program-stat">{program.stat}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <Link href="/programs" className="view-all-link">View All Programs →</Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* DARK BOTTOM — Impact Sections                   */}
      {/* ════════════════════════════════════════════════ */}
      <div className="dark-bottom">
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.impactHero} alt="PSZ impact" loading="lazy" />
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
          <video src={VIDEOS.volunteers} autoPlay muted loop playsInline />
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

        {/* Overlay Reveal 1 */}
        <section className="overlay-reveal-section section-transform-1">
          <div className="image-pair">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.transform1} alt="Community after" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="overlay-img" src={IMAGES.transform1Overlay} alt="Community before" loading="lazy" />
          </div>
          <div className="reveal-text">
            <h5>Education That Lasts</h5>
            <p>
              From one-room schools to full learning centers — scroll to see the
              transformation. <span>Every child deserves access</span> to
              quality education, regardless of geography.
            </p>
          </div>
        </section>

        {/* Overlay Reveal 2 */}
        <section className="overlay-reveal-section section-transform-2">
          <div className="image-pair">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.transform2} alt="Healthcare after" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="overlay-img" src={IMAGES.transform2Overlay} alt="Healthcare before" loading="lazy" />
          </div>
          <div className="reveal-text">
            <h5>Healthcare at the Doorstep</h5>
            <p>
              Mobile clinics reaching the unreachable. Scroll to reveal the
              impact of <span>accessible healthcare</span> in remote
              communities across Sindh, KPK, and Balochistan.
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
          <div className="image-pair">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.finalBase} alt="PakSarZameen impact" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="overlay-img" src={IMAGES.finalOverlay} alt="PakSarZameen community" loading="lazy" />
          </div>
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
