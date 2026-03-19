"use client";
import Image from "next/image";
import Link from "next/link";
import InstagramEmbed from "./gwr/../../../../components/InstagramEmbed";
import styles from "./gwr/Gwr.module.css";

const GWR_IMAGES = [
  "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.27.29 AM.jpeg",
  "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.27.04 AM.jpeg",
  "/images/impact/GWR/WhatsApp Image 2026-03-18 at 3.26.46 AM.jpeg",
];

export default function EnvironmentalImpactPage() {
  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className="lead">
            <h1>Environmental Impact</h1>
            <p style={{color:'#3d6a5b',lineHeight:1.6}}>Practical, community-led environmental projects focused on tree-planting, urban greening, and youth climate action.</p>
            <div style={{marginTop:12}}>
              <Link href="/get-involved" className={styles.cta}>Get involved</Link>
            </div>
          </div>
          <div className={styles.asideCard}>
            <strong>Highlights</strong>
            <ul className={styles.metaList}>
              <li>Large-scale tree planting</li>
              <li>Community forestry</li>
              <li>Youth climate events</li>
            </ul>
          </div>
        </header>

        <section className={styles.sectionBox} aria-labelledby="gwr-title">
          <h2 id="gwr-title">GWR — Largest Sapling Word</h2>
          <p>The Guinness World Record for the largest sapling word, delivered through volunteers, nurseries and careful coordination.</p>
          <div className={styles.gallery}>
            {GWR_IMAGES.map((src) => (
              <div key={src} className={styles.thumb}>
                <Image src={src} alt="GWR" width={800} height={600} style={{objectFit:'cover',width:'auto',height:'auto'}} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Featured Reel</h3>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/DB4Y2KzNv6Z/" />
          </div>
        </section>

        <section className={styles.sectionBox} aria-labelledby="miawuaki-title">
          <h3 id="miawuaki-title">Miawuaki Forest</h3>
          <p>Short summary about the Miyawaki-style forest initiative and community nurseries.</p>
        </section>

        <section className={styles.sectionBox} aria-labelledby="southpunjab-title">
          <h3 id="southpunjab-title">South Punjab Green Book Initiative</h3>
          <p>Brief about the South Punjab Green Book Initiative and its outcomes.</p>
        </section>

        <section className={styles.sectionBox} aria-labelledby="lcoy-title">
          <h3 id="lcoy-title">LCOY</h3>
          <p>
            Pak Sarzameen, in collaboration with The Islamia University of Bahawalpur (IUB) and YOUNGO-UNFCCC, hosted the Local Conference of Youth (LCOY) Pakistan-Wasaib+ in Bahawalpur in September 2024. The event focused on climate change, youth empowerment, and sustainability, featuring panel discussions, workshops, and youth-led initiatives, with participation from local schools, colleges, and university students.
          </p>
          <ul style={{margin:'8px 0 12px 18px',color:'#233b31',fontSize:'1rem'}}>
            <li><b>Organizer & Collaborators:</b> Organized by Pak Sarzameen and IUB, affiliated with the official youth constituency of the UNFCCC.</li>
            <li><b>Core Themes:</b> Youth engagement in climate action, policy-making, capacity building, and sustainable development.</li>
            <li><b>Event Activities:</b> Included expert sessions, exhibitions (eco-business stalls), and discussions focusing on environmental challenges and solutions.</li>
            <li><b>Participants:</b> Included youth leaders, students (e.g., from Army Public School), and climate activists.</li>
            <li><b>Purpose:</b> To produce a National Youth Statement regarding climate change and to feed local initiatives into the global COP29 process.</li>
            <li><b>2024 Focus:</b> Strengthening youth voices in policy, with events heavily featuring women and community-led discussions.</li>
          </ul>
          <p>
            <a href="https://ccsc.iub.edu.pk/local-conference-on-youth-in-climate-change-youth-empowerment" target="_blank" rel="noopener noreferrer" style={{color:'#0f7a47',fontWeight:700}}>
              Learn more about the Local Conference on Youth in Climate Change & Youth Empowerment
            </a>
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DAGTq_-Im0U/" />
          </div>
        </section>

        <section className={styles.sectionBox} aria-labelledby="cop-title">
          <h3 id="cop-title">COP in My City</h3>
          <p>
            &quot;COP in My City&quot; Pakistan is a major youth-led climate action initiative, often organized in collaboration with UNICEF Pakistan, the Ministry of Climate Change, and various universities, aimed at empowering youth aged 12-24 to participate in climate advocacy.
          </p>
          <ul style={{margin:'8px 0 12px 18px',color:'#233b31',fontSize:'1rem'}}>
            <li><b>Collaboration:</b> UNICEF Pakistan, Ministry of Climate Change, universities.</li>
            <li><b>Focus:</b> Youth empowerment, climate advocacy, ages 12-24.</li>
            <li><b>Recent Achievement:</b> Team PakSarZameen won the Regional COP in our city, a prestigious initiative by the Ministry of Climate Change and Environmental Coordination of Pakistan.</li>
            <li><b>Impact:</b> Showcased dedication, youth leadership, and sustainable change. Members like Hassan Fadul, Tuba Fatima, Muhammad Sufyan Khan, and Aaila Khan demonstrated commitment to environmental stewardship.</li>
            <li><b>Event:</b> COP in My City hosted at Serena Hotel Islamabad, with active participation from PakSarZameen members.</li>
            <li><b>Purpose:</b> Paving a promising path for youth advocacy and environmental stewardship in Pakistan.</li>
          </ul>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/C9HEF_GtRun/" />
          </div>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/CyNPZH5Ot2B/" />
          </div>
        </section>

        <section className={styles.sectionBox} aria-labelledby="data-title">
          <h3 id="data-title">Data Assessment & Research</h3>
          <p>Research and impact assessment driving program improvements.</p>
        </section>

      </div>
    </main>
  );
}
