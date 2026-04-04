import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export const dynamic = "force-dynamic";

export default function CustomersArtGalleryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fffaf6]">
          <div className="store-container max-w-[1100px]">
            <div className="rounded-3xl border border-[#e8ddd4] bg-white/90 p-8 text-center shadow-[0_14px_38px_rgba(26,20,15,0.06)] sm:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                Customer's Art Gallery
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-neutral-900 sm:text-5xl">
                Community Creations, Coming Soon
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                We are building a dedicated gallery where customers can showcase designs they created,
                share collaborations, and inspire upcoming limited-edition launches.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#2c3d31] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1f2d24]"
                >
                  Join as Early Contributor
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-[#2c3d31]/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2c3d31] transition-colors hover:border-[#2c3d31]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
