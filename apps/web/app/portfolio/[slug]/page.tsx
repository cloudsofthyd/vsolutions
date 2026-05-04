import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPortfolio(slug: string) {
  return prisma.post.findFirst({
    where: { type: "portfolio", slug, status: "PUBLISHED" },
    include: { featuredImage: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPortfolio(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt || undefined,
    alternates: { canonical: p.canonicalUrl || `/portfolio/${slug}/` },
  };
}

export async function generateStaticParams() {
  const items = await prisma.post.findMany({
    where: { type: "portfolio", status: "PUBLISHED" },
    select: { slug: true },
  });
  return items.map((i) => ({ slug: i.slug }));
}

export const revalidate = 600;

export default async function PortfolioDetail({ params }: Props) {
  const { slug } = await params;
  const p = await getPortfolio(slug);
  if (!p) notFound();

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio/" },
          { label: p.title },
        ]}
        pillLabel="Project"
        pillBody="Selected work"
        title={<>{p.title}</>}
        subhead={p.excerpt || undefined}
      />
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
        <div className="article-footer">
          <Link href="/portfolio/" className="chip">
            ← Back to portfolio
          </Link>
        </div>
      </article>
    </main>
  );
}
