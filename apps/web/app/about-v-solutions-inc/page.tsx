import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About V Solutions Inc — Global AI & Cloud Partner" },
  description:
    "V Solutions Inc is a global technology partner specializing in AI, cloud, DevOps, custom development, VDI, and digital marketing. Real outcomes, hybrid delivery.",
  alternates: { canonical: "/about-v-solutions-inc/" },
};

const STATS = [
  { value: "2022", label: "Founded", suffix: "" },
  { value: "8", label: "Service verticals", suffix: "" },
  { value: "40-60", label: "Cost savings", suffix: "%" },
  { value: "2", label: "Global offices", suffix: "" },
];

const PILLARS = [
  {
    num: "01",
    title: "Proven expertise across technologies",
    body: "Certified specialists with 15-20+ years across AWS, Azure, GCP, Kubernetes, Terraform, React, Python, .NET, TensorFlow, PyTorch, Citrix, and VMware. We've shipped at every layer of the stack.",
    tags: ["Cloud Architects", "DevOps", "Full-stack", "AI/ML", "VDI"],
  },
  {
    num: "02",
    title: "Innovation-driven cost efficiency",
    body: "Hybrid delivery: onshore strategy + offshore execution. 40-60% cost savings vs traditional consulting, follow-the-sun development, scalable team structures, with no compromise on quality.",
    tags: ["Fixed-Price", "Time & Materials", "Dedicated Teams", "Outcome-Based"],
  },
  {
    num: "03",
    title: "Custom solutions, not templates",
    body: "Discovery-first methodology. We invest time understanding your business before proposing solutions — workshops, infrastructure assessments, competitive analysis, stakeholder interviews, and KPI-aligned success metrics.",
    tags: ["HIPAA", "SOC 2", "PCI-DSS", "GDPR"],
  },
];

const CAPABILITIES = [
  { icon: "🤖", name: "Artificial Intelligence", note: "ML, NLP, Generative AI", href: "/service/artificial-intelligence/" },
  { icon: "☁️", name: "Cloud DevOps", note: "AWS, Azure, GCP, K8s", href: "/service/cloud-devops-services/" },
  { icon: "🔐", name: "Cybersecurity", note: "AppSec, Pen-testing", href: "/service/cybersecurity-application-security-testing/" },
  { icon: "💻", name: "Web Development", note: "React, Next, JAMstack", href: "/service/website-development-services-vsolutions-inc/" },
  { icon: "📱", name: "Mobile Apps", note: "iOS, Android, RN, Flutter", href: "/service/mobile-application-development/" },
  { icon: "📈", name: "Digital Marketing", note: "SEO, PPC, automation", href: "/service/digital-marketing/" },
  { icon: "🖥️", name: "VDI & Endpoints", note: "Citrix, VMware, AVD", href: "/service/vdi-endpoint-management-services/" },
  { icon: "✍️", name: "Content Writing", note: "Technical, brand, SEO", href: "/service/content-writing/" },
];

const VALUES = [
  { label: "Discovery-first", body: "We learn your business before pitching tech." },
  { label: "Cross-functional", body: "Strategy, design, engineering — one team." },
  { label: "Outcome-bound", body: "Pricing tied to KPIs, not just hours." },
  { label: "Quality at speed", body: "CI/CD, automated tests, every release production-ready." },
];

export default function AboutPage() {
  return (
    <main className="page-main story-page">
      <div className="contact-orb orb-rose" aria-hidden />
      <div className="contact-orb orb-indigo" aria-hidden />
      <div className="contact-orb orb-cyan" aria-hidden />

      {/* Hero */}
      <section className="story-hero">
        <div className="container">
          <div className="story-hero-inner">
            <div className="sec-eyebrow">About V Solutions Inc</div>
            <h1 className="story-hero-title">
              Global technology partner for{" "}
              <span className="gradient-text">ambitious businesses.</span>
            </h1>
            <p className="story-hero-sub">
              We&apos;re a hybrid delivery agency combining AI, cloud, DevOps, and
              digital growth expertise — empowering organizations of every size
              to navigate digital transformation with confidence.
            </p>
            <div className="story-hero-actions">
              <Link href="/contact/" className="btn btn-primary">
                Talk to our team <span className="btn-arrow">→</span>
              </Link>
              <Link href="/case-study/" className="btn btn-ghost">
                See our work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="story-stats-section">
        <div className="container">
          <div className="story-stats">
            {STATS.map((s) => (
              <div key={s.label} className="story-stat">
                <div className="story-stat-value">
                  <span className="story-stat-num">{s.value}</span>
                  {s.suffix && <span className="story-stat-suffix">{s.suffix}</span>}
                </div>
                <span className="story-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="story-mission">
        <div className="container">
          <div className="story-mission-inner">
            <div className="sec-eyebrow">Our Mission</div>
            <p className="story-mission-quote">
              To <em className="gradient-text">democratize</em> enterprise-grade
              technology solutions by combining world-class expertise with
              innovative delivery models — making sophisticated cloud, AI, and
              digital practices accessible to organizations of every size.
            </p>
            <div className="story-mission-sig">
              <span className="story-mission-line" aria-hidden />
              <span>The V Solutions Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="story-pillars-section">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Where experience meets execution</div>
            <h2 className="contact-h2">
              Three commitments that shape every <em className="gradient-text">engagement.</em>
            </h2>
          </div>

          <div className="story-pillars">
            {PILLARS.map((p) => (
              <article key={p.num} className="story-pillar-card">
                <div className="story-pillar-num">{p.num}</div>
                <h3 className="story-pillar-title">{p.title}</h3>
                <p className="story-pillar-body">{p.body}</p>
                <div className="story-pillar-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="story-tag">{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities matrix */}
      <section className="story-capabilities-section">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Capabilities</div>
            <h2 className="contact-h2">
              One partner, every <em className="gradient-text">solution.</em>
            </h2>
          </div>

          <div className="story-capabilities">
            {CAPABILITIES.map((c) => (
              <Link key={c.name} href={c.href} className="story-cap">
                <span className="story-cap-icon" aria-hidden>{c.icon}</span>
                <span className="story-cap-text">
                  <span className="story-cap-name">{c.name}</span>
                  <span className="story-cap-note">{c.note}</span>
                </span>
                <span className="story-cap-arrow" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="story-values-section">
        <div className="container">
          <div className="story-values-grid">
            <div className="story-values-head">
              <div className="sec-eyebrow">What we believe</div>
              <h2 className="contact-h2">
                Principles that <em className="gradient-text">drive us.</em>
              </h2>
            </div>
            <div className="story-values">
              {VALUES.map((v) => (
                <div key={v.label} className="story-value">
                  <h4 className="story-value-label">{v.label}</h4>
                  <p className="story-value-body">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="story-cta">
        <div className="container">
          <div className="story-cta-card">
            <div className="story-cta-content">
              <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
                — Let&apos;s build together
              </div>
              <h2 className="contact-h2">
                Ready to ship your next <em className="gradient-text">big idea?</em>
              </h2>
              <p>
                One Partner. Every Solution. Talk to our team and discover how
                V Solutions can transform your business.
              </p>
              <div className="cta-actions">
                <Link href="/contact/" className="btn btn-primary">
                  Contact us <span className="btn-arrow">→</span>
                </Link>
                <a href={SITE.phoneHref} className="btn btn-ghost">
                  📞 {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
