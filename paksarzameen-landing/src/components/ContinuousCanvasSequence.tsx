'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useTransform, useMotionValueEvent, useMotionValue, motion, AnimatePresence } from 'framer-motion';

interface ContinuousCanvasSequenceProps {
  sequences: string[];
  framesPerSequence: number;
  children?: React.ReactNode;
}

export default function ContinuousCanvasSequence({ sequences, framesPerSequence, children }: ContinuousCanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const totalFrames = sequences.length * framesPerSequence;

  // Preload all images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);
    let loadedCount = 0;

    sequences.forEach((seqName, seqIdx) => {
      for (let i = 1; i <= framesPerSequence; i++) {
        const img = new Image();
        const indexStr = i.toString().padStart(3, '0');
        img.src = `/sequences/${seqName}/ezgif-frame-${indexStr}.webp`;
        
        const globalIdx = (seqIdx * framesPerSequence) + (i - 1);
        
        img.onload = () => {
          loadedImages[globalIdx] = img;
          loadedCount++;
          setLoadedPercent(Math.round((loadedCount / totalFrames) * 100));
          if (loadedCount === totalFrames) {
            setImages(loadedImages);
            setLoaded(true);
          }
        };
      }
    });
  }, [sequences, framesPerSequence, totalFrames]);

  const [currentSeq, setCurrentSeq] = useState(0);
  const [isStatic, setIsStatic] = useState(true);
  const isStaticRef = useRef(true);
  const isAnimatingRef = useRef(false); // Synchronous lock to prevent trackpad bursts
  const frameIndex = useMotionValue(0);
  const [wipeCount, setWipeCount] = useState(0);
  const [wipeDone, setWipeDone] = useState(false);
  const [scrollDir, setScrollDir] = useState<1 | -1>(1);
  const prevSeqRef = useRef(0);

  // Sync ref with state
  useEffect(() => {
    isStaticRef.current = isStatic;
    if (isStatic) setScrollDir(1);
  }, [isStatic]);

  // Trigger diagonal wipe when leaving "What We Do" (seq 4 → 5)
  useEffect(() => {
    if (prevSeqRef.current === 4 && currentSeq === 5) {
      setWipeDone(false);
      setWipeCount(c => c + 1);
    }
    prevSeqRef.current = currentSeq;
  }, [currentSeq]);

  // Smooth playback of sequence
  useEffect(() => {
    // If we are at the footer (currentSeq === sequences.length), don't animate the canvas further
    const activeFrameSeq = Math.min(currentSeq, sequences.length - 1);
    const targetFrame = activeFrameSeq * framesPerSequence;
    
    const distance = Math.abs(targetFrame - frameIndex.get());
    if (distance === 0) {
      setIsStatic(true);
      isAnimatingRef.current = false;
      return;
    }

    setIsStatic(false);
    isAnimatingRef.current = true;

    // Constant 48fps drive — easeInOutQuart handles the feel
    const duration = distance / 48;
    const controls = animate(frameIndex, targetFrame, {
      type: "tween",
      ease: [0.45, 0, 0.55, 1], // easeInOutQuad
      duration,
      onUpdate: (latest) => {
        // Trigger the vignette and particle fade-in slightly before the animation stops (e.g. last 80 frames)
        const remaining = Math.abs(targetFrame - latest);
        if (remaining < 80 && isStaticRef.current === false) {
          setIsStatic(true);
        }
      },
      onComplete: () => {
        setIsStatic(true);
        isAnimatingRef.current = false;
      }
    });

    return () => controls.stop();
  }, [currentSeq, framesPerSequence, frameIndex, sequences.length]);

  // Scroll Jacking Logic
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // Allow reaching sequences.length (which represents the footer)
      const isAtCanvasEnd = currentSeq >= sequences.length;

      // Scrolling Down
      if (e.deltaY > 10) {
        if (!isAtCanvasEnd) {
          e.preventDefault();
          setScrollDir(1);
          if (isStaticRef.current && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setCurrentSeq(prev => prev + 1);
          }
        }
      }
      // Scrolling Up
      else if (e.deltaY < -10) {
        if (currentSeq > 0) {
          e.preventDefault();
          setScrollDir(-1);
          if (isStaticRef.current && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setCurrentSeq(prev => prev - 1);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      const isAtCanvasEnd = currentSeq >= sequences.length;

      if (deltaY > 20) {
        if (!isAtCanvasEnd) {
          e.preventDefault();
          setScrollDir(1);
          if (isStaticRef.current && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setCurrentSeq(prev => prev + 1);
          }
        }
      } else if (deltaY < -20) {
        if (currentSeq > 0) {
          e.preventDefault();
          setScrollDir(-1);
          if (isStaticRef.current && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setCurrentSeq(prev => prev - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentSeq, sequences.length]);

  const normalizedProgress = useTransform(
    frameIndex,
    [0, totalFrames - 1],
    [0, 1],
    { clamp: true }
  );

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(latest)));
    const img = images[currentFrame];
    
    if (img) {
      const canvas = canvasRef.current;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }
  });

  // Initial draw & resize
  useEffect(() => {
    if (loaded && canvasRef.current && images.length > 0) {
       const handleResize = () => {
         if (canvasRef.current && canvasRef.current.parentElement) {
            const parent = canvasRef.current.parentElement;
            
            // Only resize if dimensions actually changed (prevents mobile address bar scroll-jitter)
            if (canvasRef.current.width !== parent.clientWidth || canvasRef.current.height !== parent.clientHeight) {
              canvasRef.current.width = parent.clientWidth;
              canvasRef.current.height = parent.clientHeight;
              
              const currentFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex.get())));
              const img = images[currentFrame];
              if (img) {
                const ctx = canvasRef.current.getContext('2d');
                const hRatio = canvasRef.current.width / img.width;
                const vRatio = canvasRef.current.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvasRef.current.width - img.width * ratio) / 2;
                const centerShift_y = (canvasRef.current.height - img.height * ratio) / 2;
                ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx?.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
              }
            }
         }
       };
       handleResize();
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaded, images, frameIndex, totalFrames]);

  // Darken background behind text at the start, and fade to black completely at the end
  const bgOpacity = useTransform(normalizedProgress, [0, 0.05, 0.95, 1], [0.6, 0, 0, 1]);

  return (
    <div ref={containerRef} className="relative w-full bg-black h-[100svh] overflow-hidden">
      <motion.div 
        animate={{ y: currentSeq === sequences.length ? "calc(-100% + 100svh)" : "0px" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="w-full flex flex-col"
      >
        <div className="relative w-full h-[100svh] overflow-hidden bg-black z-0 shrink-0">
          <canvas ref={canvasRef} className="h-full w-full object-cover" />
          
          {/* Static State Overlay: Vignette */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isStatic ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {/* Vignette and Darkness */}
            <div className="absolute inset-0 bg-black/20 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] mix-blend-multiply" />
          </motion.div>
          
          <motion.div 
             className="absolute inset-0 bg-black pointer-events-none z-10"
             style={{ opacity: bgOpacity }}
          />
          
          <OverlayText frameIndex={frameIndex} framesPerSequence={framesPerSequence} wipeDone={wipeDone} scrollDir={scrollDir} />

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
      const ctrl = animate(radius, 75, { delay: 4.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] });
      return () => ctrl.stop();
    }
  }, [currentSeq, wipeCount, radius]);

  // Shrink iris on scroll, then call onReveal when fully closed
  useEffect(() => {
    if (wipeCount > 0) {
      const ctrl = animate(radius, 0, {
        duration: 5.0,
        ease: [0.45, 0, 0.55, 1],
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

type SectionItem = { title: string; desc: string; position: 'left' | 'right' | 'bottom' };

const sectionData: { title: string; desc: string; subheading?: string; items?: SectionItem[] }[] = [
  { title: "Building Community Wealth", desc: "Founded in Bahawalpur, PSZ works hand-in-hand with local leaders, volunteers, and institutions to design programs that are practical, culturally rooted, and built to last." },
  { title: "Collective Action", desc: "We connect volunteers, partners, and communities through practical programs in education, health, blood support, environmental action, and welfare." },
  { 
    title: "", 
    desc: "", 
    items: [
      { title: "Mission", desc: "Build practical pathways to dignity for underserved communities.", position: 'left' },
      { title: "Vision", desc: "A just Pakistan where opportunity and care are shared.", position: 'right' },
      { title: "Method", desc: "Volunteer-driven programs shaped by real local needs.", position: 'bottom' }
    ]
  },
  { title: "What We Do", desc: "Six departments working across education, health, environment, women empowerment, social care, and animal welfare." },
  { title: "Mahkma Shajarkari", desc: "Leading tree plantation, urban greening, and climate-awareness efforts that help communities care for their environment." },
  { title: "Ehsas ul Haiwanat", desc: "Supporting animal welfare through feeding, protection, humane treatment, and neighborhood-level awareness." },
  { title: "Room Zia", desc: "Creating support pathways for orphaned, transgender, and specially abled individuals through care, dignity, and opportunity." },
  { title: "Dar ul Aloom", desc: "Expanding access to education, mentoring, and learning opportunities through practical community-based programs." },
  { title: "Tibi Imdad", desc: "Improving community health through medical support, preventive awareness, outreach camps, and welfare services." },
  { title: "Wajood-e-Zan", desc: "Promoting women's dignity, education, leadership, and economic participation so they can shape stronger communities." },
  { title: "HealthCare Platform", desc: "Your personalized medical companion." },
  { title: "Eternal Legacy", desc: "Leaving an indelible mark on history, our journey continues forever." },
];

function OverlaySection({ frameIndex, index, framesPerSequence, title, desc, subheading, items }: { frameIndex: any, index: number, framesPerSequence: number, title: string, desc: string, subheading?: string, items?: SectionItem[] }) {
  const startFrame = index * framesPerSequence;
  const restFrame = (index + 1) * framesPerSequence;

  const titleOpacity = useTransform(frameIndex, [startFrame + 65, startFrame + 105, restFrame + 10, restFrame + 50], [0, 1, 1, 0]);
  const titleY = useTransform(frameIndex, [startFrame + 65, startFrame + 105, restFrame + 10, restFrame + 50], [20, 0, 0, -20]);

  const descOpacity = useTransform(frameIndex, [startFrame + 85, startFrame + 125, restFrame, restFrame + 40], [0, 1, 1, 0]);
  const descY = useTransform(frameIndex, [startFrame + 85, startFrame + 125, restFrame, restFrame + 40], [20, 0, 0, -20]);

  const isLeft = index % 2 === 0;

  if (items && items.length > 0) {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none">
        {items.map((item, i) => {
          let positionClasses = "";
          let alignClasses = "";
          
          if (item.position === 'left') {
            positionClasses = "top-[18%] md:top-[20%] left-6 md:left-20 max-w-[75vw] md:max-w-sm";
            alignClasses = "text-left";
          } else if (item.position === 'right') {
            positionClasses = "top-[48%] md:top-1/2 right-6 md:right-20 -translate-y-1/2 max-w-[75vw] md:max-w-sm";
            alignClasses = "text-right";
          } else if (item.position === 'bottom') {
            positionClasses = "bottom-[12%] md:bottom-20 left-1/2 -translate-x-1/2 w-[85vw] md:max-w-xl";
            alignClasses = "text-center";
          }

          // Stagger each item slightly
          const itemStartOffset = startFrame + 65 + (i * 10);
          const itemOpacity = useTransform(frameIndex, [itemStartOffset, itemStartOffset + 40, restFrame + 10, restFrame + 50], [0, 1, 1, 0]);
          const itemY = useTransform(frameIndex, [itemStartOffset, itemStartOffset + 40, restFrame + 10, restFrame + 50], [20, 0, 0, -20]);

          return (
            <motion.div key={i} style={{ opacity: itemOpacity, y: itemY }} className={`absolute ${positionClasses} ${alignClasses} text-white drop-shadow-2xl`}>
              <h2 className="text-2xl md:text-4xl font-outfit font-bold tracking-tight text-white">{item.title}</h2>
              <p className="text-sm md:text-base font-inter font-light text-gray-300 mt-2">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`absolute ${isLeft ? 'top-1/3 md:top-1/4 left-6 md:left-16' : 'top-1/3 md:top-1/4 right-6 md:right-16 text-right'} z-20 text-white pointer-events-none drop-shadow-2xl max-w-[85vw] md:max-w-md`}>
      <div className="relative">
        <motion.h2 style={{ opacity: titleOpacity, y: titleY }} className="text-3xl md:text-5xl font-outfit font-bold tracking-tight">
          {title}
        </motion.h2>

        {subheading && (
          <motion.p style={{ opacity: titleOpacity, y: titleY }} className="text-[11px] md:text-xs font-outfit font-semibold uppercase tracking-[0.18em] text-white/80 mt-2">
            {subheading}
          </motion.p>
        )}
        
        <motion.p style={{ opacity: descOpacity, y: descY }} className="text-sm md:text-base font-inter font-light text-gray-300 mt-2">
          {desc}
        </motion.p>
      </div>
    </div>
  );
}

function OverlayText({ frameIndex, framesPerSequence, wipeDone, scrollDir }: { frameIndex: any, framesPerSequence: number, wipeDone: boolean, scrollDir: 1 | -1 }) {
  // Hero fades out very quickly on scroll (first 60 frames)
  const heroOpacity = useTransform(frameIndex, [0, 60], [1, 0]);
  const heroY = useTransform(frameIndex, [0, 60], [0, -30]);

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

        <div className="relative z-10 flex flex-col items-center w-full">
          <motion.h1 
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
            className="text-[8vw] sm:text-6xl md:text-[6vw] lg:text-9xl font-outfit font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-green-300 to-white text-center w-full px-4 drop-shadow-[0_0_20px_rgba(74,222,128,0.15)]"
          >
            PAKSARZAMEEN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-3xl px-4 text-center text-sm sm:text-base md:text-lg font-light tracking-wide text-white/80"
          >
            <span className="block" dir="rtl">تربیت سے تعلیم</span>
            <span className="block mt-2 text-white/70">Nurturing Character Through Education</span>
          </motion.p>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 md:bottom-16 z-10 flex flex-col items-center"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.4em] text-gray-400 mb-4 md:mb-6 uppercase text-center font-light">Scroll to Discover</span>
          <div className="w-[1px] h-10 md:h-20 bg-gradient-to-b from-green-500 to-transparent"></div>
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
          />
        );
        const wrapped = (
          <motion.div
            key={`dir-${index}`}
            animate={{ opacity: scrollDir === -1 ? 0 : 1 }}
            transition={{ duration: scrollDir === -1 ? 0.15 : 0.5, ease: [0.45, 0, 0.55, 1] }}
          >
            {section}
          </motion.div>
        );

        if (index === 4) {
          return (
            <motion.div
              key={index}
              animate={{ opacity: wipeDone ? 1 : 0 }}
              transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
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
