import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-brand-green mb-4">404</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-brand-green text-white rounded-sm hover:bg-brand-green/90 transition-colors text-sm"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
