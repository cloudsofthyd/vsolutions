import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "How We Work — Global Delivery Model | V Solutions Inc" },
  description:
    "Distributed Agile for enterprise success. Onshore strategic leadership + offshore technical execution, bi-weekly releases, real-time visibility.",
  alternates: { canonical: "/how-we-work/" },
};

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discover",
    sub: "Workshop the problem",
    body: "Business objective workshops, infrastructure assessments, competitive landscape analysis, stakeholder interviews, KPI definition.",
    duration: "Week 1-2",
  },
  {
    num: "02",
    title: "Design",
    sub: "Architect the solution",
    body: "Solution architecture, tech stack selection, sprint planning, design system creation, prototyping with real feedback loops.",
    duration: "Week 2-3",
  },
  {
    num: "03",
    title: "Develop",
    sub: "Build with velocity",
    body: "Distributed Agile sprints. Bi-weekly releases. CI/CD pipelines, automated testing, integrated quality gates from day one.",
    duration: "Sprints 1-N",
  },
  {
    num: "04",
    title: "Deploy",
    sub: "Ship with confidence",
    body: "Blue-green deployments, zero-downtime migrations, automated security scans, encryption, compliance gates baked in.",
    duration: "Continuous",
  },
  {
    num: "05",
    title: "Optimize",
    sub: "Iterate from data",
    body: "Real-time monitoring, FinOps cost control, A/B testing, conversion optimization, 24/7 follow-the-sun ops.",
    duration: "Ongoing",
  },
];

const PRINCIPLES = [
  {
    title: "Continuous delivery & rapid iterations",
    body: "Distributed Agile methodology supports bi-weekly (or weekly) releases. You see real progress — not after months of waiting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    ),
  },
  {
    title: "Real-time project visibility",
    body: "Synchronized workflows, daily standups, sprint reviews, and live dashboards give stakeholders full transparency.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Risk mitigation through partnership",
    body: "Onshore strategic leadership paired with offshore technical excellence — cultural fit, instant communication, lower risk.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Quality without compromise",
    body: "CI/CD pipelines, automated testing, integrated quality gates. Solutions meet enterprise standards from the start.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const SERVICE_DELIVERY = [
  {
    title: "Digital Marketing",
    href: "/service/digital-marketing/",
    bullets: [
      "Two-week sprints for landing pages, automation, and analytics",
      "Built-in A/B testing and performance optimization",
      "CRM, analytics, and automation integrations",
      "Technical SEO + content strategy",
    ],
  },
  {
    title: "Website Development",
    href: "/service/website-development-services-vsolutions-inc/",
    bullets: [
      "Weekly user-centric design sprints",
      "Headless CMS and API-first architecture",
      "Mobile-first, Core Web Vitals optimization",
      "WCAG 2.1 AA accessibility compliance",
    ],
  },
  {
    title: "Cloud & Migration",
    href: "/service/cloud-devops-services/",
    bullets: [
      "Cloud-native: microservices, containers, serverless",
      "Zero-downtime migrations via blue-green deployments",
      "FinOps for cost control from day one",
      "HIPAA / SOC 2 / GDPR compliance baked in",
    ],
  },
  {
    title: "DevOps & Automation",
    href: "/service/cloud-devops-services/",
    bullets: [
      "Embedded engineers in your team",
      "Infrastructure-as-code (Terraform, Pulumi)",
      "Observability: logs, metrics, tracing, SLOs",
      "Incident response runbooks + on-call playbooks",
    ],
  },
];

const ENGAGEMENT = [
  { name: "Fixed-Price", desc: "Predictable costs for defined scope." },
  { name: "Time & Materials", desc: "Flexibility for evolving requirements." },
  { name: "Dedicated Teams", desc: "Long-term partnerships with embedded resources." },
  { name: "Outcome-Based", desc: "Success tied directly to your KPIs." },
];

export default function HowWeWorkPage() {
  return (
    <main className="page-main story-page">
      <div className="contact-orb orb-rose" aria-hidden />
      <div className="contact-orb orb-indigo" aria-hidden />
      <div className="contact-orb orb-cyan" aria-hidden />

      {/* Hero */}
      <section className="story-hero">
        <div className="container">
          <div className="story-hero-inner">
            <div className="sec-eyebrow">How We Work</div>
            <h1 className="story-hero-title">
              Where quality meets{" "}
              <span className="gradient-text">velocity.</span>
            </h1>
            <p className="story-hero-sub">
              Our Global Delivery Model evolves beyond traditional offshore
              development — designed for the fast-paced digital world where
              agility, transparency, and rapid innovation are essential.
            </p>
            <div className="story-hero-actions">
              <Link href="/contact/" className="btn btn-primary">
                Start a project <span className="btn-arrow">→</span>
              </Link>
              <Link href="/about-v-solutions-inc/" className="btn btn-ghost">
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="process-section">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Our Process</div>
            <h2 className="contact-h2">
              From discovery to <em className="gradient-text">delivery.</em>
            </h2>
          </div>

          <div className="process-timeline">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="process-step">
                <div className="process-step-marker">
                  <span className="process-step-num">{step.num}</span>
                  {i < PROCESS_STEPS.length - 1 && (
                    <span className="process-step-connector" aria-hidden />
                  )}
                </div>
                <div className="process-step-card">
                  <span className="process-step-duration">{step.duration}</span>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-sub">{step.sub}</p>
                  <p className="process-step-body">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="principles-section">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Distributed Agile for Enterprise</div>
            <h2 className="contact-h2">
              Four principles that make it{" "}
              <em className="gradient-text">work.</em>
            </h2>
          </div>

          <div className="principles-grid">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="principle-card">
                <span className="principle-icon" aria-hidden>{p.icon}</span>
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service-specific delivery */}
      <section className="service-delivery-section">
        <div className="container">
          <div className="contact-section-head">
            <div className="sec-eyebrow">Service-specific Delivery</div>
            <h2 className="contact-h2">
              How we ship across every <em className="gradient-text">service line.</em>
            </h2>
          </div>

          <div className="service-delivery-grid">
            {SERVICE_DELIVERY.map((s) => (
              <article key={s.title} className="service-delivery-card">
                <h3 className="service-delivery-title">{s.title}</h3>
                <ul className="service-delivery-list">
                  {s.bullets.map((b, i) => (
                    <li key={i}>
                      <span className="check-dot" aria-hidden>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="service-delivery-link">
                  Service details <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="engagement-section">
        <div className="container">
          <div className="engagement-card">
            <div className="engagement-head">
              <div className="sec-eyebrow">Flexible Engagement</div>
              <h2 className="contact-h2">
                Pick the model that <em className="gradient-text">fits.</em>
              </h2>
              <p>
                Every project is different. Choose the engagement model that
                aligns with your scope, risk profile, and how you measure
                success.
              </p>
            </div>
            <div className="engagement-grid">
              {ENGAGEMENT.map((e, i) => (
                <div key={e.name} className="engagement-item">
                  <span className="engagement-num">{String(i + 1).padStart(2, "0")}</span>
                  <h4>{e.name}</h4>
                  <p>{e.desc}</p>
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
                — Ready when you are
              </div>
              <h2 className="contact-h2">
                Let&apos;s build something <em className="gradient-text">together.</em>
              </h2>
              <p>
                Bring us your hardest problem. We&apos;ll bring senior engineers,
                a clear plan, and shipping software.
              </p>
              <div className="cta-actions">
                <Link href="/contact/" className="btn btn-primary">
                  Start the conversation <span className="btn-arrow">→</span>
                </Link>
                <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
                  ✉ {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
