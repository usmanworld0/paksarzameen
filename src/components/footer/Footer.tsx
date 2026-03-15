import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="psz-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 style={{ color: "#ffffff" }}>
            Pak<span className="green">Sar</span>Zameen
          </h3>
          <p>
            Building community wealth through education, compassion, and
            grassroots progress across Pakistan.
          </p>
          <div className="footer-actions">
            <a href={`mailto:${siteConfig.contact.email}`} className="footer-action-link">
              Email Us
            </a>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="footer-action-link">
              Call Now
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul className="footer-nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/policies">Policies &amp; Terms</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact-list">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}>{siteConfig.contact.phone}</a>
            </li>
            <li>
              <span>{siteConfig.contact.address}</span>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <ul className="footer-contact-list">
            <li>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={siteConfig.social.commonwealthInstagram} target="_blank" rel="noopener noreferrer">
                Store Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} <span style={{ color: "#ffffff", fontWeight: 600 }}>PakSarZameen</span>. All rights reserved.
        </p>
        <p>
          Development by <span className="footer-dev">04</span>
        </p>
      </div>
    </footer>
  );
}
