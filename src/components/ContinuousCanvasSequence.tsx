'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useEffect, useRef, useState } from 'react';
import { animate, useTransform, useMotionValueEvent, useMotionValue, motion, AnimatePresence, type MotionValue } from 'framer-motion';

interface ContinuousCanvasSequenceProps {
  sequences: string[];
  framesPerSequence: number | number[]; // per-sequence or single value for all
  children?: React.ReactNode;
}

export default function ContinuousCanvasSequence({ sequences, framesPerSequence, children }: ContinuousCanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Per-sequence actual frame counts — used only for loading to avoid 404s
  const seqFrameCounts = Array.isArray(framesPerSequence)
    ? framesPerSequence
    : sequences.map(() => framesPerSequence as number);

  // Uniform layout frame count — used for array indexing, animation targeting, and text timings.
  // Must be even so the FRAME_STEP=2 snap stays aligned across sequence boundaries.
  const layoutFPS = Math.max(...seqFrameCounts);

  const totalFrames = sequences.length * layoutFPS;

  // HTMLImageElement keeps compressed WebP bytes (~120KB each) — browser manages memory automatically.
  // ImageBitmap was removed: 780 frames × 720×1280 × 4 bytes = ~2.9 GB decoded RAM, causing OOM black frames.
  const allImagesRef = useRef<(HTMLImageElement | undefined)[]>(new Array(totalFrames));

  const [loadedPercent, setLoadedPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Files on disk are every 2nd original frame (001, 003, 005…) — FILE_STEP maps slot→filename.
  // Frames are stored CONSECUTIVELY (slot 0,1,2…) so each slot = exactly 1 animation tick.
  const FILE_STEP = 2;

  // Progressive loading: show after first sequence, load rest in background
  useEffect(() => {
    const PARALLEL_AFTER_FIRST = 2;

    const loadSequence = (seqIdx: number, onComplete: () => void) => {
      if (seqIdx >= sequences.length) { onComplete(); return; }
      const slotCount = seqFrameCounts[seqIdx];
      let count = 0;

      for (let slot = 0; slot < slotCount; slot++) {
        const fileNum = 1 + slot * FILE_STEP; // slot 0→001, slot 1→003, slot 2→005…
        const img = new Image();
        img.fetchPriority = seqIdx === 0 ? 'high' : 'low';
        img.src = `/sequences_v2/${sequences[seqIdx]}/ezgif-frame-${fileNum.toString().padStart(3, '0')}.webp`;
        const globalIdx = seqIdx * layoutFPS + slot; // consecutive — no gaps
        img.onload = () => {
          allImagesRef.current[globalIdx] = img;
          count++;
          if (seqIdx === 0) setLoadedPercent(Math.round((count / slotCount) * 100));
          if (count === slotCount) onComplete();
        };
        img.onerror = () => {
          count++;
          if (count === slotCount) onComplete();
        };
      }
    };

    // Load seq1 first — size canvas then reveal immediately
    loadSequence(0, () => {
      // Size the canvas before the first draw so no blank areas appear
      if (canvasRef.current) {
        canvasRef.current.width = window.visualViewport?.width ?? window.innerWidth;
        canvasRef.current.height = window.visualViewport?.height ?? window.innerHeight;
      }
      setLoaded(true);
      // Then load remaining sequences with limited parallelism (no server overload)
      let inFlight = 0;
      let nextIdx = 1;
      const loadNext = () => {
        while (inFlight < PARALLEL_AFTER_FIRST && nextIdx < sequences.length) {
          const idx = nextIdx++;
          inFlight++;
          loadSequence(idx, () => { inFlight--; loadNext(); });
        }
      };
      loadNext();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequences.join(','), seqFrameCounts.join(',')]);

  const [currentSeq, setCurrentSeq] = useState(0);
  const [isStatic, setIsStatic] = useState(true);
  const isStaticRef = useRef(true);
  const frameIndex = useMotionValue(0);
  const [wipeCount, setWipeCount] = useState(0);
  const [wipeDone, setWipeDone] = useState(false);
  const [scrollDir, setScrollDir] = useState<1 | -1>(1);
  const prevSeqRef = useRef(0);

  // Velocity-inertia refs — no React state, lives entirely outside render cycle
  const velocityRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const SENSITIVITY = 0.12;   // wheel delta → frame velocity scale
  const FRICTION    = 0.88;   // velocity × FRICTION per RAF tick (~0.5 s coast)
  const STOP_THRESHOLD = 0.05;

  // Keep isStaticRef in sync
  useEffect(() => { isStaticRef.current = isStatic; }, [isStatic]);

  // ── RAF physics loop ─────────────────────────────────────────────────────
  // Drives frameIndex with inertia. Derives currentSeq without re-running.
  useEffect(() => {
    const tick = () => {
      const v = velocityRef.current;
      if (Math.abs(v) > STOP_THRESHOLD) {
        velocityRef.current *= FRICTION;
        const next = Math.max(0, Math.min(totalFrames, frameIndex.get() + v));
        frameIndex.set(next);

        // Derive section from frame position
        const newSeq = Math.min(Math.floor(next / layoutFPS), sequences.length);
        if (newSeq !== prevSeqRef.current) {
          if (prevSeqRef.current === 4 && newSeq === 5) {
            setWipeDone(false);
            setWipeCount(c => c + 1);
          }
          setScrollDir(v > 0 ? 1 : -1);
          prevSeqRef.current = newSeq;
          setCurrentSeq(newSeq);
        }

        if (isStaticRef.current) {
          isStaticRef.current = false;
          setIsStatic(false);
        }
      } else if (!isStaticRef.current) {
        velocityRef.current = 0;
        isStaticRef.current = true;
        setIsStatic(true);
        setScrollDir(1);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex, totalFrames, layoutFPS, sequences.length]);

  // ── Scroll / touch → velocity ─────────────────────────────────────────────
  useEffect(() => {
    let lastTouchY = 0;

    const addVelocity = (raw: number) => {
      // Clamp huge trackpad bursts so one swipe doesn't skip 3 sections
      const delta = Math.sign(raw) * Math.min(Math.abs(raw), 80);
      velocityRef.current += delta * SENSITIVITY;
      velocityRef.current = Math.max(-12, Math.min(12, velocityRef.current));
    };

    const handleWheel = (e: WheelEvent) => {
      const pos = frameIndex.get();
      if (pos <= 0 && e.deltaY < 0) return;
      if (pos >= totalFrames && e.deltaY > 0) return;
      e.preventDefault();
      addVelocity(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => { lastTouchY = e.touches[0].clientY; };

    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = lastTouchY - y;
      lastTouchY = y;
      const pos = frameIndex.get();
      if (pos <= 0 && delta < 0) return;
      if (pos >= totalFrames && delta > 0) return;
      e.preventDefault();
      addVelocity(delta * 1.2); // touch needs more sensitivity than wheel
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [frameIndex, totalFrames]);

  const normalizedProgress = useTransform(
    frameIndex,
    [0, totalFrames - 1],
    [0, 1],
    { clamp: true }
  );

  // ── Draw helper — high-quality, DPR-aware cover scale ────────────────────
  const drawFrame = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const ratio = Math.max(canvas.width / iw, canvas.height / ih);
    const x = (canvas.width - iw * ratio) / 2;
    const y = (canvas.height - ih * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, iw, ih, x, y, iw * ratio, ih * ratio);
  };

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!loaded || !canvasRef.current) return;
    const currentFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(latest)));
    const img = allImagesRef.current[currentFrame];
    if (img) drawFrame(canvasRef.current, img);
  });

  // ── Canvas sizing with Device Pixel Ratio for crisp rendering ─────────────
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    const handleResize = () => {
      const vp = window.visualViewport;
      const cssW = vp?.width  ?? window.innerWidth;
      const cssH = vp?.height ?? window.innerHeight;
      const dpr  = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× for perf
      const bufW = Math.round(cssW * dpr);
      const bufH = Math.round(cssH * dpr);
      if (!canvasRef.current) return;
      if (canvasRef.current.width !== bufW || canvasRef.current.height !== bufH) {
        canvasRef.current.width  = bufW;
        canvasRef.current.height = bufH;
        canvasRef.current.style.width  = `${cssW}px`;
        canvasRef.current.style.height = `${cssH}px`;
        const frame = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex.get())));
        const img = allImagesRef.current[frame];
        if (img) drawFrame(canvasRef.current, img);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [loaded, frameIndex, totalFrames]);

  // Darken background behind text at the start, and fade to black completely at the end
  const bgOpacity = useTransform(normalizedProgress, [0, 0.05, 0.95, 1], [0.6, 0, 0, 1]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden z-0">
      <motion.div
        animate={{ y: currentSeq === sequences.length ? "calc(-100% + 100dvh)" : "0px" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-full flex flex-col"
      >
        <div className="relative w-full h-full overflow-hidden bg-black z-0 shrink-0">
          <canvas ref={canvasRef} className="h-full w-full object-cover" />
          
          {/* Static State Overlay: Vignette */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isStatic ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {/* Vignette */}
            <div className="absolute inset-0 bg-black/10 shadow-[inset_0_0_120px_rgba(0,0,0,0.5)] mix-blend-multiply" />
          </motion.div>
          
          <motion.div 
             className="absolute inset-0 bg-black pointer-events-none z-10"
             style={{ opacity: bgOpacity }}
          />
          
          <GlowParticles visible={isStatic && loaded} />

          <OverlayText frameIndex={frameIndex} framesPerSequence={layoutFPS} wipeDone={wipeDone} scrollDir={scrollDir} />

          <DiagonalWipe wipeCount={wipeCount} onReveal={() => setWipeDone(true)} currentSeq={currentSeq} wipeDone={wipeDone} />

          {!loaded && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 text-white">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-outfit font-light tracking-widest uppercase mb-4">Loading Sequences</p>
                <div className="w-48 h-[2px] bg-gray-800 overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-out" 
                    style={{ width: `${loadedPercent}%` }}
                  />
                </div>
             </div>
          )}
        </div>
        
        {/* Footer rendering slot */}
        <div className="w-full shrink-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function DiagonalWipe({ wipeCount, onReveal, currentSeq, wipeDone }: { wipeCount: number; onReveal: () => void; currentSeq: number; wipeDone: boolean }) {
  const radius = useMotionValue(999);

  const background = useTransform(radius, (r) =>
    `radial-gradient(circle at 50% 50%, transparent 0vmax, transparent ${r}vmax, white ${r}vmax)`
  );

  // Appear as iris spotlight when section 4 loads
  useEffect(() => {
    if (currentSeq === 4 && wipeCount === 0) {
      radius.set(999);
      const ctrl = animate(radius, 75, { delay: 2.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] });
      return () => ctrl.stop();
    }
  }, [currentSeq, wipeCount, radius]);

  // Shrink iris on scroll, then call onReveal when fully closed
  useEffect(() => {
    if (wipeCount > 0) {
      const ctrl = animate(radius, 0, {
        duration: 2.0,
        ease: [0.76, 0, 0.24, 1],
        onComplete: onReveal,
      });
      return () => ctrl.stop();
    }
  }, [wipeCount, onReveal, radius]);

  const visible = currentSeq >= 4 && !wipeDone;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="iris-overlay"
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        />
      )}
    </AnimatePresence>
  );
}

// --- Glow Particles ---
const PARTICLE_COUNT = 18;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: `${8 + Math.random() * 84}%`,
  y: `${8 + Math.random() * 84}%`,
  size: 1.5 + Math.random() * 2.5,
  duration: 2.8 + Math.random() * 3.2,
  delay: Math.random() * 4,
}));

function GlowParticles({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="particles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none z-15"
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                filter: `blur(${p.size * 0.6}px)`,
                boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(255,255,255,0.35)`,
              }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.2, 0.6] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type SectionItem = { title: string; desc: string; position: 'left' | 'right' | 'bottom'; link?: { href: string; label: string } };

const sectionData: { title: string; desc: string; subheading?: string; items?: SectionItem[]; link?: { href: string; label: string } }[] = [
  { title: "Building Community Wealth", desc: "Founded in Bahawalpur, PSZ works hand-in-hand with local leaders, volunteers, and institutions to design programs that are practical, culturally rooted, and built to last.", link: { href: "/about", label: "Our Story" } },
  { title: "Collective Action", desc: "We connect volunteers, partners, and communities through practical programs in education, health, blood support, environmental action, and welfare.", link: { href: "/get-involved", label: "Volunteer with Us" } },
  {
    title: "",
    desc: "",
    items: [
      { title: "Mission", desc: "Build practical pathways to dignity for underserved communities.", position: 'left', link: { href: "/about", label: "About Us" } },
      { title: "Vision", desc: "A just Pakistan where opportunity and care are shared.", position: 'right' },
      { title: "Method", desc: "Volunteer-driven programs shaped by real local needs.", position: 'bottom', link: { href: "/programs", label: "Our Programs" } }
    ]
  },
  { title: "What We Do", desc: "Six departments working across education, health, environment, women empowerment, social care, and animal welfare.", link: { href: "/programs", label: "Browse Programs" } },
  { title: "Mahkma Shajarkari", desc: "Leading tree plantation, urban greening, and climate-awareness efforts that help communities care for their environment.", link: { href: "/impact/environmental/gwr", label: "Guinness World Record" } },
  { title: "Ehsas ul Haiwanat", desc: "Supporting animal welfare through feeding, protection, humane treatment, and neighborhood-level awareness.", link: { href: "/dog-adoption", label: "Adopt a Dog" } },
  { title: "Room Zia", desc: "Creating support pathways for orphaned, transgender, and specially abled individuals through care, dignity, and opportunity.", link: { href: "/programs", label: "Community Care" } },
  { title: "Dar ul Aloom", desc: "Expanding access to education, mentoring, and learning opportunities through practical community-based programs.", link: { href: "/impact/education", label: "Education Programs" } },
  { title: "Tibi Imdad", desc: "Improving community health through medical support, preventive awareness, outreach camps, and welfare services.", link: { href: "/healthcare", label: "Healthcare Hub" } },
  { title: "Wajood-e-Zan", desc: "Promoting women's dignity, education, leadership, and economic participation so they can shape stronger communities.", link: { href: "/news", label: "Read Our Stories" } },
  { title: "HealthCare Platform", desc: "Your personalized medical companion.", link: { href: "/healthcare", label: "Open Platform" } },
  { title: "Eternal Legacy", desc: "Leaving an indelible mark on history, our journey continues forever.", link: { href: "/impact", label: "View Our Impact" } },
];

function OverlaySection({ frameIndex, index, framesPerSequence, title, desc, subheading, items, link }: { frameIndex: MotionValue<number>, index: number, framesPerSequence: number, title: string, desc: string, subheading?: string, items?: SectionItem[], link?: { href: string; label: string } }) {
  const startFrame = index * framesPerSequence;
  const restFrame = (index + 1) * framesPerSequence;

  const titleOpacity = useTransform(frameIndex, [startFrame + 32, startFrame + 52, restFrame + 5, restFrame + 25], [0, 1, 1, 0]);
  const titleY = useTransform(frameIndex, [startFrame + 32, startFrame + 52, restFrame + 5, restFrame + 25], [20, 0, 0, -20]);

  const descOpacity = useTransform(frameIndex, [startFrame + 42, startFrame + 62, restFrame, restFrame + 20], [0, 1, 1, 0]);
  const descY = useTransform(frameIndex, [startFrame + 42, startFrame + 62, restFrame, restFrame + 20], [20, 0, 0, -20]);

  const linkOpacity = useTransform(frameIndex, [startFrame + 55, startFrame + 72, restFrame - 5, restFrame + 15], [0, 1, 1, 0]);
  const linkY = useTransform(frameIndex, [startFrame + 55, startFrame + 72, restFrame - 5, restFrame + 15], [12, 0, 0, -12]);

  const isLeft = index % 2 === 0;

  if (items && items.length > 0) {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none">
        {items.map((item, i) => (
          <OverlaySectionItem
            key={i}
            item={item}
            i={i}
            frameIndex={frameIndex}
            startFrame={startFrame}
            restFrame={restFrame}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute ${isLeft ? 'top-[18%] md:top-1/4 left-5 md:left-16' : 'top-[18%] md:top-1/4 right-5 md:right-16 text-right'} z-20 text-white pointer-events-none max-w-[82vw] md:max-w-md`}>
      <div className="relative">
        <motion.h2 style={{ opacity: titleOpacity, y: titleY }} className="text-[8vw] sm:text-4xl md:text-5xl font-outfit font-bold tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {title}
        </motion.h2>

        {subheading && (
          <motion.p style={{ opacity: titleOpacity, y: titleY }} className="text-xs md:text-sm font-outfit font-semibold uppercase tracking-[0.18em] text-white/80 mt-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {subheading}
          </motion.p>
        )}

        <motion.p style={{ opacity: descOpacity, y: descY }} className="text-[3.8vw] sm:text-sm md:text-base font-inter font-light text-gray-200 mt-3 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {desc}
        </motion.p>

        {link && (
          <motion.div style={{ opacity: linkOpacity, y: linkY }} className={`mt-4 ${isLeft ? '' : 'flex justify-end'}`}>
            <Link
              href={link.href}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-outfit font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {link.label}
              <span className="opacity-60">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OverlaySectionItem({ item, i, frameIndex, startFrame, restFrame }: { item: SectionItem, i: number, frameIndex: MotionValue<number>, startFrame: number, restFrame: number }) {
  let positionClasses = "";
  let alignClasses = "";
  
  if (item.position === 'left') {
    positionClasses = "top-[14%] md:top-[18%] left-5 md:left-20 max-w-[72vw] md:max-w-sm";
    alignClasses = "text-left";
  } else if (item.position === 'right') {
    positionClasses = "top-[46%] md:top-1/2 right-5 md:right-20 -translate-y-1/2 max-w-[72vw] md:max-w-sm";
    alignClasses = "text-right";
  } else if (item.position === 'bottom') {
    positionClasses = "bottom-[14%] md:bottom-20 left-1/2 -translate-x-1/2 w-[86vw] md:max-w-xl";
    alignClasses = "text-center";
  }

  const itemStartOffset = startFrame + 32 + (i * 5);
  const itemOpacity = useTransform(frameIndex, [itemStartOffset, itemStartOffset + 20, restFrame + 5, restFrame + 25], [0, 1, 1, 0]);
  const itemY = useTransform(frameIndex, [itemStartOffset, itemStartOffset + 20, restFrame + 5, restFrame + 25], [20, 0, 0, -20]);

  return (
    <motion.div style={{ opacity: itemOpacity, y: itemY }} className={`absolute ${positionClasses} ${alignClasses} text-white pointer-events-none`}>
      <h2 className="text-[7.5vw] sm:text-3xl md:text-4xl font-outfit font-bold tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{item.title}</h2>
      <p className="text-[3.8vw] sm:text-sm md:text-base font-inter font-light text-gray-200 mt-2 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{item.desc}</p>
      {item.link && (
        <div className={`mt-3 ${item.position === 'right' ? 'flex justify-end' : item.position === 'bottom' ? 'flex justify-center' : ''}`}>
          <Link
            href={item.link.href}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-outfit font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {item.link.label}
            <span className="opacity-60">→</span>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function OverlayText({ frameIndex, framesPerSequence, wipeDone, scrollDir }: { frameIndex: MotionValue<number>, framesPerSequence: number, wipeDone: boolean, scrollDir: 1 | -1 }) {
  // Hero fades out on first scroll (first 30 frames of layoutFPS=120)
  const heroOpacity = useTransform(frameIndex, [0, 30], [1, 0]);
  const heroY = useTransform(frameIndex, [0, 30], [0, -30]);

  return (
    <>
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white pointer-events-none drop-shadow-2xl">
        {/* Placeholder video overlay of birds flying (mix-blend-screen makes black background transparent) */}
        <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-50 z-0">
          <video 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover scale-110"
            src="https://cdn.pixabay.com/video/2016/09/21/5361-183786016_tiny.mp4"
          />
        </div>

        {/* Dynamic Glow background for text is removed to match request */}

        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <motion.h1
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
            className="text-[11vw] sm:text-6xl md:text-[6vw] lg:text-9xl font-outfit font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-green-300 to-white text-center w-full drop-shadow-[0_0_20px_rgba(74,222,128,0.15)]"
          >
            PAKSARZAMEEN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 md:mt-5 max-w-3xl text-center font-light tracking-wide text-white/85"
          >
            <span className="block text-lg sm:text-xl md:text-2xl" dir="rtl">تربیت سے تعلیم</span>
            <span className="block mt-1.5 text-sm sm:text-base md:text-lg text-white/70">Nurturing Character Through Education</span>
          </motion.p>

          {/* Hero quick-access links */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2.5 md:gap-3"
          >
            {[
              { href: "/dog-adoption", label: "Dog Adoption" },
              { href: "/healthcare", label: "Healthcare" },
              { href: siteConfig.commonwealthUrl, label: "Artisan Store", external: true },
              { href: "/impact", label: "Our Impact" },
            ].map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                target={chip.external ? "_blank" : undefined}
                rel={chip.external ? "noopener noreferrer" : undefined}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[11px] font-outfit font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white"
              >
                {chip.label}
                <span className="opacity-50 text-xs">→</span>
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-7 md:bottom-14 z-10 flex flex-col items-center"
        >
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-gray-300 mb-3 md:mb-5 uppercase text-center font-light">Scroll to Discover</span>
          <div className="w-[1px] h-10 md:h-16 bg-gradient-to-b from-green-400 to-transparent"></div>
        </motion.div>
      </motion.div>

      {sectionData.map((data, index) => {
        const section = (
          <OverlaySection
            key={index}
            frameIndex={frameIndex}
            index={index}
            framesPerSequence={framesPerSequence}
            title={data.title}
            desc={data.desc}
            subheading={data.subheading}
            items={data.items}
            link={data.link}
          />
        );
        const wrapped = (
          <motion.div
            key={`dir-${index}`}
            animate={{ opacity: scrollDir === -1 ? 0 : 1 }}
            transition={{ duration: scrollDir === -1 ? 0.15 : 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {section}
          </motion.div>
        );

        if (index === 4) {
          return (
            <motion.div
              key={index}
              animate={{ opacity: wipeDone ? 1 : 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            >
              {wrapped}
            </motion.div>
          );
        }
        return wrapped;
      })}
    </>
  );
}
