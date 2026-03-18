"use client";
import Link from "next/link";
import styles from "../environmental/gwr/Gwr.module.css";
import InstagramEmbed from "../../../components/InstagramEmbed";

export default function HealthImpactPage() {
  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className="lead">
            <h1>Community Health Impact</h1>
            <p style={{color:'#3d6a5b',lineHeight:1.6}}>Health initiatives providing camps, blood availability, and mobile clinics.</p>
            <div style={{marginTop:12}}>
              <Link href="/blood-bank" className={styles.cta}>Open Blood Bank</Link>
            </div>
          </div>

        <section className={styles.sectionBox}>
          <h3>Blood Donation Drive for India-Pakistan Conflict Victims</h3>
          <p>
            In the spirit of this divine message, PakSarZameen organized a heartfelt Blood Donation Drive at Bahawalpur Victoria Hospital for the victims of the India-Pakistan conflict. With courage in our hearts and compassion in our actions, our volunteers and donors came forward to serve those who have suffered in silence.
          </p>
          <p>
            This drive wasn’t just about donating blood—it was about standing for peace, honoring the lives impacted by war, and showing that true patriotism is rooted in mercy and humanity.
          </p>
          <p>
            From Bahawalpur to the borders beyond, may this small act become a symbol of unity, hope, and the healing power of community.
          </p>
          <div style={{marginTop:16}}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DKFn43YyK0g/" />
          </div>
        </section>
          <div className={styles.asideCard}>
            <strong>Highlights</strong>
            <ul className={styles.metaList}>
              <li>24/7 Blood Availability</li>
              <li>Monthly Free Medical/Blood Camps</li>
            </ul>
          </div>
        </header>

        <section className={styles.sectionBox}>
          <h3>24/7 Availability of Blood</h3>
          <p>Ongoing efforts to maintain reliable blood supply for patients in need.</p>
        </section>

        <section className={styles.sectionBox}>
          <h3>Monthly Free Medical/Blood Camps</h3>
          <p>Regular outreach clinics delivering screenings and basic healthcare.</p>
          <div style={{marginTop:16}}>
            <strong>Recent Camp Highlight</strong>
            <p style={{marginTop:8}}>
              PakSarZameen proudly organized their second free primary care medical camp at the Rural Settlement Aka Kachi Basti, Bahawalpur, where we were privileged to serve 150 patients and provide them with essential medical supplies. Salute to Syeda Muneeba Zainab, Ahmed Qureshi, Aleena Fatima, Tayyaba Amjad, Hina Azeem, Iqra Ijaz, Fiza Batool, Jaweria Tariq, Syeda Rida Fatima, Umer Hafeez, Syed Hadi, Tuba Fatima, Ali Ajwad, and Malik Abdullah Amir for their unwavering support and dedication to this cause. Your contributions truly made a difference! We also extend our sincere gratitude to Project Tibi Indad for their consistent efforts in organizing two medical camps each month. Together, we are creating positive change in the community.
            </p>
            <p style={{marginTop:8, fontFamily:'Noto Nastaliq Urdu', fontSize:'1.1em'}}>
              پاکستان سرزمین نے بہاولپور کے دیہی علاقے آکا کچی بستی میں ایک مفت بنیادی طبی کیمپ کا انعقاد کیا، جہاں ہمیں 150 مریضوں کی خدمت کرنے اور انہیں ضروری طبی سامان فراہم کرنے کا اعزاز حاصل ہوا۔ اس موقع پر، ہم سیدہ منیبہ زینب، احمد قریشی، علینہ فاطمہ، طیبا امجد، ہنہ عظیم، اقرا اعجاز، فضا بتول، جاویریہ طارق، سیدہ ریدہ فاطمہ، عمر حفیظ، سید ہادی، طوبی فاطمہ، علی اجواد، کا دل کی گہرائیوں سے شکریہ ادا کرتے ہیں جنہوں نے اس مقصد کے لیے اپنی مکمل حمایت اور محنت فراہم کی۔ آپ کی کوششوں نے واقعی فرق ڈالا! ہم پروجیکٹ تیبی امداد کا بھی شکریہ ادا کرتے ہیں جو ہر مہینے دو طبی کیمپ منعقد کرنے کے لیے مسلسل کوشاں ہیں۔ مل کر، ہم کمیونٹی میں مثبت تبدیلی لا رہے ہیں۔
            </p>
            <div style={{marginTop:16}}>
              <InstagramEmbed permalink="https://www.instagram.com/reel/DJEWGY8NjQs/" />
            </div>
            <div style={{marginTop:16}}>
              <p style={{color:'#fff', fontSize:'1.1rem', marginBottom: 12}}>
                Schools, colleges, and universities are the main sources of blood collection for the Blood Bank. Since summer vacations blood banks are having a shortage of blood for emergency patients. Therefore, PakSarZameen conducted a blood donation drive on 14th August 2022 for thalassemia and emergency patients. Our prime objective to conduct such a drive on the day of independence was to promote a message of healthy and philanthropic activity to the youth.<br/>
                We are thankful to all the donors who cooperated and showed up!
              </p>
              <InstagramEmbed permalink="https://www.instagram.com/p/ChW3ooxICQU/" />
            </div>
          </div>
        </section>

        <section className={styles.sectionBox}>
          <h3>Data Assessment & Research</h3>
          <p>Tracking health outcomes and program impact for continuous improvement.</p>
        </section>

      </div>
    </main>
  );
}
