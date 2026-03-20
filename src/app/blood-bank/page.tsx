import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BloodBankRequestForm } from "@/features/blood-bank/components/BloodBankRequestForm";

export const metadata: Metadata = {
  title: "Blood Bank Emergency Requests",
  description:
    "Submit emergency blood requests with status tracking by PakSarZameen Blood Bank team.",
  alternates: {
    canonical: "/blood-bank",
  },
};

export default function BloodBankPage() {
  return (
    <section style={sectionStyle}>
      <div style={pageShellStyle} className="blood-bank-shell">
        <div style={heroStyle} className="blood-bank-hero">
          <p style={eyebrowStyle}>Emergency Response Desk - 24/7</p>
          <h1 style={titleStyle}>Need Blood Immediately? Call Now.</h1>
          <p style={subtitleStyle}>
            Do not wait for form processing. Our phone lines are the fastest way to dispatch support.
          </p>

          <div style={numbersGridStyle}>
            <a href="tel:03098237670" style={numberCardStyle}>
              <span style={numberLabelStyle}>Emergency Coordinator</span>
              <span style={numberNameStyle}>Umar Hafeez</span>
              <span style={numberValueStyle}>0309 8237670</span>
              <span style={numberActionStyle}>Tap to call now</span>
            </a>

            <a href="tel:03233609157" style={numberCardStyle}>
              <span style={numberLabelStyle}>Emergency Coordinator</span>
              <span style={numberNameStyle}>Ahmed Amir</span>
              <span style={numberValueStyle}>0323 3609157</span>
              <span style={numberActionStyle}>Tap to call now</span>
            </a>
          </div>

          <div style={alertRowStyle}>
            <p style={alertTextStyle}>Critical sequence: Call first. Form second for tracking.</p>
            <Link href="/contact" style={contactLinkStyle}>Open contact page</Link>
          </div>
        </div>

        {/* Instagram embed moved to Community Health Impact page */}

        <div style={formWrapStyle} className="blood-bank-form">
          <p style={formIntroStyle}>
            After calling, submit this form so our team can track hospital, blood group, and status updates.
          </p>
          <BloodBankRequestForm />
        </div>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  minHeight: "100vh",
  paddingTop: "clamp(8.5rem, 14vw, 11rem)",
  paddingBottom: "5rem",
  paddingInline: "1rem",
  background:
    "radial-gradient(circle at 18% 6%, rgba(225, 45, 45, 0.42), transparent 42%), radial-gradient(circle at 78% 8%, rgba(178, 20, 20, 0.35), transparent 38%), linear-gradient(180deg, #120707 0%, #070c09 55%, #060b08 100%)",
  color: "#ffffff",
};

const pageShellStyle: CSSProperties = {
  width: "min(1100px, 100%)",
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  marginBottom: "2.2rem",
  padding: "clamp(1.5rem, 4vw, 2.8rem)",
  border: "1px solid rgba(255, 80, 80, 0.28)",
  borderRadius: "2rem",
  background:
    "linear-gradient(150deg, rgba(140, 18, 18, 0.42) 0%, rgba(22, 7, 7, 0.84) 52%, rgba(8, 14, 10, 0.88) 100%)",
  boxShadow: "0 30px 90px rgba(0, 0, 0, 0.52)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1rem, 2.3vw, 1.2rem)",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#ffd5d5",
  fontWeight: 700,
};

const titleStyle: CSSProperties = {
  marginTop: "0.85rem",
  marginBottom: "0.95rem",
  fontSize: "clamp(3.2rem, 7.2vw, 5.5rem)",
  lineHeight: 1.05,
  color: "#ffffff",
  maxWidth: "18ch",
};

const subtitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "1.6rem",
  color: "rgba(255, 245, 245, 0.94)",
  fontWeight: 600,
  fontSize: "clamp(1.2rem, 3vw, 1.95rem)",
  maxWidth: "64ch",
};

const numbersGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: "1rem",
};

const numberCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.45rem",
  minWidth: 0,
  borderRadius: "1.4rem",
  border: "1px solid rgba(255, 120, 120, 0.32)",
  background: "linear-gradient(160deg, rgba(255, 76, 76, 0.16), rgba(10, 14, 11, 0.78))",
  padding: "1.1rem 1.15rem 1.2rem",
  color: "#fff",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
};

const numberLabelStyle: CSSProperties = {
  fontSize: "1.1rem",
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  color: "#ffdede",
};

const numberNameStyle: CSSProperties = {
  fontSize: "1.7rem",
  fontWeight: 700,
};

const numberValueStyle: CSSProperties = {
  fontSize: "clamp(1.85rem, 8vw, 3.4rem)",
  lineHeight: 1.05,
  fontWeight: 800,
  letterSpacing: "0.03em",
  color: "#ffffff",
  overflowWrap: "anywhere",
};

const numberActionStyle: CSSProperties = {
  marginTop: "0.35rem",
  fontSize: "clamp(1.05rem, 2.4vw, 1.3rem)",
  color: "#ffe7e7",
};

const alertRowStyle: CSSProperties = {
  marginTop: "1.25rem",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.8rem",
};

const alertTextStyle: CSSProperties = {
  margin: 0,
  borderRadius: "999px",
  padding: "0.64rem 1rem",
  fontWeight: 700,
  fontSize: "clamp(1rem, 2.3vw, 1.2rem)",
  color: "#fff0f0",
  border: "1px solid rgba(255, 148, 148, 0.35)",
  background: "rgba(158, 24, 24, 0.35)",
};

const contactLinkStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.26)",
  background: "rgba(255,255,255,0.1)",
  padding: "0.62rem 0.98rem",
  fontSize: "clamp(1rem, 2.3vw, 1.2rem)",
  fontWeight: 600,
  color: "#fff",
};

const formWrapStyle: CSSProperties = {
  display: "grid",
  gap: "0.9rem",
};

const formIntroStyle: CSSProperties = {
  width: "min(920px, 100%)",
  margin: "0 auto",
  color: "rgba(255,255,255,0.86)",
  fontSize: "clamp(1.05rem, 2.6vw, 1.35rem)",
  lineHeight: 1.5,
};
