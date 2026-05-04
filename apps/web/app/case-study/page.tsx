import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real-world success stories from V Solutions Inc — measurable outcomes across AI, cloud, cybersecurity, mobile, and digital marketing engagements.",
  alternates: { canonical: "/case-study/" },
};

export const revalidate = 600;

type Enrichment = {
  industry: string;
  client: string;
  services: string[];
  metric: { value: string; label: string };
  extraMetrics?: Array<{ value: string; label: string }>;
  summary: string;
};

const ENRICHMENT: Record<string, Enrichment> = {
  "devops-container-case-study": {
    industry: "Cloud · DevOps · B2B Tech",
    client: "DevOps Container Market",
    services: ["Cloud Engineering", "DevOps", "SEO", "Web Development"],
    metric: { value: "583%", label: "Inbound Lead Growth" },
    extraMetrics: [
      { value: "$148K", label: "AWS Savings / yr" },
      { value: "40+", label: "Qualified Leads / mo" },
      { value: "2", label: "Fortune 1000 Deals" },
    ],
    summary:
      "Rebuilt a weak technical site into a credibility engine — automated DevOps pipelines, optimized AWS infrastructure, and ranked them for high-intent buyer queries. Two Fortune 1000 enterprise contracts closed during engagement.",
  },
  "hindutone-300-percent-traffic-growth-case-study": {
    industry: "Music · Entertainment",
    client: "HinduTone",
    services: ["SEO Strategy", "Content Marketing", "Technical SEO"],
    metric: { value: "300%", label: "Traffic Growth in 90 Days" },
    summary:
      "Combined keyword-led content production with technical SEO fixes to triple organic traffic in a single quarter — capturing high-intent music discovery searches at a fraction of paid acquisition cost.",
  },
  "inspired-infotech-seo-case-study-312-roi": {
    industry: "IT Services · Lead Generation",
    client: "Inspired Infotech",
    services: ["SEO", "Lead Generation", "Web Optimization"],
    metric: { value: "312%", label: "ROI in 12 Months" },
    summary:
      "Turned an underperforming corporate site into a measurable lead-generation engine — search-intent rewrite, conversion-led page redesigns, and full-funnel tracking delivered triple-digit ROI inside a year.",
  },
  "nri-globe-case-study": {
    industry: "Travel · Diaspora Media",
    client: "NRI Globe",
    services: ["Website Redesign", "SEO", "Content Strategy"],
    metric: { value: "341%", label: "Organic Traffic Growth" },
    summary:
      "Redesigned for a global NRI audience and rebuilt the content strategy around the journeys that actually matter — visa, finance, real estate. Result: organic traffic more than 4x within a year.",
  },
  "vfuturemedia-case-study-ai-digital-media-platform-built-by-vsolutions":
    {
      industry: "AI · Digital Media Platform",
      client: "vFutureMedia",
      services: ["AI Engineering", "Platform Build", "SEO Growth"],
      metric: { value: "AI", label: "Platform Built In-House" },
      summary:
        "Designed and shipped vFutureMedia from zero — an AI-powered publishing platform with content automation, SEO growth loops, audience expansion, and built-in monetization for digital media operators.",
    },
};

const FEATURED_SLUG = "devops-container-case-study";

export default async function CaseStudyIndex() {
  const studies = await prisma.post.findMany({
    where: { type: "case-study", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });

  const featured = studies.find((s) => s.slug === FEATURED_SLUG);
  const rest = studies.filter((s) => s.slug !== FEATURED_SLUG);

  return (
    <main className="page-main">
      <section className="cs-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <span className="current">Case Studies</span>
          </nav>

          <div className="cs-hero-pill">
            <span className="label">Proof</span>
            <span>Real engagements · Measurable outcomes</span>
          </div>

          <h1 className="cs-title">
            Built, shipped, and <em>measurably grown.</em>
          </h1>

          <p className="cs-subhead">
            Five client engagements. One promise: outcomes you can put in a board deck.
          </p>

          <p className="cs-lede">
            From a 583% inbound lead lift to a from-scratch AI media platform — every
            study below ships with the metric, the strategy, and the deliverable.
          </p>

        </div>
      </section>

      {featured &&
        (() => {
          const e = ENRICHMENT[featured.slug];
          if (!e) return null;
          return (
            <section className="cs-featured-section">
              <div className="container">
                <Link
                  href={featured.permalink}
                  className="cs-featured"
                  aria-label={`Read full case study: ${featured.title}`}
                >
                  <div className="cs-featured-thumb">
                    <span className="cs-featured-badge">Featured Case</span>
                    <div
                      className="cs-featured-img"
                      style={{
                        backgroundImage: `url('${
                          featured.featuredImage?.url ||
                          "/uploads/2026/03/devopscontainer.jpg"
                        }')`,
                      }}
                    />
                  </div>
                  <div className="cs-featured-body">
                    <span className="cs-industry">{e.industry}</span>
                    <h2 className="cs-featured-title">{featured.title}</h2>
                    <p className="cs-featured-summary">{e.summary}</p>
                    <div className="cs-metric-row">
                      <div className="cs-metric">
                        <span className="v">{e.metric.value}</span>
                        <span className="l">{e.metric.label}</span>
                      </div>
                      {e.extraMetrics?.map((m) => (
                        <div key={m.label} className="cs-metric">
                          <span className="v">{m.value}</span>
                          <span className="l">{m.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cs-services">
                      {e.services.map((s) => (
                        <span key={s} className="cs-service-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="cs-cta-link">
                      Read full case study <span className="arr">→</span>
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          );
        })()}

      <section className="cs-grid-section">
        <div className="container">
          <div className="cs-grid">
            {rest.map((s) => {
              const e = ENRICHMENT[s.slug];
              if (!e) return null;
              return (
                <Link key={s.id} href={s.permalink} className="cs-card">
                  <div className="cs-card-thumb">
                    <span className="cs-card-tag">{e.industry.split(" · ")[0]}</span>
                    <span className="cs-card-metric">
                      <span className="v">{e.metric.value}</span>
                      <span className="l">{e.metric.label}</span>
                    </span>
                    <div
                      className="cs-card-img"
                      style={{
                        backgroundImage: `url('${
                          s.featuredImage?.url || "/uploads/2026/01/devops-1.png"
                        }')`,
                      }}
                    />
                  </div>
                  <div className="cs-card-body">
                    <span className="cs-card-client">{e.client}</span>
                    <h3 className="cs-card-title">{s.title}</h3>
                    <p className="cs-card-summary">{e.summary}</p>
                    <div className="cs-card-foot">
                      <div className="cs-card-services">
                        {e.services.slice(0, 3).map((sv) => (
                          <span key={sv} className="cs-service-tag">
                            {sv}
                          </span>
                        ))}
                      </div>
                      <span className="read">
                        Read <span className="arr">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <div className="cta-eyebrow">Your Turn</div>
              <h3>
                Want results like these on <em>your next launch?</em>
              </h3>
              <p>
                Tell us what you're trying to grow, ship, or scale. We'll come back with
                a clear scope, fixed price, and the success metric we'll be measured
                against.
              </p>
              <div className="cta-actions">
                <a href="/contact/" className="btn btn-primary">
                  Start a Project <span className="btn-arrow">→</span>
                </a>
                <a href="/pricing/" className="btn btn-ghost">
                  See Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
