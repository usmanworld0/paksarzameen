"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, memo, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import Lenis from "lenis";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { HEART_MEMBERS, PROGRAM_CARDS } from "@/features/home/home.content";
import { VIDEO_POSTERS, getOptimizedImagePath } from "@/lib/utils/media-helpers";
import styles from "./HomeClient.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const journeyLinks = [
  ["Awards & Honors", "/impact"],
  ["Partnerships & Collaborations", "/get-involved"],
  ["News & Features", "/news"],
  ["Shop", "https://store.paksarzameenwfo.com"],
  ["Apply", "/volunteer"],
  ["FAQ", "/policies#faq"],
  ["Contact", "/contact"],
] as const;

const chapterVisuals = [
  "/images/placeholders/shajarkari.png",
  "/images/placeholders/Ehsas-ul-Haiwanat.png",
  "/images/placeholders/room-zia.png",
  "/images/placeholders/14.png",
  "/images/placeholders/Tibi-Imdad.png",
  "/images/placeholders/wajood-e-zan.png",
] as const;

export const HomeClient = memo(function HomeClient() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

    const scrollState = { rotation: 0 };
    let handleResize = () => {};
    let animationFrameId = 0;
    let geometry = new THREE.PlaneGeometry(1, 1);
    const memberPlanes: THREE.Mesh[] = [];
    let renderer: THREE.WebGLRenderer | null = null;

    // 3D Canvas Team Orbit Setup
    const canvas = canvasRef.current;
    if (canvas) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#f3f2ec"); // Match warm off-white background

      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
      pointLight.position.set(0, 0, 3);
      scene.add(pointLight);

      // Load 3D model
      const loader = new GLTFLoader();
      let logoMesh: THREE.Group | null = null;
      loader.load("/images/circular logo 3d model.glb", (gltf: GLTF) => {
        const mesh = gltf.scene;
        mesh.scale.set(1.4, 1.4, 1.4);
        mesh.position.set(0, 0, 0);

        mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            if (m.material) {
              if (m.material instanceof THREE.MeshStandardMaterial) {
                m.material.roughness = 0.3;
                m.material.metalness = 0.8;
              }
            }
          }
        });
        scene.add(mesh);
        logoMesh = mesh;
      }, undefined, (err: ErrorEvent | Error | unknown) => {
        console.error("Failed to load 3D model:", err);
      });

      // Orbit Setup
      const textureLoader = new THREE.TextureLoader();
      const teamGroup = new THREE.Group();
      scene.add(teamGroup);

      const radius = 2.8;
      const cardWidth = 1.35;
      const cardHeight = 1.8;
      geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

      HEART_MEMBERS.forEach((member, idx) => {
        const texture = textureLoader.load(getOptimizedImagePath(member.image, "md"));
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1.0,
        });
        const mesh = new THREE.Mesh(geometry, material);

        const angle = (idx / HEART_MEMBERS.length) * Math.PI * 2;
        mesh.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );

        teamGroup.add(mesh);
        memberPlanes.push(mesh);
      });

      let currentActiveIdx = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        teamGroup.rotation.y = scrollState.rotation;

        if (logoMesh) {
          logoMesh.rotation.y = clock.getElapsedTime() * 0.25 - scrollState.rotation * 3.5;
          logoMesh.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.08;
        }

        // Active member tracking and 3D card layout effects
        let closestIdx = 0;
        let minDistance = Infinity;
        const tempV = new THREE.Vector3();

        memberPlanes.forEach((mesh, idx) => {
          // Make cards face the camera directly (billboarding)
          mesh.lookAt(camera.position);

          // Get world position to measure distance
          mesh.getWorldPosition(tempV);
          const dist = tempV.distanceTo(camera.position);

          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }

          // Depth-based scaling and opacity
          // Z ranges from -radius to +radius in world space.
          // Normalize to [0, 1] factor where 1 is closest (most positive Z) and 0 is furthest (most negative Z)
          const zWorld = tempV.z;
          const factor = (zWorld + radius) / (2 * radius); // 0.0 to 1.0

          // Calculate target scale: front is larger (1.3), back is smaller (0.6)
          const targetScale = 0.6 + factor * 0.7;
          mesh.scale.set(targetScale, targetScale, 1.0);

          // Calculate target opacity: front is solid (1.0), back is faint (0.05)
          const targetOpacity = 0.05 + factor * 0.95;
          if (mesh.material instanceof THREE.MeshBasicMaterial) {
            mesh.material.opacity = targetOpacity;
            mesh.material.transparent = true;
          }
        });

        if (closestIdx !== currentActiveIdx) {
          currentActiveIdx = closestIdx;
          setActiveIndex(closestIdx);
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
      };
      animate();

      handleResize = () => {
        if (!canvas || !renderer) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        camera.aspect = aspect;

        let targetZ = 7.5;
        if (aspect < 1.15) {
          // Narrow or portrait screens: push camera back dynamically to fit the orbit width without cropping
          targetZ = Math.max(7.5, (7.5 * 1.15) / aspect);
        }
        camera.position.set(0, 0, targetZ);

        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
    }

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

      // 3D Team Section Scroll Trigger (initialized after book section to ensure correct DOM scroll order and layout spacing)
      const teamSection = document.getElementById("home-team");
      if (teamSection) {
        gsap.timeline({
          scrollTrigger: {
            trigger: teamSection,
            start: "top top",
            end: "+=3500",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        }).to(scrollState, {
          rotation: Math.PI * 2,
          ease: "none",
          duration: 1,
        });
      }

    }, element);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      if (canvas) {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        geometry.dispose();
        memberPlanes.forEach((mesh) => {
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose();
          }
        });
        if (renderer) {
          renderer.dispose();
        }
      }
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
          <h1 id="home-title">Building<br />Community Wealth.</h1>
          <p className={styles.heroCopy}>Education, health, welfare, and opportunity shaped with communities across Pakistan.</p>

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
            <p>PakSarZameen is a national movement empowering communities to lead their own change. We believe that true progress comes from within, through education, healthcare, welfare, and sustainable action.</p>
            <Link href="/programs" className={styles.appleLink}>Learn about our framework &rarr;</Link>
          </div>
        </div>
      </section>

      <section id="home-solution" className={styles.solution}>
        <div className={styles.solutionCopy} data-reveal>
          <h2 className={styles.appleSectionHeaderLight}>What We Do</h2>
          <p className={styles.appleSectionDescLight}>We create pathways in education, healthcare, animal welfare, environmental action, and community support.</p>
          <Link href="/programs" className={styles.appleButtonLight}>Explore our work &rarr;</Link>
        </div>
        <div className={styles.solutionPhoto} data-parallax="-50"><Image src="/images/optimized/full-team.webp" alt="Paksarzameen team" fill sizes="(max-width: 820px) 100vw, 50vw" className={styles.coverImage} /></div>
      </section>

      <section className={styles.departments} aria-labelledby="departments-heading">
        <div className={styles.departmentHeading} data-reveal>
          <h2 id="departments-heading" className={styles.appleSectionHeader}>Departments</h2>
          <p className={styles.appleSectionDesc}>Explore the chapters of PakSarZameen and see our work across education, healthcare, environmental action, and welfare.</p>
        </div>

        <div className={styles.bookWrapper} data-reveal>
          {/* Left Arrow to flip back */}
          <button
            type="button"
            onClick={() => {
              goToDesktopPage(flippedCount - 1);
              goToMobilePage(flippedCountMobile - 1);
            }}
            disabled={flippedCount === 0}
            className={styles.bookSideArrow}
            aria-label="Previous Chapter"
            title="Previous Chapter"
          >
            <ChevronLeft size={28} />
          </button>

          <div className={styles.bookStage}>
            {/* Desktop Double-Page Book (min-width: 821px) */}
            <div className={styles.bookContainer} aria-label="Interactive horizontal book of Paksarzameen departments">
              <div className={styles.bookInner}>
                <div className={styles.leftUnderlay} />
                <div className={styles.rightUnderlay} />
                <div className={styles.bookSpine} />

                {Array.from({ length: 7 }).map((_, index) => {
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
                        {index === 0 ? (
                          /* Book Cover */
                          <div className={styles.coverPage}>
                            <Image src="/paksarzameen_logo.png" alt="Paksarzameen" width={160} height={70} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                            <h3 className={styles.coverTitle}>PakSarZameen</h3>
                            <p className={styles.coverSubtitle}>Chapters of Progress</p>
                            <span className={styles.coverPrompt}>Click arrow to open &rarr;</span>
                          </div>
                        ) : (
                          /* Photo Page */
                          <div className={styles.photoPage}>
                            <div className={styles.photoFrame}>
                              <Image
                                src={chapterVisuals[index - 1]}
                                alt={PROGRAM_CARDS[index - 1].name}
                                fill
                                sizes="(max-width: 820px) 100vw, 40vw"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Back Face of the Sheet */}
                      <div className={styles.pageBack}>
                        {index === 6 ? (
                          /* Back Cover */
                          <div className={styles.coverPage}>
                            <h3 className={styles.coverTitle}>Our Journey</h3>
                            <p className={styles.coverSubtitle}>Continues with you</p>
                            <Link href="/get-involved" className={styles.coverPrompt} style={{ display: "inline-block", textDecoration: "none", cursor: "pointer" }}>
                              Join the mission &rarr;
                            </Link>
                          </div>
                        ) : (
                          /* Program Text Page */
                          <div className={styles.paperPage}>
                            <div className={styles.paperHeading}>
                              <span className={styles.paperTag}>{PROGRAM_CARDS[index].tag}</span>
                              <span className={styles.paperNum}>0{index + 1}</span>
                            </div>
                            <div className={styles.paperBody}>
                              <h4 className={styles.paperTitle}>{PROGRAM_CARDS[index].name}</h4>
                              <p className={styles.paperSubtitle}>{PROGRAM_CARDS[index].subtitle}</p>
                              <p className={styles.paperDesc}>{PROGRAM_CARDS[index].desc}</p>
                            </div>
                            <Link href="/programs" className={styles.paperCta}>
                              Explore program &rarr;
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Single-Page Notebook Book (max-width: 820px) */}
            <div className={styles.bookContainerMobile} aria-label="Interactive mobile book of Paksarzameen departments">
              <div className={styles.bookInnerMobile}>
                <div className={styles.bookSpineMobile} />

                {Array.from({ length: 8 }).map((_, index) => {
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
                        {index === 0 ? (
                          /* Mobile Book Cover */
                          <div className={styles.coverPage} style={{ height: "100%" }}>
                            <Image src="/paksarzameen_logo.png" alt="Paksarzameen" width={140} height={60} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                            <h3 className={styles.coverTitle} style={{ fontSize: "2rem" }}>PakSarZameen</h3>
                            <p className={styles.coverSubtitle}>Chapters of Progress</p>
                            <span className={styles.coverPrompt}>Tap arrow to open &rarr;</span>
                          </div>
                        ) : index === 7 ? (
                          /* Mobile Back Cover */
                          <div className={styles.coverPage} style={{ height: "100%" }}>
                            <h3 className={styles.coverTitle} style={{ fontSize: "2rem" }}>Our Journey</h3>
                            <p className={styles.coverSubtitle}>Continues with you</p>
                            <Link href="/get-involved" className={styles.coverPrompt} style={{ display: "inline-block", textDecoration: "none" }}>
                              Join the mission &rarr;
                            </Link>
                          </div>
                        ) : (
                          /* Mobile Program Page (Photo top, Text bottom) */
                          <>
                            <div className={styles.mobilePhotoFrame}>
                              <Image
                                src={chapterVisuals[index - 1]}
                                alt={PROGRAM_CARDS[index - 1].name}
                                fill
                                sizes="(max-width: 820px) 90vw, 10vw"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className={styles.mobilePageContent}>
                              <div>
                                <span className={styles.mobileTag}>{PROGRAM_CARDS[index - 1].tag}</span>
                                <h4 className={styles.mobileTitle}>{PROGRAM_CARDS[index - 1].name}</h4>
                                <p className={styles.mobileSubtitle}>{PROGRAM_CARDS[index - 1].subtitle}</p>
                                <p className={styles.mobileDesc}>{PROGRAM_CARDS[index - 1].desc}</p>
                              </div>
                              <Link href="/programs" className={styles.mobileCta}>
                                Explore program &rarr;
                              </Link>
                            </div>
                          </>
                        )}
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
            disabled={flippedCount >= 7}
            className={styles.bookSideArrow}
            aria-label="Next Chapter"
            title={flippedCount === 0 ? "Open Book" : "Next Chapter"}
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Page status label & dots indicator */}
        <div className={styles.bookIndicator} data-reveal>
          <span className={styles.bookStatus}>
            {flippedCount === 0
              ? "Cover: PakSarZameen"
              : flippedCount <= 6
              ? `0${flippedCount} — ${PROGRAM_CARDS[flippedCount - 1].name}`
              : "Our Journey Continues"}
          </span>
          <div className={styles.bookDots}>
            {Array.from({ length: 8 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  goToDesktopPage(dotIdx);
                  goToMobilePage(dotIdx);
                }}
                className={`${styles.bookDot} ${flippedCount === dotIdx ? styles.bookDotActive : ""}`}
                aria-label={`Go to page ${dotIdx}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="home-team" className={styles.team} aria-labelledby="team-heading">
        <div className={styles.teamHeading} data-reveal>
          <h2 id="team-heading" className={styles.appleSectionHeader}>The Team</h2>
          <p className={styles.appleSectionDesc}>The people behind PakSarZameen bringing community-led change to life.</p>
          
          <div className={styles.activeMemberDetails}>
            <span className={styles.activeMemberNum}>PSZ / 0{activeIndex + 1}</span>
            <h3 className={styles.activeMemberName}>{HEART_MEMBERS[activeIndex]?.name}</h3>
            <p className={styles.activeMemberRole}>{HEART_MEMBERS[activeIndex]?.role}</p>
          </div>
        </div>
        
        <div className={styles.teamStage} data-reveal>
          <canvas ref={canvasRef} className={styles.teamCanvas} />
        </div>
      </section>

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