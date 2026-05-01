import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { PoliciesFaqAccordion } from "@/features/commonwealth-lab/components/PoliciesFaqAccordion";

export const metadata: Metadata = {
  title: "Paksarzameen Store Policies & Terms",
  description:
    "Shipping policy, return policy, privacy policy, terms and FAQ for the Paksarzameen Store.",
  alternates: {
    canonical: "/policies",
  },
  openGraph: {
    title: "Paksarzameen Store Policies & Terms",
    description:
      "Shipping policy, return policy, privacy policy, terms and FAQ for the Paksarzameen Store.",
    url: `${siteConfig.siteUrl}/policies`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "Paksarzameen Store policies and terms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paksarzameen Store Policies & Terms",
    description:
      "Shipping policy, return policy, privacy policy, terms and FAQ for the Paksarzameen Store.",
    images: ["/images/hero-fallback.svg"],
  },
};

const FAQ_ITEMS = [
  {
    question: "How long does order processing take?",
    answer: "Orders are usually processed within 5-10 business days.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery times vary by location after dispatch.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can only be cancelled before processing or dispatch.",
  },
  {
    question: "Do you accept returns or refunds?",
    answer: "No. All sales are final after delivery.",
  },
  {
    question: "What if my item arrives damaged?",
    answer: "Report damage within 48 hours with photo or video proof.",
  },
  {
    question: "How can I contact support?",
    answer: "Use the contact details listed on the website.",
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
          Paksarzameen Store
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Paksarzameen Store Policies &amp; Terms
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-500">
          Clear terms for shipping, returns, privacy, and support.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Shipping Policy</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Order Processing</h3>
              <p>Orders are processed within 5-10 business days after confirmation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Shipping Time</h3>
              <p>Delivery times vary by location and logistics.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Shipping Charges</h3>
              <p>Shipping charges are shown at checkout.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Tracking</h3>
              <p>Tracking may be shared after dispatch.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Delivery Responsibility</h3>
              <p>Delays outside our control can affect delivery time.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Return &amp; Replacement Policy
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <p>
              <strong className="text-neutral-900">All sales are final.</strong>
            </p>
            <p>No returns or refunds are accepted after delivery.</p>
            <p>Replacement is only considered for delivery damage.</p>
            <div>
              <h3 className="font-semibold text-neutral-900">Conditions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Damage must be reported within 48 hours of delivery.</li>
                <li>Clear photo or video evidence must be provided.</li>
                <li>Product must remain unused and in original packaging.</li>
              </ul>
            </div>
            <p>If verified, a replacement may be arranged where possible.</p>
          </div>
        </section>

        <section
          id="terms-and-conditions"
          className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
        >
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Order Cancellation Policy
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <p>Orders can only be cancelled before processing or dispatch.</p>
            <p>Once processing or shipping starts, cancellation may not be possible.</p>
          </div>
        </section>

        <section
          id="privacy-policy"
          className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
        >
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Terms &amp; Conditions
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Acceptance of Terms</h3>
              <p>Using this store means you accept these terms.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Product Information</h3>
              <p>Product descriptions and images are shown as accurately as possible.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Pricing and Availability</h3>
              <p>Pricing and availability may change without notice.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Order Acceptance</h3>
              <p>The store may accept, reject, or cancel any order.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Intellectual Property</h3>
              <p>All logos, text, graphics, and images belong to Paksarzameen Store.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Limitation of Liability</h3>
              <p>The store is not responsible for delays beyond its control.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Policy Updates</h3>
              <p>Policies may change at any time after publication.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Privacy Policy</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-semibold text-neutral-900">Information Collection</h3>
              <p>Customer information may be collected during checkout or site use.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Use of Information</h3>
              <p>Information is used to process orders and improve service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Data Protection</h3>
              <p>Customer information is handled securely and not shared with unauthorized parties.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Cookies</h3>
              <p>The website may use cookies to improve browsing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">User Rights</h3>
              <p>Customers may contact the store with questions about their data.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Contact &amp; Support
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Use the contact details on this website for any order or policy question.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Frequently Asked Questions (FAQ)
          </h2>
          <div className="mt-5">
            <PoliciesFaqAccordion items={[...FAQ_ITEMS]} />
          </div>
        </section>
      </div>
    </main>
  );
}
