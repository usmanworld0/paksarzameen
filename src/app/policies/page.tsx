import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { PoliciesFaqAccordion } from "@/features/commonwealth-lab/components/PoliciesFaqAccordion";

export const metadata: Metadata = {
  title: "Commonwealth Store Policies & Terms",
  description:
    "Shipping policy, return policy, privacy policy, terms and FAQ for the Commonwealth store.",
  alternates: {
    canonical: "/policies",
  },
  openGraph: {
    title: "Commonwealth Store Policies & Terms",
    description:
      "Shipping policy, return policy, privacy policy, terms and FAQ for the Commonwealth store.",
    url: `${siteConfig.siteUrl}/policies`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "Commonwealth store policies and terms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commonwealth Store Policies & Terms",
    description:
      "Shipping policy, return policy, privacy policy, terms and FAQ for the Commonwealth store.",
    images: ["/images/hero-fallback.svg"],
  },
};

const FAQ_ITEMS = [
  {
    question: "How long does order processing take?",
    answer:
      "Orders are typically processed within 1–2 business days after confirmation.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time varies depending on location and logistical conditions. Most orders arrive within a few business days after dispatch.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders can only be cancelled before they are processed or dispatched.",
  },
  {
    question: "Do you accept returns or refunds?",
    answer:
      "All sales are final. Returns or refunds are not accepted after delivery.",
  },
  {
    question: "What if my item arrives damaged?",
    answer:
      "If your item arrives damaged, report the issue within 48 hours and provide photo or video evidence so the claim can be reviewed.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Customers can reach support using the contact details provided on the website.",
  },
] as const;

export default function PoliciesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="mx-auto w-full max-w-screen-xl px-[5%] py-28 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          Commonwealth
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Commonwealth Store Policies &amp; Terms
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-500">
          Please review our store policies carefully before placing an order.
          These terms are designed to ensure transparency, customer clarity, and
          a fair shopping experience.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Shipping Policy</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Order Processing</h3>
              <p>Orders are processed within 1–2 business days after confirmation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Shipping Time</h3>
              <p>Delivery times may vary depending on location and logistical conditions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Shipping Charges</h3>
              <p>Any applicable shipping charges are shown during checkout before the order is finalized.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Tracking</h3>
              <p>Tracking information may be provided once the order has been dispatched.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Delivery Responsibility</h3>
              <p>Delivery timelines may vary due to factors outside our control.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Return &amp; Replacement Policy</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <p><strong className="text-neutral-900">All sales are final.</strong></p>
            <p>Returns or refunds are not accepted once an order has been delivered and accepted.</p>
            <p>Replacement may be considered only if the item arrives damaged during delivery.</p>
            <div>
              <h3 className="font-semibold text-neutral-900">Conditions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Damage must be reported within 48 hours of delivery.</li>
                <li>Clear photo or video evidence must be provided.</li>
                <li>Product must remain unused and in original packaging.</li>
              </ul>
            </div>
            <p>If the claim is verified, a replacement may be arranged where possible.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Order Cancellation Policy</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <p>Orders may only be cancelled before they are processed or dispatched.</p>
            <p>Once an order enters processing or shipping stage, cancellation may not be possible.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Terms &amp; Conditions</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Acceptance of Terms</h3>
              <p>By using this store, customers agree to these policies and conditions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Product Information</h3>
              <p>Product descriptions and images are provided as accurately as possible.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Pricing and Availability</h3>
              <p>Product availability and pricing may change without prior notice.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Order Acceptance</h3>
              <p>The store reserves the right to accept, reject, or cancel any order.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Intellectual Property</h3>
              <p>All logos, graphics, images, text, and design elements belong to Commonwealth.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Limitation of Liability</h3>
              <p>The store is not responsible for delays or delivery issues caused by circumstances beyond its control.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Policy Updates</h3>
              <p>Policies may be updated at any time and will take effect immediately after publication.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Privacy Policy</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Information Collection</h3>
              <p>Customer information may be collected during checkout or when interacting with the website.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Use of Information</h3>
              <p>Information is used to process orders and improve services.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Data Protection</h3>
              <p>Customer information is handled securely and not shared with unauthorized parties.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Cookies</h3>
              <p>The website may use cookies to improve browsing experience.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">User Rights</h3>
              <p>Customers may contact the store regarding questions about their personal data.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Contact &amp; Support</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Customers can contact support using the contact information available on this website for any questions related to orders or policies.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Frequently Asked Questions (FAQ)</h2>
          <div className="mt-5">
            <PoliciesFaqAccordion items={[...FAQ_ITEMS]} />
          </div>
        </section>
      </div>
    </main>
  );
}
