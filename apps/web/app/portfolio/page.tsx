import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A selection of recent V Solutions Inc projects across AI, cloud, mobile, and web.",
  alternates: { canonical: "/portfolio/" },
};

export const revalidate = 600;

export default async function PortfolioIndex() {
  const items = await prisma.post.findMany({
    where: { type: "portfolio", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
        pillLabel="Work"
        pillBody="Recent shipped projects"
        title={
          <>
            Selected <em>work.</em>
          </>
        }
        subhead="A curated cross-section of what we've built — AI platforms, cloud systems, mobile apps, and conversion-driven marketing sites."
      />
      <section className="sec">
        <div className="container">
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted)" }}>
              Portfolio coming soon — check back shortly.
            </p>
          ) : (
            <div className="blog-grid">
              {items.map((p) => (
                <Link key={p.id} href={p.permalink} className="post-card">
                  <div className="post-thumb">
                    <div
                      className="post-img"
                      style={{
                        backgroundImage: `url('${p.featuredImage?.url || "/uploads/2026/01/devops-1.png"}')`,
                      }}
                    />
                  </div>
                  <div className="post-body">
                    <h3 className="post-title">{p.title}</h3>
                    {p.excerpt && <p>{p.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
