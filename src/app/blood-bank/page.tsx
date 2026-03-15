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
      <div style={heroStyle}>
        <p style={eyebrowStyle}>24/7 Response Desk</p>
        <h1 style={titleStyle}>PakSarZameen Blood Bank</h1>
        <p style={subtitleStyle}>
          Emergency contacts: Umar Hafeez: 03098237670, Ahmed Amir: 03233609157
        </p>
        <p style={subcopyStyle}>
          For immediate support call directly, and also submit the form below so your request is tracked in backend with status updates.
        </p>
        <div style={linksRowStyle}>
          <a href="tel:03098237670" style={phonePillStyle}>Call Umar Hafeez</a>
          <a href="tel:03233609157" style={phonePillStyle}>Call Ahmed Amir</a>
          <Link href="/contact" style={phonePillStyle}>Contact Page</Link>
        </div>
      </div>

      <BloodBankRequestForm />
    </section>
  );
}

const sectionStyle: CSSProperties = {
  minHeight: "100vh",
  paddingTop: "12rem",
  paddingBottom: "5rem",
  background:
    "radial-gradient(circle at 15% 10%, rgba(207,44,44,0.25), transparent 45%), radial-gradient(circle at 80% 20%, rgba(15,122,71,0.2), transparent 48%), #080f0b",
  color: "#ffffff",
};

const heroStyle: CSSProperties = {
  width: "min(980px, 92vw)",
  margin: "0 auto 2.2rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.1rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#ffffff",
};

const titleStyle: CSSProperties = {
  marginTop: "0.8rem",
  marginBottom: "0.75rem",
  fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
  lineHeight: 1.05,
  color: "#ffffff",
};

const subtitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "0.75rem",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1.6rem",
};

const subcopyStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "1.3rem",
  color: "#ffffff",
  fontSize: "1.4rem",
};

const linksRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const phonePillStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.08)",
  padding: "0.62rem 1rem",
  fontSize: "1.2rem",
  fontWeight: 600,
  color: "#fff",
};
