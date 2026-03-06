import Link from "next/link";
import { navLinks } from "@/config/site";

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
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><span style={{ color: "var(--light-white)", fontSize: "var(--fs-vvs)" }}>info@psz.org</span></li>
            <li><span style={{ color: "var(--light-white)", fontSize: "var(--fs-vvs)" }}>+92 300 0000000</span></li>
            <li><span style={{ color: "var(--light-white)", fontSize: "var(--fs-vvs)" }}>Lahore, Pakistan</span></li>
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
