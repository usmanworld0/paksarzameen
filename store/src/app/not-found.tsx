import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6] px-4 pt-[72px]">
        <div className="store-card rounded-[26px] px-8 py-10 text-center">
          <h1 className="mb-4 text-7xl leading-none text-[#2c3d31]">404</h1>
          <p className="mb-8 text-lg text-neutral-500">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="store-button-primary"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
