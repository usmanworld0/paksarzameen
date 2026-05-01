import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const primaryColumns = [
  {
    heading: "Explore",
    links: [
      { label: "About PSZ", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Impact", href: "/impact" },
      { label: "Get Involved", href: "/get-involved" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "HealthCare", href: "/healthcare" },
      { label: "Adopt a Dog", href: "/dog-adoption" },
      { label: "Blood Bank", href: "/blood-bank" },
      { label: "News & Resources", href: "/news" },
    ],
  },
  {
    heading: "Visit",
    links: [
      { label: "Paksarzameen Store", href: "/commonwealth-lab" },
      { label: "Contact", href: "/contact" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "About the Foundation", href: "/about" },
    ],
  },
] as const;

const legalLinks = [
  { label: "Privacy", href: "/policies#privacy-policy" },
  { label: "Terms", href: "/policies#terms-and-conditions" },
  { label: "Accessibility", href: "/contact" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const callHref = `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`;
  const mailHref = `mailto:${siteConfig.contact.email}`;

  return (
    <footer className="psz-footer">
      <div className="psz-footer__shell">
        <div className="psz-footer__grid">
          <section className="psz-footer__brand" aria-labelledby="footer-brand-heading">
            <p className="psz-footer__eyebrow">Pakistan community development</p>
            <div className="psz-footer__brand-row">
              <span className="psz-footer__logo" aria-hidden="true">
                <Image
                  src="/paksarzameen_logo.png"
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </span>
              <div className="psz-footer__brand-copy">
                <h2 id="footer-brand-heading" className="psz-footer__brand-title">
                  PakSarZameen
                </h2>
                <p className="psz-footer__summary">
                  Education, health, welfare, climate action, and animal care.
                </p>
              </div>
            </div>
          </section>

          {primaryColumns.map((column) => (
            <nav
              key={column.heading}
              className="psz-footer__column"
              aria-label={`${column.heading} footer links`}
            >
              <h3 className="psz-footer__heading">{column.heading}</h3>
              <ul className="psz-footer__list">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className="psz-footer__link" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <section className="psz-footer__column" aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading" className="psz-footer__heading">
              Contact
            </h3>
            <ul className="psz-footer__list psz-footer__list--contact">
              <li>
                <a className="psz-footer__link" href={mailHref}>
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a className="psz-footer__link" href={callHref}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <address className="psz-footer__address">
                  {siteConfig.contact.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </li>
            </ul>
          </section>
        </div>

        <section className="psz-footer__cta" aria-labelledby="footer-cta-heading">
          <div>
            <p className="psz-footer__heading-label">Take the next step</p>
            <h3 id="footer-cta-heading" className="psz-footer__cta-title">
              Join a program or reach the team.
            </h3>
            <p className="psz-footer__cta-copy">Volunteer, collaborate, or ask for help.</p>
          </div>
          <div className="psz-footer__cta-actions">
            <Link className="psz-footer__button psz-footer__button--primary" href="/get-involved">
              Get Involved
            </Link>
            <a className="psz-footer__button" href={mailHref}>
              Email Us
            </a>
          </div>
        </section>

        <div className="psz-footer__legal">
          <p className="psz-footer__legal-copy">
            &copy; {currentYear} PakSarZameen. All rights reserved.
          </p>

          <div className="psz-footer__legal-links" aria-label="Legal links">
            {legalLinks.map((link, index) => (
              <span key={link.label} className="psz-footer__legal-item">
                {index > 0 ? <span className="psz-footer__separator">|</span> : null}
                <Link className="psz-footer__legal-link" href={link.href}>
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          <div className="psz-footer__legal-links" aria-label="Social links">
            <a
              className="psz-footer__legal-link"
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <span className="psz-footer__separator">|</span>
            <a
              className="psz-footer__legal-link"
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <span className="psz-footer__separator">|</span>
            <a
              className="psz-footer__legal-link"
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
