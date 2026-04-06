import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { MAIN_SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

type PublicGalleryItem = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

async function getApprovedGallery(): Promise<PublicGalleryItem[]> {
  try {
    const response = await fetch(`${MAIN_SITE_URL}/api/gallery`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json().catch(() => null)) as
      | { images?: PublicGalleryItem[] }
      | null;

    return data?.images ?? [];
  } catch {
    return [];
  }
}

export default async function CustomersArtGalleryPage() {
  const images = await getApprovedGallery();

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
                Community Creations
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                Explore approved customer submissions. To contribute your own art,
                sign in with Google and upload from the protected creator portal.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`${MAIN_SITE_URL}/login?callbackUrl=/upload-art`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#2c3d31] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1f2d24]"
                >
                  Upload Your Art
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-[#2c3d31]/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2c3d31] transition-colors hover:border-[#2c3d31]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="mt-8">
              {images.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-3xl border border-[#e8ddd4] bg-white shadow-[0_14px_38px_rgba(26,20,15,0.06)]"
                    >
                      <div className="relative aspect-[4/3] w-full bg-[#f6f0eb]">
                        <Image
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.caption || "Customer artwork"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="space-y-2 p-4 text-left">
                        <p className="line-clamp-2 text-sm text-neutral-700">
                          {item.caption?.trim() || "Untitled artwork"}
                        </p>
                        <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          {item.user.name || "Anonymous Artist"}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#d9ccc2] bg-white/80 p-10 text-center">
                  <p className="text-sm text-neutral-600">
                    No approved artwork is live yet. Be the first to submit and inspire the next launch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
