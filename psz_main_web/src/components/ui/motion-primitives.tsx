"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Reveal on Scroll ─── */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 80, y: 0 },
    right: { x: -80, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: directionMap[direction].y,
        x: directionMap[direction].x,
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Parallax Layer ─── */
type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Floating Card with 3D Tilt ─── */
type FloatingCardProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
};

export function FloatingCard({
  children,
  className,
  glowColor = "rgba(0, 166, 81, 0.1)",
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
    ref.current.style.boxShadow = `${-x * 20}px ${y * 20}px 60px ${glowColor}`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    ref.current.style.boxShadow = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "transition-[box-shadow] duration-300 ease-out will-change-transform",
        className
      )}
      style={{ transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out" }}
    >
      {children}
    </div>
  );
}

/* ─── Stagger Container ─── */
type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerDelay?: number;
};

export function Stagger({
  children,
  className,
  delayChildren = 0.2,
  staggerDelay = 0.1,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Magnetic Hover Button ─── */
type MagneticProps = {
  children: React.ReactNode;
  className?: string;
};

export function Magnetic({ children, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-300 ease-out", className)}
    >
      {children}
    </div>
  );
}

/* ─── Section Wrapper with cinematic spacing ─── */
type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24 md:py-32 lg:py-40 section-fade", className)}
    >
      {children}
    </section>
  );
}

/* ─── Container ─── */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/* ─── Section Header ─── */
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  titleClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  titleClassName,
}: SectionHeaderProps) {
  return (
    <Reveal>
      <div className={cn(align === "center" && "text-center mx-auto max-w-3xl")}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green mb-4">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text leading-[1.1]",
            titleClassName
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-6 text-lg md:text-xl text-psz-gray-400 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
