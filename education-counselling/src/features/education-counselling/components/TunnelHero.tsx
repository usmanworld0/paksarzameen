"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import Link from "next/link";
import { University } from "@/data/universities";
import styles from "./TunnelHero.module.css";

interface TunnelHeroProps {
  universities: University[];
}

const N_RINGS = 12;
const RING_SPACING = 350; // Z spacing between rings (350px)
const TOTAL_DEPTH = N_RINGS * RING_SPACING; // 4200px
const MAX_Z = 200; // recycling threshold close to camera
const MIN_Z = MAX_Z - TOTAL_DEPTH; // -4000px

const PANEL_COLORS = ["#f5b041", "#27ae60", "#2980b9", "#8e44ad", "#e74c3c", "#e67e22"];

export function TunnelHero({ universities }: TunnelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation state refs
  const offsetZ = useRef(0);
  const isPaused = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // Mouse coords for lerp camera movement
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
          width: 330,
          height: Math.max(480, h - 300),
          cardWidth: 140,
          cardHeight: 90,
          staggerX: 30,
          staggerY: 40,
        });
      } else if (w < 768) {
        setDims({
          width: 600,
          height: Math.max(520, h - 300),
          cardWidth: 190,
          cardHeight: 125,
          staggerX: 70,
          staggerY: 50,
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

  // Build 16 longitudinal lines
  const longitudinalLines = useMemo(() => {
    const w = dims.width;
    const h = dims.height;
    return [
      // 4 corners
      { x: -w / 2, y: -h / 2, className: styles.cornerLine },
      { x: w / 2, y: -h / 2, className: styles.cornerLine },
      { x: -w / 2, y: h / 2, className: styles.cornerLine },
      { x: w / 2, y: h / 2, className: styles.cornerLine },

      // Left wall guides
      { x: -w / 2, y: -h / 4, className: styles.gridLine },
      { x: -w / 2, y: 0, className: styles.gridLine },
      { x: -w / 2, y: h / 4, className: styles.gridLine },

      // Right wall guides
      { x: w / 2, y: -h / 4, className: styles.gridLine },
      { x: w / 2, y: 0, className: styles.gridLine },
      { x: w / 2, y: h / 4, className: styles.gridLine },

      // Ceiling guides
      { x: -w / 4, y: -h / 2, className: styles.gridLine },
      { x: 0, y: -h / 2, className: styles.gridLine },
      { x: w / 4, y: -h / 2, className: styles.gridLine },

      // Floor guides
      { x: -w / 4, y: h / 2, className: styles.gridLine },
      { x: 0, y: h / 2, className: styles.gridLine },
      { x: w / 4, y: h / 2, className: styles.gridLine },
    ];
  }, [dims.width, dims.height]);

  // Build 24 cards (2 per ring index) alternating left, right, ceiling, floor
  const cards = useMemo(() => {
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

      // Cycle through universities mock data
      const university = universities[index % universities.length];

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

    // Mouse movement listener for camera tilt
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

    // Animation loop using requestAnimationFrame
    const update = () => {
      // Forward camera speed
      if (!isPaused.current) {
        offsetZ.current += 1.8;
      }

      // Smooth camera tilt using linear interpolation (lerp)
      mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

      const time = Date.now() * 0.0008;
      // Gentle circular float for camera drone effect
      const floatX = Math.sin(time) * 15;
      const floatY = Math.cos(time * 0.8) * 10;
      const floatRotZ = Math.sin(time * 0.5) * 0.4; // Z-axis camera roll

      if (cameraRef.current) {
        const rx = -mouseY.current * 8 + Math.sin(time * 0.6) * 0.5;
        const ry = mouseX.current * 8 + Math.cos(time * 0.5) * 0.5;
        const rz = floatRotZ;
        const tx = -mouseX.current * 25 + floatX;
        const ty = -mouseY.current * 20 + floatY;
        cameraRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }

      // Update positions of rings
      ringRefs.current.forEach((ringEl, idx) => {
        if (!ringEl) return;
        const baseZ = -idx * RING_SPACING;
        let z = baseZ + offsetZ.current;
        z = ((z - MIN_Z) % TOTAL_DEPTH);
        if (z < 0) z += TOTAL_DEPTH;
        z += MIN_Z;

        ringEl.style.transform = `translate3d(0, 0, ${z}px)`;

        // Fade out rings when they get close to camera (z > 0) or very far (z < -2800)
        let opacity = 1;
        if (z > 0) {
          opacity = Math.max(0, 1 - z / MAX_Z);
        } else if (z < -2800) {
          opacity = Math.max(0, (z - MIN_Z) / (-2800 - MIN_Z));
        }

        ringEl.style.opacity = opacity.toString();
      });

      // Update positions of cards individually in 3D space
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const cardData = cards[idx];
        const { baseZ, side, ringIndex } = cardData;

        let z = baseZ + offsetZ.current;
        z = ((z - MIN_Z) % TOTAL_DEPTH);
        if (z < 0) z += TOTAL_DEPTH;
        z += MIN_Z;

        // Position on walls based on orientation
        let tx = 0;
        let ty = 0;
        let rx = 0;
        let ry = 0;

        const inward = 12; // CARD_OFFSET_INWARD
        const currentDims = dimsRef.current;

        if (side === "left") {
          tx = -currentDims.width / 2 + inward;
          ty = (ringIndex % 4 === 0) ? -currentDims.staggerY : currentDims.staggerY; // stagger vertically
          ry = 90;
        } else if (side === "right") {
          tx = currentDims.width / 2 - inward;
          ty = (ringIndex % 4 === 0) ? currentDims.staggerY : -currentDims.staggerY; // stagger vertically
          ry = -90;
        } else if (side === "top") {
          tx = (ringIndex % 4 === 1) ? -currentDims.staggerX : currentDims.staggerX; // stagger horizontally
          ty = -currentDims.height / 2 + inward;
          rx = -90;
        } else if (side === "bottom") {
          tx = (ringIndex % 4 === 1) ? currentDims.staggerX : -currentDims.staggerX; // stagger horizontally
          ty = currentDims.height / 2 - inward;
          rx = 90;
        }

        // Breathing float & dynamic tilt per card
        const breatheTime = Date.now() * 0.0015;
        const floatZ = Math.sin(breatheTime + idx * 0.5) * 8; // 8px breathing float
        const tiltX = Math.sin(breatheTime * 0.8 + idx) * 1.5;
        const tiltY = Math.cos(breatheTime * 0.6 + idx) * 1.5;

        cardEl.style.transform = `translate3d(${tx}px, ${ty}px, ${z}px) rotateX(${rx + tiltX}deg) rotateY(${ry + tiltY}deg) translateZ(${floatZ}px)`;

        // Opacity fading
        let opacity = 1;
        if (z > 0) {
          opacity = Math.max(0, 1 - z / MAX_Z);
        } else if (z < -3500) {
          opacity = Math.max(0.4, (z - MIN_Z) / (-4000 - MIN_Z));
        }
        cardEl.style.opacity = opacity.toString();

        // Enable interaction when card is in readable range
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
          {/* Longitudinal guides forming the tunnel wireframe */}
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

          {/* Transverse moving wireframe rings */}
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

          {/* University Cards on walls, ceiling, and floor */}
          {cards.map((card, index) => {
            // Alternate between colorful panel and university photo panel
            const isImagePanel = index % 2 === 1;
            const panelColor = PANEL_COLORS[Math.floor(index / 2) % PANEL_COLORS.length];

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
                  href={`/universities/${card.university.slug}`}
                  className={styles.card}
                  style={
                    isImagePanel
                      ? { backgroundImage: `url(${card.university.banner})` }
                      : { backgroundColor: panelColor }
                  }
                >
                  {/* Suggestion box (University name details) displayed by default */}
                  <div className={styles.hoverOverlay}>
                    <span className={styles.hoverCountry}>{card.university.country}</span>
                    <h3 className={styles.hoverUniName}>{card.university.name}</h3>
                    <span className={styles.hoverRank}>QS Rank: #{card.university.ranking.qs}</span>
                    <span className={styles.hoverCta}>View Details &rarr;</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Central fog overlay for atmospheric depth and text readability */}
        <div className={styles.fogOverlay} aria-hidden="true" />
      </div>

      <div className={styles.contentOverlay}>
        <span className={styles.pretitle}>Global Pathways</span>
        <h1>Education Counselling</h1>
        <p>
          Take the next step in your academic journey. Explore elite international universities, scholarship qualifications, and tailored pathway guidance.
        </p>
        <div className={styles.actions}>
          <a href="#search-section" className={styles.primaryButton}>
            Find Universities &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
