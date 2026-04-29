import "./globals.css";
import type { PropsWithChildren } from "react";

import { Header } from "../components/Header";

export const metadata = {
  title: "Dog Adoption — PakSarZameen",
  description: "Adopt a stray dog — browse profiles and submit adoption requests.",
  openGraph: {
    title: "Dog Adoption — PakSarZameen",
    description: "Adopt a stray dog — browse profiles and submit adoption requests.",
    url: "https://dogs.paksarzameenwfo.com",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="dog-shell">
        <Header />

        <main>{children}</main>

        <footer>
          <div className="dog-container py-8 text-sm text-neutral-600">
            © {new Date().getFullYear()} PakSarZameen Dogs
          </div>
        </footer>
      </body>
    </html>
  );
}
