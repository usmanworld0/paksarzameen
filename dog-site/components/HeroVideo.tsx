"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { DogLikeButton } from "./DogLikeButton";
import { loadDogCatalog, type DogRecord } from "../lib/dogApi";

const FRAME_COUNT = 240;
const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `/hero-sequence/ezgif-frame-${frameNumber}.jpg`;
});

export function HeroVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  // adjust offset for sticky hero so the progress covers the full 400vh section
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.45,
  });
  const [frameIndex, setFrameIndex] = useState(0);
  const [dogs, setDogs] = useState<DogRecord[]>([]);

  useEffect(() => {
    const frameImages = FRAME_SOURCES.map((source) => {
      const image = new window.Image();
      image.src = source;
      return image;
    });

    return () => {
      frameImages.length = 0;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const records = await loadDogCatalog();
        if (mounted) {
          setDogs(records);
        }
      } catch {
        if (mounted) {
          setDogs([]);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  // listen to the smoothed progress so frame updates follow the springed value
  useMotionValueEvent(smoothProgress, "change", (value) => {
    if (shouldReduceMotion) return;
    const nextFrame = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(value * (FRAME_COUNT - 1))));
    setFrameIndex((current) => (current === nextFrame ? current : nextFrame));
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("hero progress", value, "frame", nextFrame);
    }
  });

  const currentFrame = FRAME_SOURCES[frameIndex] ?? FRAME_SOURCES[0];
  const titleOpacity = useTransform(smoothProgress, [0.42, 0.5, 0.62], [0, 1, 1]);
  const titleY = useTransform(smoothProgress, [0.42, 0.5], [24, 0]);
  const textOpacity = useTransform(smoothProgress, [0.68, 0.75, 0.86], [0, 1, 1]);
  const textY = useTransform(smoothProgress, [0.68, 0.75], [18, 0]);
  const visibleDogs = useMemo(() => dogs.slice(0, 6), [dogs]);

  return (
    <>
      <section ref={sectionRef} className="relative h-[400vh] bg-white">
        <div className="sticky top-0 h-screen overflow-hidden bg-neutral-950 text-white">
          <div className="absolute inset-0">
            <Image
              src={currentFrame}
              alt="Dog rescue hero sequence"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.18)_0%,rgba(17,17,17,0.32)_44%,rgba(17,17,17,0.8)_100%)]" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-5 sm:px-8 lg:px-12">
            <div className="dog-container text-center">
              <div className="mx-auto max-w-4xl space-y-5">
                <motion.h1
                  style={{ opacity: shouldReduceMotion ? 1 : titleOpacity, y: shouldReduceMotion ? 0 : titleY }}
                  className="text-balance text-5xl font-normal uppercase tracking-[-0.06em] text-white sm:text-7xl lg:text-[7.5rem] lg:leading-[0.9]"
                >
                  Adopt a Stray,
                  <br />
                  Save a Life
                </motion.h1>

                <motion.p
                  style={{ opacity: shouldReduceMotion ? 1 : textOpacity, y: shouldReduceMotion ? 0 : textY }}
                  className="mx-auto max-w-2xl text-pretty text-sm leading-7 text-white/84 sm:text-base"
                >
                  A quieter way to meet dogs that need a home.
                </motion.p>

                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/dog-adoption" className="rounded-full bg-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-neutral-200">
                    Browse dogs
                  </Link>
                  <a href="#adopted-stories" className="rounded-full border border-white/24 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-white/8">
                    See adopted dogs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="adopted-stories" className="bg-white px-5 pb-20 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-8 space-y-3 border-b border-black/8 pb-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Dogs</p>
            <h2 className="text-3xl font-normal tracking-[-0.05em] text-neutral-950 sm:text-4xl">Real dogs from the live catalogue</h2>
            <div className="flex justify-center">
              <Link href="/dog-adoption" className="text-[10px] uppercase tracking-[0.24em] text-neutral-950">
                Browse all
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleDogs.map((dog, index) => (
              <article key={dog.dogId} className="overflow-hidden border border-black/8 bg-white transition duration-500 hover:border-black/20">
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Link href={`/dog/${dog.dogId}`} className="absolute inset-0 block">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-700 hover:scale-[1.02]"
                    />
                  </Link>
                  <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/40 px-3 py-1 text-[10px] font-normal uppercase tracking-[0.22em] text-white backdrop-blur-md">
                    Dog {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute right-4 top-4 z-10">
                    <DogLikeButton dogId={dog.dogId} compact />
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <Link href={`/dog/${dog.dogId}`} className="block">
                    <h3 className="text-2xl font-normal tracking-[-0.04em] text-neutral-950">{dog.name}</h3>
                    <p className="text-[13px] uppercase tracking-[0.18em] text-neutral-500">{dog.breed} · {dog.age}</p>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
