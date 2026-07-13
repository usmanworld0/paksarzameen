"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, memo, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HEART_MEMBERS, PROGRAM_CARDS } from "@/features/home/home.content";
import { VIDEO_POSTERS } from "@/lib/utils/media-helpers";
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

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

      // Responsive Book Animations using matchMedia
      const mm = gsap.matchMedia();

      // Desktop animation (pinned scroll lock, horizontal double-page flip)
      mm.add("(min-width: 821px)", () => {
        const sheets = gsap.utils.toArray<HTMLElement>(".book-sheet-el");
        if (sheets.length) {
          sheets.forEach((sheet, idx) => {
            gsap.set(sheet, {
              zIndex: sheets.length - idx,
              z: (sheets.length - idx) * 0.8,
              rotateY: 0,
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: `.${styles.departments}`,
              start: "top top",
              end: `+=${sheets.length * 700}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          sheets.forEach((sheet, idx) => {
            tl.to(sheet, {
              rotateY: -180,
              ease: "power1.inOut",
              duration: 1,
            }, idx * 1.5);

            // Swap z-index halfway through the turn so the flipped sheet goes behind subsequent ones
            // Animate z-index stepwise over the duration of the flip to prevent snapping bugs on scroll stop
            tl.to(sheet, { zIndex: idx, ease: "power1.inOut", duration: 1 }, idx * 1.5);

            tl.to(sheet, {
              z: 22,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.out",
            }, idx * 1.5);
          });
        }
      });

      // Mobile animation (pinned scroll lock, single-page sweeping flip)
      mm.add("(max-width: 820px)", () => {
        const sheets = gsap.utils.toArray<HTMLElement>(".book-sheet-mobile-el");
        if (sheets.length) {
          sheets.forEach((sheet, idx) => {
            gsap.set(sheet, {
              zIndex: sheets.length - idx,
              z: (sheets.length - idx) * 0.8,
              rotateY: 0,
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: `.${styles.departments}`,
              start: "top top",
              end: `+=${sheets.length * 600}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          sheets.forEach((sheet, idx) => {
            tl.to(sheet, {
              rotateY: -180,
              ease: "power1.inOut",
              duration: 1,
            }, idx * 1.5);

            // Swap z-index halfway through the turn
            // Animate z-index stepwise over the duration of the flip
            tl.to(sheet, { zIndex: idx, ease: "power1.inOut", duration: 1 }, idx * 1.5);

            tl.to(sheet, {
              z: 18,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.out",
            }, idx * 1.5);
          });
        }
      });

    }, element);

    return () => context.revert();
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
          <p className={styles.eyebrowLight}>Pakistan - community-led change</p>
          <h1 id="home-title">Building<br />Community Wealth.</h1>
          <p className={styles.heroCopy}>Education, health, welfare, and opportunity shaped with communities across Pakistan.</p>
          <div className={styles.heroActions}>
            <Link href="#home-solution" className={styles.buttonLight}>Explore PSZ <span>&rarr;</span></Link>
            <Link href="/get-involved" className={styles.textLight}>Join the mission <span>&rarr;</span></Link>
          </div>
          <p className={styles.scrollPrompt}>Scroll to begin <span>&rarr;</span></p>
        </div>
      </section>

      <section id="home-problem" className={styles.problem}>
        <div className={styles.problemGrid}>
          <h2 className={styles.appleSectionHeader} data-reveal>What is PSZ?</h2>
          <div data-reveal>
            <p className={styles.appleSectionDesc}>PakSarZameen is a community development platform that turns local care into practical, lasting action.</p>
            <Link href="/about" className={styles.appleLink}>Our story &rarr;</Link>
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
          <p className={styles.appleSectionDesc}>Scroll to explore the chapters of PakSarZameen and see our work in action.</p>
        </div>
        
        <div className={styles.bookStage} data-reveal>
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
                          <span className={styles.coverPrompt}>Scroll to explore</span>
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
                    className={`${styles.bookSheetMobile} book-sheet-mobile-el`}
                  >
                    <div className={styles.pageFrontMobile}>
                      {index === 0 ? (
                        /* Mobile Book Cover */
                        <div className={styles.coverPage} style={{ height: "100%" }}>
                          <Image src="/paksarzameen_logo.png" alt="Paksarzameen" width={140} height={60} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                          <h3 className={styles.coverTitle} style={{ fontSize: "2rem" }}>PakSarZameen</h3>
                          <p className={styles.coverSubtitle}>Chapters of Progress</p>
                          <span className={styles.coverPrompt}>Scroll to explore</span>
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
      </section>

      <section id="home-life-at-psz" className={styles.life}>
        <div className={styles.lifeVisual}>
          <div className={styles.lifeImageOne} data-parallax="40">
            <Image src={HEART_MEMBERS[0].image} alt="Life at Paksarzameen" fill sizes="(max-width: 820px) 72vw, 34vw" className={styles.coverImage} />
          </div>
          <div className={styles.lifeImageTwo} data-parallax="-40">
            <Image src={HEART_MEMBERS[1].image} alt="Paksarzameen volunteers" fill sizes="(max-width: 820px) 56vw, 23vw" className={styles.coverImage} />
          </div>
        </div>
        <div className={styles.lifeCopy} data-reveal>
          <h2 className={styles.appleSectionHeader}>Life at PSZ</h2>
          <p className={styles.appleSectionDesc}>People who listen, make, learn, and show up for each other.</p>
          <Link href="#home-team" className={styles.appleLink}>Meet the team &rarr;</Link>
        </div>
      </section>

      <section id="home-team" className={styles.team} aria-labelledby="team-heading">
        <div className={styles.teamHeading} data-reveal>
          <h2 id="team-heading" className={styles.appleSectionHeaderLight}>The Team</h2>
          <p className={styles.appleSectionDescLight}>The people behind PakSarZameen bringing community-led change to life.</p>
        </div>
        <div className={styles.teamGallery} data-reveal>
          {HEART_MEMBERS.map((member, index) => (
            <figure className={styles.teamMember} key={member.image}>
              <Image src={member.image} alt={`Paksarzameen team member ${index + 1}`} fill sizes="(max-width: 820px) 47vw, 23vw" className={styles.coverImage} />
              <figcaption>PSZ / 0{index + 1}</figcaption>
            </figure>
          ))}
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