"use client";
import Link from "next/link";
import InstagramEmbed from "../../../components/InstagramEmbed";
import styles from "../environmental/gwr/Gwr.module.css";

export default function AnimalImpactPage() {
  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className="lead">
            <h1>Animal Welfare Impact</h1>
            <p style={{color:'#3d6a5b',lineHeight:1.6}}>Projects focused on humane treatment, feeding points, and stray animal care.</p>
            <div style={{marginTop:12}}>
              <Link href="/get-involved" className={styles.cta}>Volunteer</Link>
            </div>
          </div>
          <div className={styles.asideCard}>
            <strong>Highlights</strong>
            <ul className={styles.metaList}>
              <li>Cat Feeding Points</li>
              <li>Stray Dog Collar Project</li>
            </ul>
          </div>
        </header>


        <section className={styles.sectionBox}>
          <h3>Cat Feeding Points</h3>
          <p>Community-run feeding points for stray and feral cats.</p>
          <p style={{marginTop:8}}>
            In Jan 2023, PakSarZameen installed 2 cat feeding points at Hashmi Garden and Milad Chowk, Gulzar e Sadiq.
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/CoAUaTloqXC/" />
          </div>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/DArKbDjx_Ds/" />
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Stray Dog Collar Project</h3>
          <p>
            The Stray Dog Collar Project in Pakistan, specifically highlighted in the &quot;Rabies Free Pakistan&quot; initiative, uses green collars to identify vaccinated stray dogs, promoting a humane approach to managing stray dog populations and preventing rabies transmission.
          </p>
          <p style={{marginTop:12}}>
            PakSarZameen is thrilled to introduce a heartfelt new initiative dedicated to the protection of stray dogs. 🐕 Through this project, GPS collars will be placed on stray dogs, enabling real-time tracking via our official app. Our team will be actively monitoring their movements to ensure their safety and well-being. Join us in this compassionate mission, as we extend our care beyond humans to these vulnerable animals. Together, we can create a kinder, safer world for all living beings. 🌍💙
          </p>
        </section>

        <section className={styles.sectionBox}>
          <h3>Free Animal Care Medical Camp</h3>
          <p>
            Our mission is to promote animal health, raise awareness about proper animal care, and extend compassionate support to underserved areas.<br/>
            Together, we can build a more humane and sustainable future for all living beings.
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/DJNSdzLNALU/" />
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Data Assessment & Research</h3>
          <p>Monitoring welfare outcomes and program reach.</p>
        </section>

      </div>
    </main>
  );
}
