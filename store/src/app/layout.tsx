import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  COMMONWEALTH_LOGO_URL,
} from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: COMMONWEALTH_LOGO_URL, type: "image/png" },
    ],
    apple: [{ url: COMMONWEALTH_LOGO_URL, type: "image/png" }],
    shortcut: [{ url: COMMONWEALTH_LOGO_URL, type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: COMMONWEALTH_LOGO_URL,
        width: 512,
        height: 512,
        alt: "Paksarzameen Store logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [COMMONWEALTH_LOGO_URL],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
