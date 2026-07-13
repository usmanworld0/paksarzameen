"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
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
  "/images/optimized/vectors/charity-set-1.webp",
  "/images/optimized/vectors/blood bank/blood-donation-02.webp",
  "/images/optimized/vectors/19198457.webp",
  "/images/optimized/vectors/6432897.webp",
  "/images/optimized/vectors/6660.webp",
  "/images/optimized/vectors/blood bank/pq6o-qij1-220606.webp",
] as const;

export function HomeClient() {
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

      const bookPages = gsap.utils.toArray<HTMLElement>(`.${styles.bookPage}`);
      if (bookPages.length) {
        gsap.timeline({
          scrollTrigger: {
            trigger: `.${styles.bookStage}`,
            start: "top 74%",
            end: "bottom 26%",
            scrub: 0.8,
          },
        }).to(bookPages, {
          rotateY: -154,
          transformOrigin: "8% 50%",
          ease: "none",
          stagger: 0.16,
        });
      }
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
        <p className={styles.sectionLabel}>01 - What is PSZ?</p>
        <div className={styles.problemGrid}>
          <h2 data-reveal>Potential is everywhere.<br /><em>Access is not.</em></h2>
          <div data-reveal><p>PakSarZameen is a community development platform that turns local care into practical, lasting action.</p><Link href="/about" className={styles.inlineLink}>Our story <span>&rarr;</span></Link></div>
        </div>
      </section>

      <section id="home-solution" className={styles.solution}>
        <div className={styles.solutionCopy} data-reveal><p className={styles.sectionLabel}>02 - What We Do?</p><h2>One mission.<br /><em>Many hands.</em></h2><p>We create pathways in education, healthcare, animal welfare, environmental action, and community support.</p><Link href="/programs" className={styles.buttonDark}>Explore our work <span>&rarr;</span></Link></div>
        <div className={styles.solutionPhoto} data-parallax="-50"><Image src="/images/optimized/full-team.webp" alt="Paksarzameen team" fill sizes="(max-width: 820px) 100vw, 50vw" className={styles.coverImage} /></div>
      </section>

      <section className={styles.departments} aria-labelledby="departments-heading">
        <div className={styles.departmentHeading} data-reveal><p className={styles.sectionLabel}>03 - Departments</p><h2 id="departments-heading">Turn a page.<br /><em>Find a way forward.</em></h2><p>Scroll through the chapters to reveal each part of the mission.</p></div>
        <div className={styles.bookStage} data-reveal>
          <div className={styles.book} aria-label="Interactive visual collection of Paksarzameen departments">
            <div className={styles.bookSpine} />
            {PROGRAM_CARDS.map((program, index) => (
              <div className={styles.bookPage} style={{ "--page": index } as CSSProperties} key={program.name}>
                <Link href="/programs" className={styles.pageSurface}>
                  <Image src={chapterVisuals[index]} alt="" fill sizes="(max-width: 820px) 78vw, 30vw" className={styles.pageImage} />
                  <div className={styles.pageShade} />
                  <div className={styles.pageText}><span>0{index + 1}</span><strong>{program.name}</strong><small>{program.tag}</small></div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="home-life-at-psz" className={styles.life}>
        <div className={styles.lifeVisual}><div className={styles.lifeImageOne} data-parallax="40"><Image src={HEART_MEMBERS[0].image} alt="Life at Paksarzameen" fill sizes="(max-width: 820px) 72vw, 34vw" className={styles.coverImage} /></div><div className={styles.lifeImageTwo} data-parallax="-40"><Image src={HEART_MEMBERS[1].image} alt="Paksarzameen volunteers" fill sizes="(max-width: 820px) 56vw, 23vw" className={styles.coverImage} /></div></div>
        <div className={styles.lifeCopy} data-reveal><p className={styles.sectionLabel}>04 - Life at PSZ</p><h2>Care, in<br /><em>motion.</em></h2><p>People who listen, make, learn, and show up for each other.</p><Link href="#home-team" className={styles.inlineLink}>Meet the team <span>&rarr;</span></Link></div>
      </section>

      <section id="home-team" className={styles.team} aria-labelledby="team-heading">
        <div className={styles.teamHeading} data-reveal><p className={styles.sectionLabel}>05 - The team</p><h2 id="team-heading">The people<br /><em>behind PSZ.</em></h2></div>
        <div className={styles.teamGallery} data-reveal>
          {HEART_MEMBERS.map((member, index) => <figure className={styles.teamMember} key={member.image}><Image src={member.image} alt={`Paksarzameen team member ${index + 1}`} fill sizes="(max-width: 820px) 47vw, 23vw" className={styles.coverImage} /><figcaption>PSZ / 0{index + 1}</figcaption></figure>)}
        </div>
      </section>

      <section className={styles.outreach} aria-label="Explore Paksarzameen">
        <p className={styles.sectionLabel}>06 - Continue the story</p>
        <div className={styles.outreachGrid}>{journeyLinks.map(([label, href], index) => <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className={styles.outreachLink} data-reveal><span>0{index + 1}</span><strong>{label}</strong><i></i></Link>)}</div>
      </section>

      <section className={styles.closing}><p className={styles.sectionLabel}>Paksarzameen</p><h2 data-reveal>Make the next<br />chapter possible.</h2><div className={styles.closingActions} data-reveal><Link href="/get-involved" className={styles.buttonDark}>Get involved <span>&rarr;</span></Link><Link href="/contact" className={styles.inlineLink}>Contact <span>&rarr;</span></Link></div></section>
    </main>
  );
}