"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { University } from "@/data/universities";
import styles from "./TunnelHero.module.css";

interface TunnelHeroProps {
  universities: University[];
}

const N_RINGS = 6;
const CARDS_PER_RING = 4;
const RING_SPACING = 600; // Z spacing between rings
const TOTAL_DEPTH = N_RINGS * RING_SPACING; // 3600px
const MIN_Z = -3200;

export function TunnelHero({ universities }: TunnelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
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

  // Build array representing the 3D grid layout
  const cards = Array.from({ length: N_RINGS * CARDS_PER_RING }).map((_, index) => {
    const ringIndex = Math.floor(index / CARDS_PER_RING);
    const sideIndex = index % CARDS_PER_RING; // 0: Top, 1: Right, 2: Bottom, 3: Left
    
    // Cycle through universities mock data
    const university = universities[index % universities.length];
    
    return {
      index,
      ringIndex,
      sideIndex,
      university,
      // Base initial Z coordinate
      baseZ: -ringIndex * RING_SPACING,
    };
  });

  useEffect(() => {
    // 1. Mouse movement listener for camera tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      targetMouseX.current = x;
      targetMouseY.current = y;
    };

    const handleMouseLeave = () => {
      targetMouseX.current = 0;
      targetMouseY.current = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // 2. Animation loop using requestAnimationFrame
    const update = () => {
      // Forward speed
      if (!isPaused.current) {
        offsetZ.current += 1.8;
      }

      // Smooth camera tilt using linear interpolation (lerp)
      mouseX.current += (targetMouseX.current - mouseX.current) * 0.08;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.08;

      if (cameraRef.current) {
        const rx = -mouseY.current * 10;
        const ry = mouseX.current * 10;
        const tx = -mouseX.current * 25;
        const ty = -mouseY.current * 25;
        cameraRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;
      }

      // Update positions of cards individually in 3D space
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const cardData = cards[idx];
        const { baseZ, sideIndex } = cardData;

        let z = baseZ + offsetZ.current;
        z = ((z - MIN_Z) % TOTAL_DEPTH);
        if (z < 0) z += TOTAL_DEPTH;
        z += MIN_Z;

        const offsetDist = 280;
        let tx = 0;
        let ty = 0;
        let rx = 0;
        let ry = 0;

        if (sideIndex === 0) {
          ty = -offsetDist;
          rx = 90;
        } else if (sideIndex === 1) {
          tx = offsetDist;
          ry = -90;
        } else if (sideIndex === 2) {
          ty = offsetDist;
          rx = -90;
        } else if (sideIndex === 3) {
          tx = -offsetDist;
          ry = 90;
        }

        const opacity = z > 150 ? Math.max(0, 1 - (z - 150) / 250) : z < -2400 ? Math.max(0, (z + 3200) / 800) : 1;

        cardEl.style.transform = `translate3d(${tx}px, ${ty}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        cardEl.style.opacity = opacity.toString();
        cardEl.style.pointerEvents = z > 100 ? "none" : "auto";
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
  }, [cards, universities.length]);

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      <div className={styles.viewport}>
        <div className={styles.tunnelGrid} aria-hidden="true">
          <div className={styles.diagonalLine} style={{ transform: "rotate(45deg)" }} />
          <div className={styles.diagonalLine} style={{ transform: "rotate(-45deg)" }} />
          
          <div className={styles.gridSegment} style={{ transform: "translateZ(-600px)" }} />
          <div className={styles.gridSegment} style={{ transform: "translateZ(-1200px)" }} />
          <div className={styles.gridSegment} style={{ transform: "translateZ(-1800px)" }} />
          <div className={styles.gridSegment} style={{ transform: "translateZ(-2400px)" }} />
          <div className={styles.gridSegment} style={{ transform: "translateZ(-3000px)" }} />
        </div>

        <div ref={cameraRef} className={styles.camera}>
          {cards.map((card, index) => (
            <div
              key={`tunnel-card-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={styles.cardWrapper}
              onMouseEnter={() => {
                isPaused.current = true;
              }}
              onMouseLeave={() => {
                isPaused.current = false;
              }}
            >
              <Link href={`/universities/${card.university.slug}`} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.logoBadge} style={{ background: card.university.logo }}>
                    {card.university.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.headerInfo}>
                    <span className={styles.countryLabel}>{card.university.country}</span>
                    <h3 className={styles.uniName}>{card.university.name}</h3>
                  </div>
                </div>
                
                <div className={styles.cardBadges}>
                  <span className={styles.badge}>
                    🏆 QS #{card.university.ranking.qs}
                  </span>
                  {card.university.scholarships.available && (
                    <span className={`${styles.badge} ${styles.scholarshipBadge}`}>
                      🎓 Scholarship
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
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
