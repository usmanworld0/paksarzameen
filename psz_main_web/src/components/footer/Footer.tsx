import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-psz-forest/15 bg-gradient-to-b from-[#f2ece0] to-[#ece5d7]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <section aria-labelledby="footer-mission" className="space-y-3">
          <h2
            id="footer-mission"
            className="font-heading text-2xl font-semibold text-psz-forest"
          >
            PakSarZameen
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-psz-charcoal/85">
            Building community wealth through education, compassion, and
            grassroots progress.
          </p>
        </section>

        <section aria-labelledby="footer-contact" className="space-y-3">
          <h2 id="footer-contact" className="font-heading text-lg text-psz-forest">
            Contact
          </h2>
          <p className="text-sm text-psz-charcoal/80">info@psz.org</p>
          <p className="text-sm text-psz-charcoal/80">+92 300 0000000</p>
          <p className="text-sm text-psz-charcoal/80">Lahore, Pakistan</p>
          <div className="flex items-center gap-3 pt-1 text-sm">
            <Link href="#" className="text-psz-charcoal/80 hover:text-psz-forest">
              Instagram
            </Link>
            <Link href="#" className="text-psz-charcoal/80 hover:text-psz-forest">
              LinkedIn
            </Link>
            <Link href="#" className="text-psz-charcoal/80 hover:text-psz-forest">
              YouTube
            </Link>
          </div>
        </section>

        <section aria-labelledby="footer-newsletter" className="space-y-3">
          <h2
            id="footer-newsletter"
            className="font-heading text-lg text-psz-forest"
          >
            Newsletter
          </h2>
          <p className="text-sm text-psz-charcoal/80">
            Newsletter signup will be enabled in a future phase.
          </p>
          <div className="flex gap-2" role="group" aria-label="Newsletter placeholder">
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-psz-forest/20 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-psz-charcoal/45"
              disabled
            />
            <button
              type="button"
              className="rounded-lg bg-psz-forest px-4 py-2 text-sm font-semibold text-psz-cream"
              disabled
            >
              Join
            </button>
          </div>
        </section>
      </div>

      <div className="border-t border-psz-forest/10 px-4 py-4 text-center text-xs text-psz-charcoal/65">
        <p>{new Date().getFullYear()} PakSarZameen. All rights reserved.</p>
      </div>
    </footer>
  );
}
