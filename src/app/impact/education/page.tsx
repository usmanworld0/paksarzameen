"use client";
import Link from "next/link";
import styles from "../environmental/gwr/Gwr.module.css";
import InstagramEmbed from "../../../components/InstagramEmbed";

export default function EducationImpactPage() {
  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className="lead">
            <h1>Educational Empowerment Impact</h1>
            <p style={{color:'#3d6a5b',lineHeight:1.6}}>Programs that expand access to learning, inclusion, and vocational support.</p>
            <div style={{marginTop:12}}>
              <Link href="/programs" className={styles.cta}>Explore Programs</Link>
            </div>
          </div>
          <div className={styles.asideCard}>
            <strong>Highlights</strong>
            <ul className={styles.metaList}>
              <li>Transgender School</li>
              <li>Blind Parliamentary Debating Team</li>
            </ul>
          </div>
        </header>


        <section className={styles.sectionBox}>
          <h3>Pakistan's Only Transgender School</h3>
          <p>Inclusive education initiatives and safe learning spaces.</p>
          <div style={{marginTop:16}}>
            <strong>FORMUN XI Delegation Achievement</strong>
            <p style={{marginTop:8}}>
              Paksarzameen keeps up its tradition of breaking the shackles of disparity in our nation. A prodigious delegation of students from the transgender school of Bahawalpur was coached by Paksarzameen's Abdullah Tanseer, and Hamza Gohar, to attend the most prestigious FORMUN XI at The Forman Christian College and Chartered University. We are honored to announce that these delegates showed the highest level of diplomatic and debating skills, and were awarded with SM and HM awards by Rector Forman College and Chartered University himself.<br/>
              Another feat checked, Paksarzameen is not stopping!
            </p>
            <div style={{marginTop:16}}>
              <InstagramEmbed permalink="https://www.instagram.com/reel/CokxZZHIUxA/" />
            </div>
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Pakistan's First Blind Parliamentary Debating Team</h3>
          <p>Accessible debate and public speaking for blind youth.</p>
        </section>


        <section className={styles.sectionBox}>
          <h3>Community Service Camp: Sadiq Public School Girls Branch</h3>
          <p>
            Paksarzameen organized a community service camp at Sadiq Public School Girls Branch, where members engaged with students to discuss opportunities and ideas for creating a positive impact in Bahawalpur. The conversation focused on key areas including education, health, the environment, animal care, and promoting human dignity.
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DC_LgCcub1D/" />
          </div>
        </section>


        <section className={styles.sectionBox}>
          <h3>Special Law Moot Court Delegation</h3>
          <p>
            PakSarZameen has once again shattered the shackles of social disparity in Pakistan by founding the nation’s first special delegation for a Law Moot Court! This groundbreaking delegation comprised of blind, deaf, mentally, and physically disabled students not only participated excitedly at the Sadiq Moot Court but also won 9 awards, including the prestigious Best Delegate for Pakistan National Assembly, and a cash prize of Rs. 85,000/-. 🌟🎉 #Inclusion #BreakingBarriers #PakSarZameen #SadiqMootCourt
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/C9LHKnbRq9c/" />
          </div>
        </section>


        <section className={styles.sectionBox}>
          <h3>Proud Achievements at Beaconhouse MUN</h3>
          <p>
            The PakSarZameen debating team, featuring transgender individuals and special children, proudly represented at the Model United Nations Conference held at Beaconhouse School System Bahawalpur. They achieved remarkable success, securing 2 Best Delegate Awards, 2 Honourable Mentions, and 1 Special Mention!
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DFtix51NWOV/" />
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Career Counselling & University Applications</h3>
          <p>Guidance services to improve higher education access.</p>
        </section>


        <section className={styles.sectionBox}>
          <h3>MoU with The Islamia University of Bahawalpur</h3>
          <p>
            PakSarZameen has officially signed a Memorandum of Understanding with The Islamia University of Bahawalpur to strengthen collaboration and promote initiatives in education, research, and community development. The partnership aims to create opportunities for knowledge sharing, joint projects, and social welfare programs that benefit students and the wider community.
          </p>
          <p style={{marginTop:8, fontFamily:'Noto Nastaliq Urdu', fontSize:'1.1em'}}>
            پاک سرزمین نے جامعہ اسلامیہ بہاولپور کے ساتھ باہمی تعاون اور تعلیم، تحقیق اور سماجی ترقی کے شعبوں میں اقدامات کو فروغ دینے کے لیے مفاہمت کی یادداشت پر دستخط کیے۔ اس شراکت داری کا مقصد علم کے تبادلے، مشترکہ منصوبوں اور طلبہ اور وسیع کمیونٹی کے لیے فلاحی پروگراموں کے مواقع پیدا کرنا ہے۔
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DS-InPYjZZL/" />
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Enrollment Rate & Data Assessment</h3>
          <p>Tracking enrollment and education outcomes.</p>
        </section>

      </div>
    </main>
  );
}
