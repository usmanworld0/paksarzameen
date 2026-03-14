import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="psz-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h3>
            Pak<span className="green">Sar</span>Zameen
          </h3>
          <p>
            Building community wealth through education, compassion, and
            grassroots progress across Pakistan.
          </p>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/volunteer">Volunteer</Link>
            </li>
            <li>
              <Link href="/commonwealth">Commonwealth</Link>
            </li>
            <li>
              <Link href="/policies">Policies &amp; Terms</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><span style={{ color: "rgba(255,255,255,0.55)", fontSize: "var(--fs-vs)" }}>{siteConfig.contact.email}</span></li>
            <li><span style={{ color: "rgba(255,255,255,0.55)", fontSize: "var(--fs-vs)" }}>{siteConfig.contact.phone}</span></li>
            <li><span style={{ color: "rgba(255,255,255,0.55)", fontSize: "var(--fs-vs)" }}>{siteConfig.contact.address}</span></li>
            <li>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", fontSize: "var(--fs-vs)" }}>
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", fontSize: "var(--fs-vs)" }}>
                Facebook
              </a>
            </li>
            <li>
              <a href={siteConfig.social.commonwealthInstagram} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", fontSize: "var(--fs-vs)" }}>
                Commonwealth Lab Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PakSarZameen. All rights reserved.</p>
        <p>
          Development by{" "}
          <span style={{ color: "var(--psz-green)", opacity: 0.6 }}>04</span>
        </p>
      </div>
    </footer>
  );
}
