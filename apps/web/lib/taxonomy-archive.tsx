// Shared component for custom-taxonomy archive pages.
// Reused by /portfolio-category/[slug], /service-category/[slug], /case-study-category/[slug].

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

interface ArchiveProps {
  slug: string;
  taxonomy: "portfolio-category" | "service-category" | "case-study-category";
  postType: "portfolio" | "service" | "case-study";
  label: string;
}

const PARENT_HREF: Record<ArchiveProps["taxonomy"], { label: string; href: string }> = {
  "portfolio-category": { label: "Portfolio", href: "/portfolio/" },
  "service-category": { label: "Services", href: "/service-overview/" },
  "case-study-category": { label: "Case Studies", href: "/case-study/" },
};

export async function TaxonomyArchive({
  slug,
  taxonomy,
  postType,
  label,
}: ArchiveProps) {
  const cat = await prisma.category.findFirst({
    where: { slug, taxonomy },
    include: {
      posts: {
        include: {
          post: { include: { featuredImage: true } },
        },
      },
    },
  });
  if (!cat) notFound();

  const posts = cat.posts
    .map((pc) => pc.post)
    .filter((p) => p.status === "PUBLISHED" && p.type === postType)
    .sort((a, b) => +b.publishedAt - +a.publishedAt);

  const parent = PARENT_HREF[taxonomy];

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          parent,
          { label: cat.name },
        ]}
        pillLabel={label}
        pillBody={`${posts.length} ${posts.length === 1 ? "item" : "items"} in this category`}
        title={
          <>
            <em>{cat.name}</em>
          </>
        }
        subhead={cat.description || undefined}
      />

      <section className="sec">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted)" }}>
              No items in this category yet — check back soon.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => (
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

export async function buildTaxonomyMetadata(
  slug: string,
  taxonomy: ArchiveProps["taxonomy"],
  fallbackLabel: string,
) {
  const cat = await prisma.category.findFirst({ where: { slug, taxonomy } });
  if (!cat) return { title: `${fallbackLabel} not found` };
  return {
    title: cat.seoTitle || `${cat.name} — ${fallbackLabel}`,
    description: cat.seoDescription || `Items categorized as ${cat.name}.`,
    alternates: { canonical: `/${taxonomy}/${slug}/` },
  };
}
