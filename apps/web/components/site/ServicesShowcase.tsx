"use client";

import { useEffect, useRef, useState } from "react";
import {
  SERVICES,
  SERVICE_ORDER,
  type Service,
  type ServiceKey,
} from "@/lib/services-data";

type Props = {
  initialSlug?: ServiceKey;
};

export function ServicesShowcase({ initialSlug = "ai" }: Props) {
  const [active, setActive] = useState<ServiceKey>(initialSlug);
  const rootRef = useRef<HTMLDivElement>(null);

  // Sync from hash on first mount + listen for hashchange.
  useEffect(() => {
    const fromHash = (): ServiceKey | null => {
      const h = (location.hash || "").replace("#", "") as ServiceKey;
      return SERVICE_ORDER.includes(h) ? h : null;
    };
    const initial = fromHash();
    if (initial) setActive(initial);

    const onHash = () => {
      const slug = fromHash();
      if (slug) setActive(slug);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Apply per-service accent palette on the root element.
  useEffect(() => {
    const s = SERVICES[active];
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--accent", s.accent);
    el.style.setProperty("--accent-2", s.accent2);
    el.style.setProperty("--accent-glow", s.accentGlow);
  }, [active]);

  // Fade-in observer for fade-up sections.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("svc-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll(".svc-fade-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

  function navigate(slug: ServiceKey) {
    if (!SERVICES[slug]) return;
    history.replaceState(null, "", "#" + slug);
    setActive(slug);
    document.title = `${SERVICES[slug].name} | V Solutions Inc`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const s = SERVICES[active];
  const others = SERVICE_ORDER.filter((k) => k !== active).slice(0, 4);

  return (
    <div ref={rootRef} className="svc-showcase">
      {/* PILL NAV */}
      <nav className="svc-pills">
        <div className="container">
          <div className="svc-pills-track">
            {SERVICE_ORDER.map((k) => {
              const item = SERVICES[k];
              const isActive = k === active;
              return (
                <button
                  key={k}
                  className={`svc-pill${isActive ? " is-active" : ""}`}
                  onClick={() => navigate(k)}
                  type="button"
                >
                  <span className="svc-pill-icon">{item.pillIcon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div key={active} className="svc-page">
        <ServicePage s={s} />
      </div>

      {/* RELATED */}
      <section className="svc-related-sec svc-fade-up">
        <div className="container">
          <div className="svc-sec-head">
            <div className="svc-sec-eyebrow">Explore Other Services</div>
            <h2 className="svc-sec-title">
              One partner. <em>Every solution.</em>
            </h2>
          </div>
          <div className="svc-related-grid">
            {others.map((k) => {
              const item = SERVICES[k];
              return (
                <a
                  key={k}
                  href={`#${item.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(k);
                  }}
                  className="svc-related-card"
                  style={
                    {
                      ["--c1" as never]: item.accent,
                      ["--c2" as never]: item.accent2,
                    } as React.CSSProperties
                  }
                >
                  <div className="svc-related-icon">{item.pillIcon}</div>
                  <div className="svc-related-title">{item.name}</div>
                  <span className="svc-related-arrow">
                    Learn more <span className="svc-arrow">→</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta svc-fade-up">
        <div className="container">
          <div className="svc-cta-box">
            <div className="svc-cta-content">
              <div className="svc-cta-eyebrow">Ready to start?</div>
              <h3 dangerouslySetInnerHTML={{ __html: s.ctaTitle }} />
              <p>{s.ctaText}</p>
              <div className="svc-cta-actions">
                <a href="/contact/" className="svc-btn svc-btn-primary">
                  Book a Free Consultation <span className="svc-arrow">→</span>
                </a>
                <a href="tel:2482328488" className="svc-btn svc-btn-ghost">
                  📞 248 232 8488
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicePage({ s }: { s: Service }) {
  return (
    <>
      {/* HERO */}
      <section className="svc-hero">
        <div className="container">
          <nav className="svc-breadcrumb">
            <a href="/">Home</a>
            <span className="svc-bc-sep">/</span>
            <a href="/service-overview/">Services</a>
            <span className="svc-bc-sep">/</span>
            <span className="svc-bc-current">{s.name}</span>
          </nav>
          <div className="svc-hero-grid">
            <div>
              <div className="svc-hero-pill">
                <span className="svc-hero-pill-label">2026</span>
                <span>{s.pill}</span>
              </div>
              <h1
                className="svc-hero-title"
                dangerouslySetInnerHTML={{ __html: s.title }}
              />
              {s.tagline ? (
                <div className="svc-hero-tagline">{s.tagline}</div>
              ) : null}
              <p className="svc-hero-subhead">{s.subhead}</p>
              <p
                className="svc-hero-lede"
                dangerouslySetInnerHTML={{ __html: s.lede }}
              />
              <div className="svc-hero-actions">
                <a href="/contact/" className="svc-btn svc-btn-primary">
                  Talk to an expert <span className="svc-arrow">→</span>
                </a>
                <a href="/case-study/" className="svc-btn svc-btn-ghost">
                  View case studies
                </a>
              </div>
              <div className="svc-hero-trust">
                {s.stats.map((st, i) => (
                  <div key={i} className="svc-hero-trust-item">
                    <span className="svc-hero-trust-num">{st.num}</span>
                    <span className="svc-hero-trust-lbl">{st.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="svc-hero-visual">
              <div className="svc-hv-shell">
                <div className="svc-hv-orbit">
                  <div className="svc-hv-pulse" />
                  <div className="svc-hv-pulse svc-p2" />
                  <div className="svc-hv-pulse svc-p3" />
                  <div className="svc-hv-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.name} decoding="async" fetchPriority="high" />
                  </div>
                  {s.tags.slice(0, 6).map((t, i) => (
                    <span key={i} className={`svc-hv-tag svc-t${i + 1}`}>
                      <span className="svc-dot" />
                      {t}
                    </span>
                  ))}
                </div>
                {s.gallery && s.gallery[1] ? (
                  <div className="svc-hv-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.gallery[1]} alt={`${s.name} preview`} loading="lazy" decoding="async" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="svc-intro-sec svc-fade-up">
        <div className="container">
          <div className="svc-intro-grid">
            <aside className="svc-intro-side">
              <div className="svc-sec-eyebrow">{s.name}</div>
              <h2 dangerouslySetInnerHTML={{ __html: s.introTitle }} />
              <div className="svc-stat-tile">
                <span className="svc-stat-num">{s.introStat.num}</span>
                <div className="svc-stat-text">
                  <strong>{s.introStat.label}</strong>
                  {s.introStat.text}
                </div>
              </div>
            </aside>
            <div className="svc-intro-content">
              <div dangerouslySetInnerHTML={{ __html: s.introBody }} />
              {s.gallery && s.gallery.length ? (
                <div className="svc-intro-gallery">
                  {s.gallery.slice(0, 4).map((g, i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img key={i} src={g} alt={s.name} loading="lazy" />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="svc-features-sec svc-fade-up">
        <div className="container">
          {s.features.map((f, fi) => {
            const photoSrc =
              s.gallery && s.gallery.length && fi % 2 === 1
                ? s.gallery[fi % s.gallery.length]
                : null;
            return (
              <div key={fi} className="svc-feature-block">
                <div className="svc-feature-content">
                  <span className="svc-feature-eyebrow">{f.eyebrow}</span>
                  <h3 dangerouslySetInnerHTML={{ __html: f.title }} />
                  <p className="svc-feature-summary">{f.summary}</p>
                  <ul className="svc-feature-list">
                    {f.items.map((it, i) => (
                      <li key={i}>
                        <span className="svc-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <strong>{it.strong}</strong>
                          {it.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="svc-feature-tools">
                    {f.tags.map((t, i) => (
                      <span key={i} className="svc-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className={`svc-feature-visual${photoSrc ? " svc-with-image" : ""}`}
                >
                  {photoSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="svc-fv-photo"
                      src={photoSrc}
                      alt={f.eyebrow}
                      loading="lazy"
                    />
                  ) : null}
                  <div className="svc-fv-ring" />
                  <div className="svc-fv-ring svc-r2" />
                  <div className="svc-fv-ring svc-r3" />
                  <div className="svc-fv-glyph">
                    <span className="svc-glyph">{f.glyph}</span>
                  </div>
                  {f.tags.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className={`svc-feature-mini-tag svc-m${i + 1}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="svc-why-sec svc-fade-up">
        <div className="container">
          <div className="svc-sec-head">
            <div className="svc-sec-eyebrow">Why Partner With Us</div>
            <h2 className="svc-sec-title">
              Why <em>VSolutions</em> for {s.name}
            </h2>
            <p className="svc-sec-desc">
              A specialized team with deep expertise, proven results, and end-to-end
              ownership from strategy through ongoing optimization.
            </p>
          </div>
          <div className="svc-why-grid">
            {s.why.map((w, i) => (
              <div key={i} className="svc-why-card">
                <div className="svc-why-icon">{w.icon}</div>
                <h3 className="svc-why-title">{w.title}</h3>
                <p className="svc-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      {s.industries && s.industries.length ? (
        <section className="svc-industries-sec svc-fade-up">
          <div className="container">
            <div className="svc-industries-head">
              <h3>Trusted across industries</h3>
            </div>
            <div className="svc-industries-track">
              {s.industries.map((ind, i) => (
                <span key={i} className="svc-industry-pill">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* PROCESS */}
      <section className="svc-process-sec svc-fade-up">
        <div className="container">
          <div className="svc-sec-head">
            <div className="svc-sec-eyebrow">Our Proven Process</div>
            <h2 className="svc-sec-title">
              How we <em>deliver excellence</em>
            </h2>
            <p className="svc-sec-desc">
              A repeatable, transparent process refined over hundreds of engagements —
              designed to maximize impact while minimizing your team&apos;s lift.
            </p>
          </div>
          <div className="svc-process-grid">
            {s.process.map((p, i) => (
              <div key={i} className="svc-process-step">
                <div className="svc-process-num">0{i + 1}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH */}
      {s.tech && s.tech.length ? (
        <section className="svc-tech-sec svc-fade-up">
          <div className="container">
            <div className="svc-sec-head">
              <div className="svc-sec-eyebrow">Tools & Platforms</div>
              <h2 className="svc-sec-title">
                The <em>technology</em> we work with
              </h2>
              <p className="svc-sec-desc">
                Best-in-class tooling — chosen per engagement based on your stack,
                constraints, and team experience.
              </p>
            </div>
            <div className="svc-tech-grid">
              {s.tech.map((t, i) => (
                <div key={i} className="svc-tech-card">
                  <div className="svc-tech-dot">{(t.n || "").slice(0, 1)}</div>
                  <span>{t.n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* TESTIMONIAL */}
      {s.quote ? (
        <section className="svc-testimonial-sec svc-fade-up">
          <div className="container">
            <div className="svc-testimonial-card">
              <span className="svc-quote-mark">&ldquo;</span>
              <p className="svc-testimonial-text">{s.quote.text}</p>
              <div className="svc-testimonial-meta">
                <span className="svc-testimonial-avatar">
                  {(s.quote.who || "?").slice(0, 1)}
                </span>
                <span className="svc-testimonial-who">
                  <span className="svc-testimonial-name">{s.quote.who}</span>
                  <span className="svc-testimonial-org">{s.quote.org}</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {s.faqs && s.faqs.length ? (
        <section className="svc-faq-sec svc-fade-up">
          <div className="container">
            <div className="svc-faq-grid">
              <aside className="svc-faq-side">
                <div className="svc-sec-eyebrow">Frequently Asked</div>
                <h2>
                  Answers about <em>{s.name}</em>
                </h2>
                <p>
                  Common questions we hear from teams evaluating {s.name.toLowerCase()}{" "}
                  engagements. Don&apos;t see yours? Book a 30-minute call — we&apos;ll
                  answer it directly.
                </p>
                <a href="/contact/" className="svc-btn svc-btn-ghost">
                  Ask our team <span className="svc-arrow">→</span>
                </a>
              </aside>
              <div className="svc-faq-list">
                {s.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="svc-faq-item"
                    open={i === 0 ? true : undefined}
                  >
                    <summary>{f.q}</summary>
                    <div className="svc-faq-answer">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
