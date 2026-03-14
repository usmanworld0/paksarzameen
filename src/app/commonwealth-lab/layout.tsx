import type { Metadata } from "next";
import { CartProvider } from "@/features/commonwealth-lab/context/CartContext";

export const metadata: Metadata = {
  title: "Paksarzameen Store",
  description:
    "Discover ethically sourced, hand-crafted goods from regional artisans and micro-entrepreneurs. Every purchase builds community wealth.",
  openGraph: {
    title: "PSZ | Paksarzameen Store",
    description:
      "Discover ethically sourced, hand-crafted goods from regional artisans and micro-entrepreneurs.",
    type: "website",
  },
};

export default function PaksarzameenStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
