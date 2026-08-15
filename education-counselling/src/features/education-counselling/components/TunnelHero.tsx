"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./TunnelHero.module.css";

interface TunnelHeroProps {
  universities: any[];
  onBookConsultation?: () => void;
}

const N_RINGS = 12;
const RING_SPACING = 350;
const TOTAL_DEPTH = N_RINGS * RING_SPACING;
const MAX_Z = 200;
const MIN_Z = MAX_Z - TOTAL_DEPTH;

export function TunnelHero({ universities, onBookConsultation }: TunnelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const offsetZ = useRef(0);
  const isPaused = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  const [dims, setDims] = useState({
    width: 1000,
    height: 650,
    cardWidth: 280,
    cardHeight: 180,
    staggerX: 120,
    staggerY: 55,
  });

  const dimsRef = useRef(dims);
  useEffect(() => {
    dimsRef.current = dims;
  }, [dims]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 480) {
        setDims({
          width: 320,
          height: Math.max(420, h - 260),
          cardWidth: 130,
          cardHeight: 85,
          staggerX: 20,
          staggerY: 30,
        });
      } else if (w < 768) {
        setDims({
          width: 580,
          height: Math.max(480, h - 260),
          cardWidth: 180,
          cardHeight: 120,
          staggerX: 65,
          staggerY: 45,
        });
      } else {
        setDims({
          width: 1000,
          height: 650,
          cardWidth: 280,
          cardHeight: 180,
          staggerX: 120,
          staggerY: 55,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const longitudinalLines = useMemo(() => {
    const w = dims.width;
    const h = dims.height;
    return [
      { x: -w / 2, y: -h / 2, className: styles.cornerLine },
      { x: w / 2, y: -h / 2, className: styles.cornerLine },
      { x: -w / 2, y: h / 2, className: styles.cornerLine },
      { x: w / 2, y: h / 2, className: styles.cornerLine },
      { x: -w / 2, y: -h / 4, className: styles.gridLine },
      { x: -w / 2, y: 0, className: styles.gridLine },
      { x: -w / 2, y: h / 4, className: styles.gridLine },
      { x: w / 2, y: -h / 4, className: styles.gridLine },
      { x: w / 2, y: 0, className: styles.gridLine },
      { x: w / 2, y: h / 4, className: styles.gridLine },
      { x: -w / 4, y: -h / 2, className: styles.gridLine },
      { x: 0, y: -h / 2, className: styles.gridLine },
      { x: w / 4, y: -h / 2, className: styles.gridLine },
      { x: -w / 4, y: h / 2, className: styles.gridLine },
      { x: 0, y: h / 2, className: styles.gridLine },
      { x: w / 4, y: h / 2, className: styles.gridLine },
    ];
  }, [dims.width, dims.height]);

  const cards = useMemo(() => {
    const list = universities && universities.length > 0 ? universities : [];
    if (list.length === 0) return [];

    return Array.from({ length: N_RINGS * 2 }).map((_, index) => {
      const ringIndex = Math.floor(index / 2);
      const isSecondCard = index % 2 === 1;
      const isEvenRing = ringIndex % 2 === 0;

      let side: "left" | "right" | "top" | "bottom" = "left";
      if (isEvenRing) {
        side = isSecondCard ? "right" : "left";
      } else {
        side = isSecondCard ? "bottom" : "top";
      }

      const university = list[index % list.length];

      return {
        index,
        ringIndex,
        side,
        university,
        baseZ: -ringIndex * RING_SPACING,
      };
    });
  }, [universities]);

  useEffect(() => {
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      targetMouseX.current = x;
      targetMouseY.current = y;
    };

    const handleMouseLeave = () => {
      if (isTouch) return;
      targetMouseX.current = 0;
      targetMouseY.current = 0;
    };

    const container = containerRef.current;
    if (container && !isTouch) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    const update = () => {
      if (!isPaused.current) {
        offsetZ.current += 1.8;
      }

      mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

      const time = Date.now() * 0.0008;
      const floatX = Math.sin(time) * 12;
      const floatY = Math.cos(time * 0.8) * 8;
      const floatRotZ = Math.sin(time * 0.5) * 0.3;

      if (cameraRef.current) {
        const rx = -mouseY.current * 7 + Math.sin(time * 0.6) * 0.4;
        const ry = mouseX.current * 7 + Math.cos(time * 0.5) * 0.4;
        const rz = floatRotZ;
        const tx = -mouseX.current * 20 + floatX;
        const ty = -mouseY.current * 16 + floatY;
        cameraRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }

      ringRefs.current.forEach((ringEl, idx) => {
        if (!ringEl) return;
        const baseZ = -idx * RING_SPACING;
        let z = baseZ + offsetZ.current;
        z = ((z - MIN_Z) % TOTAL_DEPTH);
        if (z < 0) z += TOTAL_DEPTH;
        z += MIN_Z;

        ringEl.style.transform = `translate3d(0, 0, ${z}px)`;

        let opacity = 1;
        if (z > 0) {
          opacity = Math.max(0, 1 - z / MAX_Z);
        } else if (z < -2800) {
          opacity = Math.max(0, (z - MIN_Z) / (-2800 - MIN_Z));
        }

        ringEl.style.opacity = opacity.toString();
      });

      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const cardData = cards[idx];
        if (!cardData) return;
        const { baseZ, side, ringIndex } = cardData;

        let z = baseZ + offsetZ.current;
        z = ((z - MIN_Z) % TOTAL_DEPTH);
        if (z < 0) z += TOTAL_DEPTH;
        z += MIN_Z;

        let tx = 0;
        let ty = 0;
        let rx = 0;
        let ry = 0;

        const inward = 12;
        const currentDims = dimsRef.current;

        if (side === "left") {
          tx = -currentDims.width / 2 + inward;
          ty = (ringIndex % 4 === 0) ? -currentDims.staggerY : currentDims.staggerY;
          ry = 90;
        } else if (side === "right") {
          tx = currentDims.width / 2 - inward;
          ty = (ringIndex % 4 === 0) ? currentDims.staggerY : -currentDims.staggerY;
          ry = -90;
        } else if (side === "top") {
          tx = (ringIndex % 4 === 1) ? -currentDims.staggerX : currentDims.staggerX;
          ty = -currentDims.height / 2 + inward;
          rx = -90;
        } else if (side === "bottom") {
          tx = (ringIndex % 4 === 1) ? currentDims.staggerX : -currentDims.staggerX;
          ty = currentDims.height / 2 - inward;
          rx = 90;
        }

        const breatheTime = Date.now() * 0.0015;
        const floatZ = Math.sin(breatheTime + idx * 0.5) * 6;
        const tiltX = Math.sin(breatheTime * 0.8 + idx) * 1.2;
        const tiltY = Math.cos(breatheTime * 0.6 + idx) * 1.2;

        cardEl.style.transform = `translate3d(${tx}px, ${ty}px, ${z}px) rotateX(${rx + tiltX}deg) rotateY(${ry + tiltY}deg) translateZ(${floatZ}px)`;

        // Keep cards more visible (minimum 0.6 opacity even far away)
        let opacity = 1;
        if (z > 0) {
          opacity = Math.max(0, 1 - z / MAX_Z);
        } else if (z < -3500) {
          opacity = Math.max(0.6, (z - MIN_Z) / (-4000 - MIN_Z));
        }
        cardEl.style.opacity = opacity.toString();
        cardEl.style.pointerEvents = (z > 100 || z < -3500) ? "none" : "auto";
      });

      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cards]);

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      <div className={styles.viewport}>
        <div ref={cameraRef} className={styles.camera}>
          
          {longitudinalLines.map((line, index) => {
            const transformString = `translate3d(${line.x}px, ${line.y}px, ${-TOTAL_DEPTH / 2}px) rotateX(90deg)`;
            return (
              <div
                key={`line-${index}`}
                className={`${styles.longitudinalLine} ${line.className}`}
                style={{
                  transform: transformString,
                  height: `${TOTAL_DEPTH}px`,
                }}
              />
            );
          })}

          {Array.from({ length: N_RINGS }).map((_, i) => (
            <div
              key={`ring-${i}`}
              ref={(el) => {
                ringRefs.current[i] = el;
              }}
              className={styles.tunnelRing}
              style={{
                width: `${dims.width}px`,
                height: `${dims.height}px`,
                marginLeft: `${-dims.width / 2}px`,
                marginTop: `${-dims.height / 2}px`,
              }}
            />
          ))}

          {cards.map((card, index) => {
            return (
              <div
                key={`tunnel-card-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={styles.cardWrapper}
                style={{
                  width: `${dims.cardWidth}px`,
                  height: `${dims.cardHeight}px`,
                  marginLeft: `${-dims.cardWidth / 2}px`,
                  marginTop: `${-dims.cardHeight / 2}px`,
                }}
                onMouseEnter={() => {
                  isPaused.current = true;
                }}
                onMouseLeave={() => {
                  isPaused.current = false;
                }}
              >
                <Link
                  href={`/universities/${card.university?.slug || ""}`}
                  className={styles.card}
                  style={{
                    backgroundImage: `url(${card.university?.banner || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"})`,
                  }}
                >
                  <div className={styles.hoverOverlay}>
                    <span className={styles.hoverCountry}>{card.university?.country}</span>
                    <h3 className={styles.hoverUniName}>{card.university?.name}</h3>
                    <span className={styles.hoverRank}>QS #{card.university?.ranking?.qs || "Top"}</span>
                    <span className={styles.hoverCta}>View Profile &rarr;</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className={styles.fogOverlay} aria-hidden="true" />
      </div>

      <div className={styles.contentOverlay}>
        <span className={styles.pretitle}>
          PakSarZameen Admissions Advisory
        </span>
        <h1>&ldquo;The Premier Admissions Experts For Top Global Universities.&rdquo;</h1>
        <p>
          Over 90% of our guided applicants earned admission to their top-choice Early Decision &amp; Early Action universities.
        </p>
        <div className={styles.actions}>
          {onBookConsultation && (
            <button
              type="button"
              onClick={onBookConsultation}
              className="ivy-btn-orange text-xs sm:text-[13px] px-8 py-3.5 font-black shadow-lg"
            >
              Get Started
            </button>
          )}

          <a
            href="#track-record"
            className="inline-flex items-center justify-center border-2 border-white/80 text-white hover:bg-white hover:text-[#002E21] px-6 py-3 text-xs font-bold uppercase tracking-wider transition"
          >
            View Track Record &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
