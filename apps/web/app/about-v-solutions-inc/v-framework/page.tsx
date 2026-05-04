import Link from "next/link";
import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const p = await prisma.post.findFirst({
    where: { slug: "v-framework", type: "page", status: "PUBLISHED" },
  });
  const desc = (p?.seoDescription || p?.excerpt || undefined)?.slice(0, 160);
  return {
    title: p?.seoTitle ? { absolute: p.seoTitle } : "V-Framework",
    description: desc,
    alternates: { canonical: "/about-v-solutions-inc/v-framework/" },
  };
}

const PILLARS = [
  {
    icon: "◆",
    label: "Vision",
    body: "Strategy-first discovery aligned to outcomes — not deliverables.",
  },
  {
    icon: "▲",
    label: "Velocity",
    body: "Engineering-led execution with CI/CD, automation, and zero ceremony.",
  },
  {
    icon: "●",
    label: "Value",
    body: "Pricing tied to KPIs. Every release production-ready, every metric earned.",
  },
];

export default async function Page() {
  const p = await prisma.post.findFirst({
    where: { slug: "v-framework", type: "page", status: "PUBLISHED" },
  });
  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about-v-solutions-inc/" },
          { label: "V-Framework" },
        ]}
        pillLabel="Methodology"
        pillBody="How we plan, build, and ship"
        title={
          <>
            The <em>V-Framework.</em>
          </>
        }
        subhead={p?.excerpt || "A repeatable, measurable approach to digital transformation."}
      />

      {/* Pillars strip */}
      <section className="sec">
        <div className="container">
          <div className="vf-pillars">
            {PILLARS.map((pillar) => (
              <article key={pillar.label} className="vf-pillar">
                <span className="vf-pillar-icon" aria-hidden>{pillar.icon}</span>
                <h3 className="vf-pillar-label">{pillar.label}</h3>
                <p className="vf-pillar-body">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {p?.content && (
        <article className="article-shell">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: renderWpContent(p.content) }}
          />
        </article>
      )}

      {/* CTA */}
      <section className="cta fade-up">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
                Apply the framework
              </div>
              <h3>
                Ship outcomes — <em>not just deliverables.</em>
              </h3>
              <p>
                Bring V-Framework discipline to your next initiative. Talk to our
                team about a discovery sprint.
              </p>
              <div className="cta-actions">
                <Link href="/contact/" className="btn btn-primary">
                  Schedule a discovery call <span className="btn-arrow">→</span>
                </Link>
                <Link href="/service-overview/" className="btn btn-ghost">
                  Explore services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
