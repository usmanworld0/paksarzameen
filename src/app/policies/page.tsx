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
    answer:
      "Orders are typically processed within 5–10 business days after confirmation.",
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
    <div className="bg-[#f3f3ee]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
            Paksarzameen Store
          </p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Policies &amp; Terms
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Please review our store policies carefully before placing an order.
            These terms are designed to ensure transparency, customer clarity,
            and a fair shopping experience.
          </p>
        </div>
      </header>

      <main className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl space-y-5">
          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Shipping
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Shipping Policy
            </h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-[#707072]">
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Order Processing</h3>
                <p className="mt-1">Orders are processed within 5–10 business days after confirmation.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Shipping Time</h3>
                <p className="mt-1">Delivery times may vary depending on location and logistical conditions.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Shipping Charges</h3>
                <p className="mt-1">Any applicable shipping charges are shown during checkout before the order is finalized.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Tracking</h3>
                <p className="mt-1">Tracking information may be provided once the order has been dispatched.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Delivery Responsibility</h3>
                <p className="mt-1">Delivery timelines may vary due to factors outside our control.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Returns
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Return &amp; Replacement Policy
            </h2>
            <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-[#707072]">
              <p><span className="font-black text-[#111111]">All sales are final.</span></p>
              <p>Returns or refunds are not accepted once an order has been delivered and accepted.</p>
              <p>Replacement may be considered only if the item arrives damaged during delivery.</p>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Conditions</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Damage must be reported within 48 hours of delivery.</li>
                  <li>Clear photo or video evidence must be provided.</li>
                  <li>Product must remain unused and in original packaging.</li>
                </ul>
              </div>
              <p>If the claim is verified, a replacement may be arranged where possible.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Cancellations
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Order Cancellation Policy
            </h2>
            <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-[#707072]">
              <p>Orders may only be cancelled before they are processed or dispatched.</p>
              <p>Once an order enters processing or shipping stage, cancellation may not be possible.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Legal
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Terms &amp; Conditions
            </h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-[#707072]">
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Acceptance of Terms</h3>
                <p className="mt-1">By using this store, customers agree to these policies and conditions.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Product Information</h3>
                <p className="mt-1">Product descriptions and images are provided as accurately as possible.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Pricing and Availability</h3>
                <p className="mt-1">Product availability and pricing may change without prior notice.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Order Acceptance</h3>
                <p className="mt-1">The store reserves the right to accept, reject, or cancel any order.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Intellectual Property</h3>
                <p className="mt-1">All logos, graphics, images, text, and design elements belong to Paksarzameen Store.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Limitation of Liability</h3>
                <p className="mt-1">The store is not responsible for delays or delivery issues caused by circumstances beyond its control.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Policy Updates</h3>
                <p className="mt-1">Policies may be updated at any time and will take effect immediately after publication.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Privacy
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Privacy Policy
            </h2>
            <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-[#707072]">
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Information Collection</h3>
                <p className="mt-1">Customer information may be collected during checkout or when interacting with the website.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Use of Information</h3>
                <p className="mt-1">Information is used to process orders and improve services.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Data Protection</h3>
                <p className="mt-1">Customer information is handled securely and not shared with unauthorized parties.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">Cookies</h3>
                <p className="mt-1">The website may use cookies to improve browsing experience.</p>
              </div>
              <div>
                <h3 className="font-black tracking-tighter text-[#111111]">User Rights</h3>
                <p className="mt-1">Customers may contact the store regarding questions about their personal data.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              Support
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Contact &amp; Support
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
              Customers can contact support using the contact information available on this website for any questions related to orders or policies.
            </p>
          </section>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              FAQ
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
              Frequently Asked Questions
            </h2>
            <div className="mt-5">
              <PoliciesFaqAccordion items={[...FAQ_ITEMS]} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
