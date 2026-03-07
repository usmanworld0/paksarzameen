import type { Metadata } from "next";
import { CartProvider } from "@/features/commonwealth-lab/context/CartContext";

export const metadata: Metadata = {
  title: "Commonwealth Lab Marketplace",
  description:
    "Discover ethically sourced, hand-crafted goods from regional artisans and micro-entrepreneurs. Every purchase builds community wealth.",
  openGraph: {
    title: "Commonwealth Lab Marketplace | PakSarZameen",
    description:
      "Discover ethically sourced, hand-crafted goods from regional artisans and micro-entrepreneurs.",
    type: "website",
  },
};

export default function CommonwealthLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
