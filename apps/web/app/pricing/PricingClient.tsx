"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PhoneIcon } from "@/components/site/PhoneIcon";

type Service = {
  name: string;
  tag: string;
  plan: string;
  price: { from: string; amount: string; custom?: boolean };
  image: string;
  features: string[];
};

const SERVICES: Service[] = [
  {
    name: "Website Development",
    tag: "Web Dev",
    plan: "Starting from (Basic Website)",
    price: { from: "From", amount: "$499" },
    image: "https://vsolutionsinc.com/wp-content/uploads/2019/11/website-development.jpg",
    features: [
      "Up to 5-page business website",
      "Mobile-friendly responsive design",
      "Contact forms and basic SEO setup",
      "Performance-optimized structure",
      "30 days post-launch support",
    ],
  },
  {
    name: "Digital Marketing",
    tag: "Marketing",
    plan: "Starter Plan",
    price: { from: "From", amount: "$599" },
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Comprehensive-AI-Powered-Digital-Marketing.jpg",
    features: [
      "SEO setup and basic optimization",
      "Google Business Profile management",
      "Limited social media posting",
      "Basic lead tracking",
      "Monthly performance summary",
    ],
  },
  {
    name: "Content Writing",
    tag: "Content",
    plan: "Starter Plan",
    price: { from: "From", amount: "$350" },
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Content-Writing-Services-That-Convert.jpg",
    features: [
      "Website and landing page content",
      "Blog articles and posts",
      "SEO-friendly writing",
      "Technical and business content",
      "Editing and revisions included",
    ],
  },
  {
    name: "Artificial Intelligence",
    tag: "AI",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2020/03/aiseo.jpg",
    features: [
      "AI strategy and use-case discovery",
      "Chatbots and virtual assistants",
      "Workflow and process automation",
      "AI system integrations",
      "Smart analytics and insights",
    ],
  },
  {
    name: "Cloud Solutions, DevOps & SRE",
    tag: "Cloud · DevOps",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Cloud-Solutions-DevOps-Site-Reliability-Engineering.png",
    features: [
      "Cloud setup and configuration",
      "CI/CD automation",
      "Performance and cost optimization",
      "Monitoring and alerting",
      "High availability and reliability",
    ],
  },
  {
    name: "Cybersecurity & AppSec Testing",
    tag: "Security",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2019/11/Cybersecurity-and-Application-Security.jpg",
    features: [
      "Vulnerability scanning",
      "Application security testing",
      "Risk and compliance assessments",
      "Threat mitigation guidance",
      "Detailed security reporting",
    ],
  },
  {
    name: "Mobile Application Development",
    tag: "Mobile",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/02/mobile-app-development1.png",
    features: [
      "iOS and Android app development",
      "Cross-platform solutions",
      "UI and UX design",
      "Backend and API integrations",
      "Testing and deployment",
    ],
  },
  {
    name: "VDI & Endpoint Management",
    tag: "VDI",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2019/11/VDI-and-Endpoint-Management-Services.png",
    features: [
      "Virtual desktop infrastructure",
      "Endpoint and device management",
      "Secure remote access",
      "Patch and update management",
      "Ongoing IT support",
    ],
  },
  {
    name: "Custom Solutions & Enterprise Support",
    tag: "Enterprise",
    plan: "Custom Engagement",
    price: { from: "Custom", amount: "Pricing", custom: true },
    image: "https://vsolutionsinc.com/wp-content/uploads/2019/11/Custom-Solutions-and-Enterprise-Support.png",
    features: [
      "Tailored multi-service solutions",
      "Architecture & technology roadmapping",
      "Complex system integrations",
      "Enterprise-grade security and scalability",
      "Ongoing IT support",
    ],
  },
];

const FAQS: Array<{ q: string; a: string; open?: boolean }> = [
  {
    q: "Why do some services show prices and others do not?",
    a: "Some services have standard starter scopes — like our Digital Marketing Starter or Web Dev Basic — where we can publish a fixed entry price. Others (AI, DevOps, Cybersecurity, Mobile, VDI, Enterprise) vary significantly based on your tech stack, integrations, compliance requirements, and timeline, so they use custom pricing built around your specific scope.",
    open: true,
  },
  {
    q: 'What does "Starting from" mean?',
    a: "The listed price covers a basic scope — what's listed in the bullets on the card. Additional features, integrations, complexity, or accelerated timelines may increase the final cost. We always provide a written proposal before any work begins so you see the full price up front.",
  },
  {
    q: "What if my requirements grow during the project?",
    a: "We review new requirements as they come up and provide transparent change-order pricing before proceeding. You always approve scope changes in writing before they affect the budget. No surprises on invoices.",
  },
  {
    q: "How do you price custom requirements?",
    a: "Custom pricing is based on four factors: scope (what we're building), complexity (architecture & tech depth), integrations (third-party systems & APIs), and timeline (how fast you need it). We assess these on a free discovery call and follow up with a fixed-price written proposal.",
  },
  {
    q: "Can projects become large or enterprise-level?",
    a: "Yes. Complex and enterprise engagements range from a few thousand dollars for focused projects to $100,000+ for multi-quarter programs involving cloud migrations, custom platform builds, AI integrations, or compliance-heavy deliverables. We've delivered programs at every scale.",
  },
  {
    q: "Do you provide detailed quotes and proposals?",
    a: "Yes. Every project includes a written proposal with detailed scope, timeline, milestones, deliverables, payment schedule, and pricing. You receive it within 2-5 business days of our discovery call. No hidden fees, no scope creep without approval.",
  },
  {
    q: "Is there a free consultation?",
    a: "Absolutely. We offer a free 30-minute consultation to understand your needs, current setup, business goals, and recommend the right solution. There's no obligation to proceed afterward — many clients use it as a free strategy review.",
  },
  {
    q: "Can I cancel a monthly plan anytime?",
    a: "Monthly Digital Marketing & Ads plans are pay-as-you-go with a 30-day notice for cancellation. Annual plans (15% discount) include a 90-day notice. Project-based engagements run to completion as scoped in the proposal — but you can pause between milestones if priorities shift.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept ACH bank transfers, major credit cards (Visa / Mastercard / Amex), wire transfers for international clients, and Stripe-based recurring billing for monthly plans. Payment terms are typically Net 15 for project work and 1st-of-month autopay for retainers.",
  },
];

export default function PricingClient() {
  const serviceGridRef = useRef<HTMLDivElement>(null);

  // Subtle 3D card tilt on service cards
  useEffect(() => {
    const cards: HTMLElement[] = serviceGridRef.current
      ? Array.from(
          serviceGridRef.current.querySelectorAll<HTMLElement>(".service-pricing-card"),
        )
      : [];
    const handlers = cards.map((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * -3;
        const tiltY = (x / rect.width) * 3;
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      return { card, onMove, onLeave };
    });
    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <section className="pricing-hero">
        <div className="container">
          <nav className="pricing-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <span className="current">Pricing</span>
          </nav>

          <div className="pricing-hero-pill">
            <span className="label">Plans</span>
            <span>Transparent pricing — no hidden fees</span>
          </div>

          <h1 className="pricing-title">
            Pricing & <em>Engagement Models.</em>
          </h1>

          <p className="pricing-subhead">
            Transparent starting prices with fully customized solutions.
          </p>

          <p className="pricing-lede">
            Choose a fixed plan to get started fast, or talk to us for a custom-scoped
            engagement. Every plan includes a free consultation, written proposal, and
            transparent timelines.
          </p>

        </div>
      </section>

      <section className="pricing-method fade-up visible">
        <div className="container">
          <div className="sec-head">
            <div className="sec-eyebrow">How we price</div>
            <h2 className="sec-title">
              Three steps. <em>Zero surprises.</em>
            </h2>
            <p className="sec-desc">
              Every engagement — from a $499 starter site to a multi-quarter cloud
              migration — moves through the same simple flow.
            </p>
          </div>

          <ol className="pricing-method-list">
            <li className="pricing-method-step">
              <span className="pricing-method-num">01</span>
              <h3>Discovery call</h3>
              <p>
                Free 30-min conversation about goals, constraints, and the metric we'll
                be measured against. No commitment.
              </p>
              <span className="pricing-method-meta">30 min · Free</span>
            </li>
            <li className="pricing-method-step">
              <span className="pricing-method-num">02</span>
              <h3>Written proposal</h3>
              <p>
                Fixed-price scope, milestones, deliverables, payment schedule — back to
                you in 2–5 business days. You sign only when it's right.
              </p>
              <span className="pricing-method-meta">2–5 days · Fixed price</span>
            </li>
            <li className="pricing-method-step">
              <span className="pricing-method-num">03</span>
              <h3>Milestone delivery</h3>
              <p>
                We ship in two-week sprints, invoice on milestone acceptance, and keep
                a single Slack channel open with you the whole way.
              </p>
              <span className="pricing-method-meta">Bi-weekly · Transparent</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="services-section fade-up visible">
        <div className="container">
          <div className="sec-head">
            <div className="sec-eyebrow">Individual Services</div>
            <h2 className="sec-title">
              Project-based &amp; <em>custom engagements.</em>
            </h2>
            <p className="sec-desc">
              Standalone services — perfect when you need specific expertise without a
              long-term marketing retainer. Every engagement starts with a free
              consultation and a written, fixed-price proposal.
            </p>
          </div>

          <div className="service-grid" ref={serviceGridRef}>
            {SERVICES.map((s, i) => (
              <a key={s.name} href="/contact/" className="service-pricing-card">
                <div className="service-thumb">
                  <span className="service-thumb-tag">{s.tag}</span>
                  <span
                    className={`service-thumb-price${s.price.custom ? " custom" : ""}`}
                  >
                    <span className="from">{s.price.from}</span>
                    <span className="amount">{s.price.amount}</span>
                  </span>
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    quality={90}
                    priority={i === 0}
                    className="service-thumb-img"
                  />
                </div>
                <div className="service-body">
                  <h3 className="service-name">{s.name}</h3>
                  <span className="service-plan-name">{s.plan}</span>
                  <ul className="service-features">
                    {s.features.map((f) => (
                      <li key={f} className="service-feature">
                        <span className="check"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="service-cta">
                    Contact us <span className="service-cta-arrow">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section fade-up visible">
        <div className="container">
          <div className="faq-grid">
            <aside className="faq-side">
              <div className="faq-side-eyebrow">FAQ</div>
              <h2>
                Frequently Asked <em>Questions.</em>
              </h2>
              <p>
                Honest answers to the questions clients ask most before signing up.
                Don't see yours below? Reach out — we respond within 1 business day.
              </p>

              <div className="faq-help-card">
                <h4>Still have questions?</h4>
                <p>
                  Talk to our team. Free 30-min consultation, written proposal included.
                  No commitment.
                </p>
                <div className="actions">
                  <a href="/contact/" className="btn btn-primary">
                    Book consultation <span className="btn-arrow">→</span>
                  </a>
                  <a href="tel:2482328488" className="btn btn-ghost btn-with-icon">
                    <PhoneIcon size={15} /> Call us
                  </a>
                </div>
              </div>
            </aside>

            <div className="faq-list">
              {FAQS.map((item) => (
                <details key={item.q} className="faq-item" open={item.open}>
                  <summary>{item.q}</summary>
                  <div className="faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta fade-up visible">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <div className="cta-eyebrow">Free Consultation</div>
              <h3>
                Not sure which plan fits? <em>Let's talk it through.</em>
              </h3>
              <p>
                Tell us about your goals. We'll recommend the right plan — or build a
                custom engagement if your scope doesn't fit a standard tier. Free
                30-minute call, no commitment.
              </p>
              <div className="cta-actions">
                <a href="/contact/" className="btn btn-primary">
                  Book a Free Consultation <span className="btn-arrow">→</span>
                </a>
                <a href="tel:2482328488" className="btn btn-ghost btn-with-icon">
                  <PhoneIcon size={15} /> 248-232-8488
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
