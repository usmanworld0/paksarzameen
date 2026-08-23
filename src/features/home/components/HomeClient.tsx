"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, memo, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { VIDEO_POSTERS } from "@/lib/utils/media-helpers";
import { AwardsHonoursShowcase } from "./AwardsHonoursShowcase";
import { PartnershipsMarquee } from "./PartnershipsMarquee";
import { NewsPaperShowcase } from "./NewsPaperShowcase";
import styles from "./HomeClient.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const journeyLinks = [
  ["Shop", "https://store.paksarzameenwfo.com"],
  ["Apply", "/volunteer"],
  ["FAQ", "/policies#faq"],
  ["Contact", "/contact"],
] as const;

const TOTAL_CANVA_PAGES = 52;
const TOTAL_DESKTOP_SHEETS = 26; // 52 pages = 26 double-sided sheets

const getCanvaPageSrc = (pageNum: number) =>
  `/images/psz-portfolio-optimized/${pageNum}.webp`;

export const HomeClient = memo(function HomeClient() {
  const root = useRef<HTMLDivElement>(null);

  const [flippedCount, setFlippedCount] = useState(0);
  const [flippedCountMobile, setFlippedCountMobile] = useState(0);
  const isAnimatingDesktopRef = useRef(false);
  const isAnimatingMobileRef = useRef(false);
  const desktopSheetsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSheetsRef = useRef<(HTMLDivElement | null)[]>([]);

  const goToDesktopPage = useCallback((targetFlipped: number) => {
    if (isAnimatingDesktopRef.current) return;
    const sheets = desktopSheetsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!sheets.length) return;

    const clampedTarget = Math.max(0, Math.min(sheets.length, targetFlipped));
    if (clampedTarget === flippedCount) return;

    isAnimatingDesktopRef.current = true;
    const currentFlipped = flippedCount;
    setFlippedCount(clampedTarget);

    if (clampedTarget > currentFlipped) {
      for (let i = currentFlipped; i < clampedTarget; i++) {
        const sheet = sheets[i];
        const stepIndex = i - currentFlipped;
        const delay = stepIndex * 0.1;
        const finalZ = (i + 1) * 1.5;
        const finalZIndex = i + 1;

        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (i === clampedTarget - 1) {
              isAnimatingDesktopRef.current = false;
            }
          },
        });

        tl.to(sheet, {
          rotateY: -180,
          duration: 0.7,
          ease: "power2.inOut",
        }, 0);

        tl.to(sheet, {
          z: 28,
          duration: 0.35,
          ease: "power1.out",
        }, 0);

        tl.to(sheet, {
          z: finalZ,
          duration: 0.35,
          ease: "power1.in",
        }, 0.35);

        tl.set(sheet, {
          zIndex: finalZIndex,
        }, 0.35);
      }
    } else {
      for (let i = currentFlipped - 1; i >= clampedTarget; i--) {
        const sheet = sheets[i];
        const stepIndex = currentFlipped - 1 - i;
        const delay = stepIndex * 0.1;
        const finalZ = (sheets.length - i) * 1.5;
        const finalZIndex = sheets.length - i;

        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (i === clampedTarget) {
              isAnimatingDesktopRef.current = false;
            }
          },
        });

        tl.to(sheet, {
          rotateY: 0,
          duration: 0.7,
          ease: "power2.inOut",
        }, 0);

        tl.to(sheet, {
          z: 28,
          duration: 0.35,
          ease: "power1.out",
        }, 0);

        tl.to(sheet, {
          z: finalZ,
          duration: 0.35,
          ease: "power1.in",
        }, 0.35);

        tl.set(sheet, {
          zIndex: finalZIndex,
        }, 0.35);
      }
    }
  }, [flippedCount]);

  const goToMobilePage = useCallback((targetFlipped: number) => {
    if (isAnimatingMobileRef.current) return;
    const sheets = mobileSheetsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!sheets.length) return;

    const clampedTarget = Math.max(0, Math.min(sheets.length, targetFlipped));
    if (clampedTarget === flippedCountMobile) return;

    isAnimatingMobileRef.current = true;
    const currentFlipped = flippedCountMobile;
    setFlippedCountMobile(clampedTarget);

    if (clampedTarget > currentFlipped) {
      for (let i = currentFlipped; i < clampedTarget; i++) {
        const sheet = sheets[i];
        const stepIndex = i - currentFlipped;
        const delay = stepIndex * 0.1;
        const finalZ = (i + 1) * 1.5;
        const finalZIndex = i + 1;

        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (i === clampedTarget - 1) {
              isAnimatingMobileRef.current = false;
            }
          },
        });

        tl.to(sheet, {
          rotateY: -180,
          duration: 0.65,
          ease: "power2.inOut",
        }, 0);

        tl.to(sheet, {
          z: 24,
          duration: 0.325,
          ease: "power1.out",
        }, 0);

        tl.to(sheet, {
          z: finalZ,
          duration: 0.325,
          ease: "power1.in",
        }, 0.325);

        tl.set(sheet, {
          zIndex: finalZIndex,
        }, 0.325);
      }
    } else {
      for (let i = currentFlipped - 1; i >= clampedTarget; i--) {
        const sheet = sheets[i];
        const stepIndex = currentFlipped - 1 - i;
        const delay = stepIndex * 0.1;
        const finalZ = (sheets.length - i) * 1.5;
        const finalZIndex = sheets.length - i;

        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (i === clampedTarget) {
              isAnimatingMobileRef.current = false;
            }
          },
        });

        tl.to(sheet, {
          rotateY: 0,
          duration: 0.65,
          ease: "power2.inOut",
        }, 0);

        tl.to(sheet, {
          z: 24,
          duration: 0.325,
          ease: "power1.out",
        }, 0);

        tl.to(sheet, {
          z: finalZ,
          duration: 0.325,
          ease: "power1.in",
        }, 0.325);

        tl.set(sheet, {
          zIndex: finalZIndex,
        }, 0.325);
      }
    }
  }, [flippedCountMobile]);

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    
    // Connect GSAP ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.to(`.${styles.heroMedia}`, {
        yPercent: 15,
        scale: 1.07,
        ease: "none",
        scrollTrigger: { trigger: `.${styles.hero}`, start: "top top", end: "bottom top", scrub: true },
      });

      element.querySelectorAll<HTMLElement>("[data-parallax]").forEach((item) => {
        gsap.to(item, {
          y: Number(item.dataset.parallax ?? 0),
          ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.7 },
        });
      });

      element.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 84%", once: true },
        });
      });

      // Initialize Desktop Book sheets position
      const desktopSheets = desktopSheetsRef.current.filter(Boolean) as HTMLDivElement[];
      desktopSheets.forEach((sheet, idx) => {
        gsap.set(sheet, {
          zIndex: desktopSheets.length - idx,
          z: (desktopSheets.length - idx) * 1.5,
          rotateY: 0,
        });
      });

      // Initialize Mobile Book sheets position
      const mobileSheets = mobileSheetsRef.current.filter(Boolean) as HTMLDivElement[];
      mobileSheets.forEach((sheet, idx) => {
        gsap.set(sheet, {
          zIndex: mobileSheets.length - idx,
          z: (mobileSheets.length - idx) * 1.5,
          rotateY: 0,
        });
      });
    }, element);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <main ref={root} className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <video autoPlay loop muted playsInline preload="metadata" poster={VIDEO_POSTERS.hero}>
            <source src="/videos/hero_video.webm" type="video/webm" />
          </video>
        </div>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <Image className={styles.heroLogo} src="/paksarzameen_logo.png" alt="Paksarzameen" width={270} height={110} priority />
          <h1 id="home-title">تربیت سے تعلیم</h1>
          <p className={styles.heroCopy}>reorganising everyday living</p>

          <div className={styles.heroQuickRoutes}>
            <span className={styles.heroQuickLabel}>Explore Portals:</span>
            <div className={styles.heroQuickLinks}>
              <Link
                href={siteConfig.educationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroQuickBadge}
              >
                Education &rarr;
              </Link>
              <Link href="/dog-adoption" className={styles.heroQuickBadge}>
                Adopt a Dog &rarr;
              </Link>
              <Link
                href={siteConfig.commonwealthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroQuickBadge}
              >
                Store &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="home-problem" className={styles.problem}>
        <div className={styles.problemGrid}>
          <h2 className={styles.appleSectionHeader} data-reveal>What is PSZ?</h2>
          <div data-reveal>
            <p className={styles.highlightText}>Systemic unequal systems of power make countries serve debt over people, treat poverty as an individual failure, allow environmental harm in one place for the benefit of another, and weaken people’s ability to shape their own knowledge, priorities, and future, which leads to underdevelopment</p>
            <Link href="/programs" className={styles.appleLink}>Learn about our framework &rarr;</Link>
          </div>
        </div>
      </section>

      <section id="home-solution" className={styles.solution}>
        <div className={styles.solutionCopy} data-reveal>
          <h2 className={styles.appleSectionHeaderLight}>What We Do</h2>
          <p className={styles.highlightTextLight}>We believe development begins when humans have the freedom to shape their own time, choices, and future. We work toward this by helping families build income, supporting students to study abroad through scholarships, giving young scholars space to share their ideas, protecting the environment through plantation and recycling and creating projects that living bodies feel seen, included, and able to grow.</p>
          <Link href="/programs" className={styles.appleButtonLight}>Explore our work &rarr;</Link>
        </div>
        <div className={styles.solutionPhoto}><Image src="/images/optimized/full-team.webp" alt="Paksarzameen team" fill sizes="(max-width: 820px) 100vw, 50vw" className={styles.coverImage} /></div>
      </section>

      <section className={styles.departments} aria-labelledby="departments-heading">
        <div className={styles.departmentHeading} data-reveal>
          <h2 id="departments-heading" className={styles.appleSectionHeader}>Our Journey</h2>
          <p className={styles.appleSectionDesc}>Explore the chapters of PakSarZameen&apos;s journey across education, healthcare, environmental action, and welfare.</p>
        </div>

        <div className={styles.bookWrapper} data-reveal>
          {/* Left Arrow to flip back */}
          <button
            type="button"
            onClick={() => {
              goToDesktopPage(flippedCount - 1);
              goToMobilePage(flippedCountMobile - 1);
            }}
            disabled={flippedCount === 0 && flippedCountMobile === 0}
            className={styles.bookSideArrow}
            aria-label="Previous Page"
            title="Previous Page"
          >
            <ChevronLeft size={28} />
          </button>

          <div className={styles.bookStage}>
            {/* Desktop Double-Page Book (min-width: 821px) */}
            <div className={styles.bookContainer} aria-label="Interactive portfolio book of Paksarzameen">
              <div className={styles.bookInner}>
                <div className={styles.leftUnderlay} />
                <div className={styles.rightUnderlay} />
                <div className={styles.bookSpine} />

                {Array.from({ length: TOTAL_DESKTOP_SHEETS }).map((_, index) => {
                  const frontPageNum = index * 2 + 1;
                  const backPageNum = index * 2 + 2;

                  return (
                    <div
                      key={`desktop-sheet-${index}`}
                      ref={(el) => {
                        desktopSheetsRef.current[index] = el;
                      }}
                      onClick={() => {
                        if (index >= flippedCount) {
                          goToDesktopPage(index + 1);
                        } else {
                          goToDesktopPage(index);
                        }
                      }}
                      className={`${styles.bookSheet} book-sheet-el`}
                    >
                      {/* Front Face of the Sheet */}
                      <div className={styles.pageFront}>
                        <Image
                          src={getCanvaPageSrc(frontPageNum)}
                          alt={`PakSarZameen Portfolio Page ${frontPageNum}`}
                          fill
                          sizes="(max-width: 820px) 100vw, 40vw"
                          style={{ objectFit: "cover" }}
                          priority={frontPageNum <= 4}
                          unoptimized
                        />
                      </div>

                      {/* Back Face of the Sheet */}
                      <div className={styles.pageBack}>
                        <Image
                          src={getCanvaPageSrc(backPageNum)}
                          alt={`PakSarZameen Portfolio Page ${backPageNum}`}
                          fill
                          sizes="(max-width: 820px) 100vw, 40vw"
                          style={{ objectFit: "cover" }}
                          priority={backPageNum <= 4}
                          unoptimized
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Single-Page Notebook Book (max-width: 820px) */}
            <div className={styles.bookContainerMobile} aria-label="Interactive mobile portfolio book of Paksarzameen">
              <div className={styles.bookInnerMobile}>
                <div className={styles.bookSpineMobile} />

                {Array.from({ length: TOTAL_CANVA_PAGES }).map((_, index) => {
                  const pageNum = index + 1;

                  return (
                    <div
                      key={`mobile-sheet-${index}`}
                      ref={(el) => {
                        mobileSheetsRef.current[index] = el;
                      }}
                      onClick={() => {
                        if (index >= flippedCountMobile) {
                          goToMobilePage(index + 1);
                        } else {
                          goToMobilePage(index);
                        }
                      }}
                      className={`${styles.bookSheetMobile} book-sheet-mobile-el`}
                    >
                      <div className={styles.pageFrontMobile}>
                        <Image
                          src={getCanvaPageSrc(pageNum)}
                          alt={`PakSarZameen Portfolio Page ${pageNum}`}
                          fill
                          sizes="(max-width: 820px) 90vw, 10vw"
                          style={{ objectFit: "cover" }}
                          priority={pageNum <= 2}
                          unoptimized
                        />
                      </div>
                      <div className={styles.pageBackMobile} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Arrow to flip forward */}
          <button
            type="button"
            onClick={() => {
              goToDesktopPage(flippedCount + 1);
              goToMobilePage(flippedCountMobile + 1);
            }}
            disabled={flippedCount >= TOTAL_DESKTOP_SHEETS && flippedCountMobile >= TOTAL_CANVA_PAGES - 1}
            className={styles.bookSideArrow}
            aria-label="Next Page"
            title={flippedCount === 0 ? "Open Book" : "Next Page"}
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Page status label & dots indicator */}
        <div className={styles.bookIndicator} data-reveal>
          <span className={styles.bookStatus}>
            {flippedCount === 0
              ? "Cover — Page 01 of 52"
              : flippedCount < TOTAL_DESKTOP_SHEETS
              ? `Pages ${String(flippedCount * 2).padStart(2, "0")} - ${String(flippedCount * 2 + 1).padStart(2, "0")} of 52`
              : "Back Cover — Page 52 of 52"}
          </span>
          <div className={styles.bookDots}>
            {Array.from({ length: TOTAL_DESKTOP_SHEETS }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  goToDesktopPage(dotIdx);
                  goToMobilePage(dotIdx * 2);
                }}
                className={`${styles.bookDot} ${flippedCount === dotIdx ? styles.bookDotActive : ""}`}
                aria-label={`Go to spread ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Awards & Honours Showcase */}
      <AwardsHonoursShowcase />

      {/* Flowing Linear Partnerships & Collaborations Logo Row */}
      <PartnershipsMarquee />

      {/* News & Features Flippable 3D Newspaper */}
      <NewsPaperShowcase />

      <section className={styles.outreach} aria-label="Explore Paksarzameen">
        <h2 className={styles.appleSectionHeader} data-reveal>Explore More</h2>
        <div className={styles.outreachGrid}>
          {journeyLinks.map(([label, href], index) => (
            <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className={styles.outreachLink} data-reveal>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
              <i></i>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <h2 data-reveal className={styles.appleSectionHeaderLight}>Make the next chapter possible</h2>
        <div className={styles.closingActions} data-reveal>
          <Link href="/get-involved" className={styles.appleButtonLight}>Get involved &rarr;</Link>
          <Link href="/contact" className={styles.appleLinkLight}>Contact &rarr;</Link>
        </div>
      </section>
    </main>
  );
});