import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Paksarzameen Store",
  description:
    "Browse our full collection of ethically sourced artisan products — traditional clothing, handicrafts, cultural goods, and PSZ merchandise.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
