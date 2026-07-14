import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Education Counselling | Study Abroad & International Pathways",
    template: "%s | Education Counselling",
  },
  description: "Find your international academic path. Explore elite international universities, scholarship eligibility, tuition fees, entry requirements, and intakes.",
  icons: {
    icon: "/paksarzameen_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main-content" style={{ minHeight: "80vh" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
