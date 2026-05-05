import Link from "next/link";
import {
  SITE,
  FOOTER_MENU,
  FOOTER_SERVICES,
  LEGAL_LINKS,
} from "@/lib/site";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { PhoneIcon } from "@/components/site/PhoneIcon";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-newsletter-band">
          <NewsletterSignup source="footer" />
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.logoFooter} alt={SITE.name} className="brand-logo" loading="lazy" decoding="async" />
            </Link>
            <p>
              V Solutions Inc combines AI, cloud, and digital marketing expertise
              to transform technology into actionable insights, helping businesses
              achieve measurable growth and succeed on a global scale.
            </p>
            <div className="socials">
              <a
                href={SITE.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                in
              </a>
              <a
                href={SITE.social.x}
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                𝕏
              </a>
            </div>
          </div>

          <div className="fcol">
            <h5>Menu</h5>
            <ul>
              {FOOTER_MENU.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="fcol">
            <h5>Services</h5>
            <ul>
              {FOOTER_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="fcol">
            <h5>Contact us</h5>
            <div className="footer-contact">
              {SITE.offices.map((office) => (
                <a
                  key={office.city}
                  className="footer-contact-item"
                  href={office.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="icon" aria-hidden>{office.flag}</span>
                  <span>
                    <strong style={{ display: "block", fontSize: "0.85rem", marginBottom: 2 }}>
                      {office.city}
                    </strong>
                    {office.lines[0]}
                    {office.lines.length > 1 ? (
                      <>
                        <br />
                        {office.lines.slice(1).join(", ")}
                      </>
                    ) : null}
                  </span>
                </a>
              ))}
              <a className="footer-contact-item" href={`tel:+1${SITE.phone.replace(/-/g, "")}`}>
                <span className="icon"><PhoneIcon size={14} /></span>
                <span>{SITE.phone}</span>
              </a>
              <a className="footer-contact-item" href={`mailto:${SITE.email}`}>
                <span className="icon">✉</span>
                <span>{SITE.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="glow">
            {new Date().getFullYear()} © All rights reserved by V Solutions INC
          </span>
          <div className="legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
