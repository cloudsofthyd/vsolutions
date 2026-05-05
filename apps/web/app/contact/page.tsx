import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { ContactGlobe } from "@/components/site/ContactGlobe";
import { OfficeTimer } from "@/components/site/OfficeTimer";
import { SITE } from "@/lib/site";
import { PhoneIcon } from "@/components/site/PhoneIcon";

export const metadata: Metadata = {
  title: { absolute: "Contact V Solutions Inc — Talk to Our Team" },
  description:
    "Talk to V Solutions Inc — offices in Troy, MI and Hyderabad, IN. Discuss your AI, cloud, cybersecurity, mobile, or marketing project.",
  alternates: { canonical: "/contact/" },
};

const TRUST_ITEMS = [
  { metric: "< 1", unit: "business day", label: "Response time" },
  { metric: "8.5", unit: "hr overlap", label: "US ↔ IN coverage" },
  { metric: "2", unit: "offices", label: "Global presence" },
  { metric: "100%", unit: "real humans", label: "Zero auto-replies" },
];

export default function ContactPage() {
  return (
    <main className="page-main contact-page">
      {/* ── Decorative orbs ──────────────────────────────────────────── */}
      <div className="contact-orb orb-rose" aria-hidden />
      <div className="contact-orb orb-indigo" aria-hidden />
      <div className="contact-orb orb-cyan" aria-hidden />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="contact-hero-v2">
        <div className="container">
          <div className="contact-hero-grid">
            <div className="contact-hero-copy">
              <div className="sec-eyebrow">Get in touch</div>
              <h1 className="contact-hero-title">
                Let&apos;s build something
                <br />
                <span className="gradient-text">extraordinary.</span>
              </h1>
              <p className="contact-hero-sub">
                One Partner. Every Solution. Reach out and discover how we turn
                ambitious ideas into shipping product — across AI, cloud,
                cybersecurity, and digital growth.
              </p>

              <div className="contact-quick">
                <a href={`mailto:${SITE.email}`} className="contact-quick-pill">
                  <span className="contact-quick-pill-icon">✉</span>
                  <span className="contact-quick-pill-text">
                    <span className="contact-quick-pill-label">Email us</span>
                    <span className="contact-quick-pill-value">{SITE.email}</span>
                  </span>
                </a>
                <a href={SITE.phoneHref} className="contact-quick-pill">
                  <span className="contact-quick-pill-icon"><PhoneIcon size={18} /></span>
                  <span className="contact-quick-pill-text">
                    <span className="contact-quick-pill-label">Call us</span>
                    <span className="contact-quick-pill-value">{SITE.phone}</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="contact-hero-globe-wrap">
              <ContactGlobe />
              <div className="contact-globe-tag tag-troy">
                <strong>Troy</strong>
                <span>HQ</span>
              </div>
              <div className="contact-globe-tag tag-hyd">
                <strong>Hyderabad</strong>
                <span>Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      <section className="contact-trust-section">
        <div className="container">
          <div className="contact-trust">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="contact-trust-item">
                <div className="contact-trust-metric">
                  <span className="contact-trust-num">{item.metric}</span>
                  <span className="contact-trust-unit">{item.unit}</span>
                </div>
                <span className="contact-trust-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-office grid ──────────────────────────────────────────── */}
      <section className="contact-offices-section-v2">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Where we work</div>
            <h2 className="contact-h2">
              Two offices, <em className="gradient-text">one team.</em>
            </h2>
          </div>

          <div className="contact-offices">
            {SITE.offices.map((office) => (
              <article key={office.city} className="office-card-v2">
                <div className="office-card-bg" aria-hidden />
                <div className="office-card-content">
                  <div className="office-card-head">
                    <div>
                      <span className="office-tag">{office.tag}</span>
                      <h3 className="office-city">{office.city}</h3>
                      <p className="office-country">{office.country}</p>
                    </div>
                    <OfficeTimer
                      timeZone={office.timeZone}
                      city={office.city}
                    />
                  </div>

                  <address className="office-address">
                    {office.lines.map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </address>

                  <div className="office-actions">
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="office-link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View on map
                    </a>
                    {office.phoneHref && (
                      <a href={office.phoneHref} className="office-link">
                        <PhoneIcon />
                        {office.phone}
                      </a>
                    )}
                    <a href={`mailto:${SITE.email}`} className="office-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <section className="contact-form-section-v2">
        <div className="container">
          <div className="contact-form-shell-v2">
            <div className="contact-form-aside">
              <div className="sec-eyebrow">Send a message</div>
              <h2 className="contact-h2">
                Tell us what you&apos;re
                <br />
                <em className="gradient-text">working on.</em>
              </h2>
              <p>
                Drop us a line and a real human from our team will reply within
                one business day.
              </p>

              <ul className="contact-form-promise">
                <li>
                  <span className="check-dot" aria-hidden>✓</span>
                  No sales-pitch follow-ups
                </li>
                <li>
                  <span className="check-dot" aria-hidden>✓</span>
                  NDA-ready conversations
                </li>
                <li>
                  <span className="check-dot" aria-hidden>✓</span>
                  Direct line to a senior engineer
                </li>
              </ul>
            </div>

            <div className="contact-form-pane">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
