// Universal post/page resolver. Handles flat-permalink routing: /{slug}/, plus
// any ad-hoc paths that don't have a dedicated route. Falls through to redirect
// table → 404 if nothing matches.

import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ slug: string[] }>;
}

function buildPath(slug: string[]): string {
  if (slug.length === 0) return "/";
  return `/${slug.join("/")}/`;
}

async function resolve(slug: string[]) {
  const path = buildPath(slug);

  // 1. Direct post/page lookup
  const post = await prisma.post.findUnique({
    where: { permalink: path },
    include: {
      featuredImage: true,
      author: { select: { username: true, displayName: true, bio: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
  if (post && post.status === "PUBLISHED") return { kind: "post" as const, post };

  // 2. Redirect map
  const redirectRow = await prisma.redirect.findUnique({ where: { from: path } });
  if (redirectRow) return { kind: "redirect" as const, redirect: redirectRow };

  return { kind: "none" as const };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (r.kind !== "post") return { title: "Page not found" };
  const p = r.post;
  const desc = (p.seoDescription || p.excerpt || undefined)?.slice(0, 160);
  const t = p.seoTitle || p.title;
  return {
    title: p.seoTitle ? { absolute: p.seoTitle } : p.title,
    description: desc,
    alternates: { canonical: p.canonicalUrl || p.permalink },
    openGraph: {
      title: t,
      description: desc,
      url: p.permalink,
      type: p.type === "post" ? "article" : "website",
      images: p.featuredImage?.url ? [{ url: p.featuredImage.url }] : undefined,
      publishedTime: p.publishedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: desc,
      images: p.featuredImage?.url ? [p.featuredImage.url] : undefined,
    },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);

  if (r.kind === "redirect") {
    redirect(r.redirect.to);
  }
  if (r.kind !== "post") {
    notFound();
  }

  const p = r.post;
  const datePretty = p.publishedAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const kindLabel =
    p.type === "post" ? "Article" : p.type === "page" ? "Page" : p.type;

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: p.title }]}
        pillLabel={kindLabel}
        pillBody={
          p.type === "post"
            ? `${datePretty}${p.readingTime > 0 ? ` · ${p.readingTime} min read` : ""}`
            : undefined
        }
        title={<>{p.title}</>}
        subhead={p.excerpt || undefined}
      >
      </PageHero>

      {p.featuredImage?.url && (
        <div className="container">
          <div className="article-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} decoding="async" fetchPriority="high" />
          </div>
        </div>
      )}

      <article className="article-shell">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: renderWpContent(p.content) }}
        />

        {p.categories.length > 0 || p.tags.length > 0 ? (
          <footer className="article-footer">
            {p.categories.length > 0 && (
              <div className="article-cats">
                {p.categories.map((pc) => (
                  <a key={pc.categoryId} href={`/category/${pc.category.slug}/`} className="chip">
                    {pc.category.name}
                  </a>
                ))}
              </div>
            )}
            {p.tags.length > 0 && (
              <div className="article-tags">
                {p.tags.map((pt) => (
                  <a key={pt.tagId} href={`/tag/${pt.tag.slug}/`} className="chip chip-sm">
                    #{pt.tag.name}
                  </a>
                ))}
              </div>
            )}
          </footer>
        ) : null}
      </article>
    </main>
  );
}

// Pre-render published posts at build time
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", type: { in: ["post", "page"] } },
    select: { permalink: true },
  });
  return posts
    .map((p) => {
      const trimmed = p.permalink.replace(/^\/|\/$/g, "");
      if (!trimmed) return null;
      return { slug: trimmed.split("/") };
    })
    .filter((x): x is { slug: string[] } => x !== null);
}

export const dynamicParams = true; // allow on-demand for new posts
export const revalidate = 600;
