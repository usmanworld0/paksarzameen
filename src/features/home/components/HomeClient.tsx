"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HEART_MEMBERS, PROGRAM_CARDS } from "@/features/home/home.content";
import { VIDEO_POSTERS } from "@/lib/utils/media-helpers";
import styles from "./HomeClient.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const impact = [["50K+", "lives reached through local action"], ["120+", "schools and learning spaces supported"], ["15K+", "medical consultations enabled"], ["3K+", "families supported with dignity"]] as const;

export function HomeClient() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.to("." + styles.heroMedia, { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: "." + styles.hero, start: "top top", end: "bottom top", scrub: true } });
      element.querySelectorAll<HTMLElement>("[data-parallax]").forEach((item) => {
        gsap.to(item, { y: Number(item.dataset.parallax ?? 0), ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      });
      element.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.fromTo(item, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 84%", once: true } });
      });
    }, element);
    return () => context.revert();
  }, []);

  return <div ref={root} className={styles.home}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroMedia} aria-hidden="true"><video autoPlay loop muted playsInline preload="metadata" poster={VIDEO_POSTERS.hero}><source src="/videos/hero_video.webm" type="video/webm" /></video></div>
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroInner}>
        <p className={styles.eyebrowLight}>Pakistan · community-led change</p>
        <h1 id="home-title">A more caring Pakistan<br />starts close to home.</h1>
        <p className={styles.heroCopy}>PakSarZameen turns everyday compassion into education, health, welfare, and opportunity that communities can carry forward.</p>
        <div className={styles.heroActions}><Link href="#home-solution" className={styles.buttonLight}>Our mission <span>↓</span></Link><Link href="/get-involved" className={styles.textLight}>Get involved <span>↗</span></Link></div>
        <p className={styles.scrollPrompt}>Scroll to begin <span>↓</span></p>
      </div>
    </section>

    <section id="home-problem" className={styles.intro}>
      <div className={styles.sectionLabel}>01 — The reason</div>
      <div className={styles.introGrid}><h2 data-reveal>Potential is everywhere.<br />Access is not.</h2><div data-reveal><p>Across Pakistan, too many people are held back by distance from care, learning, support, and dignified ways to earn. The problem is rarely a lack of will. It is a lack of dependable pathways.</p><p>PSZ exists to close that distance with practical action, shaped with—not simply for—the communities we serve.</p><Link href="/about" className={styles.inlineLink}>Read our story <span>→</span></Link></div></div>
    </section>

    <section id="home-solution" className={styles.mission}>
      <div className={styles.missionArt} data-parallax="-70"><Image src="/images/full_team.jpeg" alt="PakSarZameen volunteers together" fill sizes="(max-width: 900px) 100vw, 54vw" className={styles.coverImage} /></div>
      <div className={styles.missionCopy} data-reveal><p className={styles.sectionLabel}>02 — The mission</p><h2>Build community wealth—<em>together.</em></h2><p>We partner with local people, volunteers, and institutions to make help useful in the real world: learning that opens doors, healthcare that reaches people sooner, and welfare that protects dignity.</p><Link href="/programs" className={styles.buttonDark}>Explore our work <span>→</span></Link></div>
    </section>

    <section className={styles.programs} aria-labelledby="programs-heading">
      <div className={styles.programsHeading} data-reveal><p className={styles.sectionLabel}>03 — How change takes shape</p><h2 id="programs-heading">One shared purpose.<br />Many ways forward.</h2></div>
      <div className={styles.programGrid}>{PROGRAM_CARDS.map((program, index) => <Link href="/programs" className={styles.programCard} key={program.name} data-reveal><span className={styles.programNumber}>0{index + 1}</span><p>{program.tag}</p><h3>{program.name}</h3><span className={styles.programArrow}>↗</span></Link>)}</div>
    </section>

    <section className={styles.impact}>
      <div className={styles.impactImage} data-parallax="55"><Image src="/images/WhatsApp Image 2026-03-06 at 5.01.33 AM.jpeg" alt="PakSarZameen community programme" fill sizes="100vw" className={styles.coverImage} /></div><div className={styles.impactOverlay} />
      <div className={styles.impactContent}><p className={styles.eyebrowLight}>04 — Shared progress</p><h2 data-reveal>Care becomes<br />momentum.</h2><div className={styles.impactGrid}>{impact.map(([value, label]) => <div key={label} data-reveal><strong>{value}</strong><span>{label}</span></div>)}</div><Link href="/impact" className={styles.buttonLight}>See the impact <span>→</span></Link></div>
    </section>

    <section id="home-life" className={styles.people}>
      <div className={styles.peopleCopy} data-reveal><p className={styles.sectionLabel}>05 — Life at PSZ</p><h2>Change is a practice of showing up.</h2><p>Every initiative begins with people who choose to listen, lend time, share knowledge, and keep going. This is what community looks like in motion.</p><Link href="/volunteer" className={styles.inlineLink}>Meet the volunteer spirit <span>→</span></Link></div>
      <div className={styles.photoStack}>{HEART_MEMBERS.slice(0, 3).map((member, index) => <div key={member.image} className={styles.photo} data-parallax={index === 1 ? "-42" : index === 2 ? "34" : "0"}><Image src={member.image} alt="PakSarZameen community member" fill sizes="(max-width: 720px) 62vw, 26vw" className={styles.coverImage} /></div>)}</div>
    </section>

    <section className={styles.closing}><p className={styles.sectionLabel}>Make the next chapter possible</p><h2 data-reveal>Bring your care<br />into the story.</h2><p data-reveal>Whether you give time, skills, resources, or a partnership, there is a place for you in this work.</p><div className={styles.closingActions} data-reveal><Link href="/get-involved" className={styles.buttonDark}>Join the mission <span>→</span></Link><Link href="/contact" className={styles.inlineLink}>Start a conversation <span>↗</span></Link></div></section>
  </div>;
}
