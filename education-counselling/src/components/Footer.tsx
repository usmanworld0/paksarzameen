import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/6 bg-white text-neutral-800">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(181,159,130,0.1),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(17,17,17,0.04),transparent_24%)]" />
      <div className="store-container relative py-16 sm:py-20">
        
        {/* Mobile Accordion */}
        <div className="md:hidden">
          <div className="pb-7 text-center">
            <h3 className="text-[1.6rem] font-normal leading-none tracking-[0.06em] text-neutral-950">
              PAKSARZAMEEN COUNSELLING
            </h3>
          </div>

          <div className="border-y border-black/10">
            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Admissions &amp; Universities
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>
                  <Link href="/universities" className="transition-colors duration-300 hover:text-neutral-950">
                    All Universities
                  </Link>
                </li>
                <li>
                  <Link href="/counselling#undergrad" className="transition-colors duration-300 hover:text-neutral-950">
                    Undergraduate Pathways
                  </Link>
                </li>
                <li>
                  <Link href="/counselling#graduate" className="transition-colors duration-300 hover:text-neutral-950">
                    Graduate &amp; PhD Mentorship
                  </Link>
                </li>
                <li>
                  <Link href="/scholarships" className="transition-colors duration-300 hover:text-neutral-950">
                    Global Scholarships
                  </Link>
                </li>
              </ul>
            </details>

            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Test Preparation
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>
                  <Link href="/tutoring#ielts" className="transition-colors duration-300 hover:text-neutral-950">
                    IELTS Academic Prep
                  </Link>
                </li>
                <li>
                  <Link href="/tutoring#oet" className="transition-colors duration-300 hover:text-neutral-950">
                    OET Clinical Language
                  </Link>
                </li>
                <li>
                  <Link href="/tutoring#sat" className="transition-colors duration-300 hover:text-neutral-950">
                    Digital SAT Program
                  </Link>
                </li>
              </ul>
            </details>

            <details className="last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Contact &amp; Support
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>counselling@paksarzameenwfo.com</li>
                <li>+92 300 1234567</li>
                <li>Model Town B, Bahawalpur, Punjab, Pakistan</li>
                <li>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950 font-medium text-emerald-700"
                  >
                    WhatsApp Advisory Desk &rarr;
                  </a>
                </li>
              </ul>
            </details>
          </div>
        </div>

        {/* Desktop 4-Column Grid */}
        <div className="hidden grid-cols-1 gap-10 md:grid lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <p className="store-kicker">PakSarZameen Global Academic Initiative</p>
            <h3 className="mt-3 text-[1.85rem] font-normal leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-[2.1rem]">
              Education Counselling
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
              An elevated academic advisory platform shaped around merit, transparent qualification matching, and ethical admissions pathways worldwide.
            </p>
            <p className="mt-6 text-[10px] font-normal uppercase tracking-[0.22em] text-neutral-500">
              Zero commission bias &bull; 100% Student-first
            </p>
          </div>

          <nav aria-label="Admissions links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Admissions
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/universities" className="transition-colors duration-300 hover:text-neutral-950">
                  Featured Universities
                </Link>
              </li>
              <li>
                <Link href="/counselling#undergrad" className="transition-colors duration-300 hover:text-neutral-950">
                  Undergraduate Degrees
                </Link>
              </li>
              <li>
                <Link href="/counselling#graduate" className="transition-colors duration-300 hover:text-neutral-950">
                  Graduate &amp; PhD Lab Match
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="transition-colors duration-300 hover:text-neutral-950">
                  Scholarships &amp; Aid
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Preparation links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Test Tutoring
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/tutoring#ielts" className="transition-colors duration-300 hover:text-neutral-950">
                  IELTS Academic Prep
                </Link>
              </li>
              <li>
                <Link href="/tutoring#oet" className="transition-colors duration-300 hover:text-neutral-950">
                  OET Clinical Language
                </Link>
              </li>
              <li>
                <Link href="/tutoring#sat" className="transition-colors duration-300 hover:text-neutral-950">
                  Digital SAT Classes
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors duration-300 hover:text-neutral-950">
                  Advisory Mentors
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Office &amp; Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>counselling@paksarzameenwfo.com</li>
              <li>+92 300 1234567</li>
              <li>Model Town B, Bahawalpur, Punjab, Pakistan</li>
              <li>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-neutral-950 font-medium text-emerald-700"
                >
                  WhatsApp Direct Desk &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-black/6 pt-6 sm:flex-row">
          <p className="text-[10px] tracking-[0.18em] text-neutral-500">
            &copy; {new Date().getFullYear()} PakSarZameen Education Counselling. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.22em] text-neutral-400">
            Official Organization Division
          </p>
        </div>
      </div>
    </footer>
  );
}
