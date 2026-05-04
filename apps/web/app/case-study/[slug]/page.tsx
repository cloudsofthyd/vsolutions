import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCaseStudy(slug: string) {
  return prisma.post.findFirst({
    where: { type: "case-study", slug, status: "PUBLISHED" },
    include: { featuredImage: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return { title: "Case study not found" };
  const desc = (cs.seoDescription || cs.excerpt || undefined)?.slice(0, 160);
  const ogImg = cs.featuredImage?.url || cs.ogImage || undefined;
  return {
    title: cs.seoTitle ? { absolute: cs.seoTitle } : cs.title,
    description: desc,
    alternates: { canonical: cs.canonicalUrl || `/case-study/${slug}/` },
    openGraph: ogImg ? { images: [ogImg] } : undefined,
  };
}

export async function generateStaticParams() {
  const studies = await prisma.post.findMany({
    where: { type: "case-study", status: "PUBLISHED" },
    select: { slug: true },
  });
  return studies.map((s) => ({ slug: s.slug }));
}

export const revalidate = 600;

export default async function CaseStudyDetail({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-study/" },
          { label: cs.csClient || "Study" },
        ]}
        pillLabel="Case Study"
        pillBody={cs.csIndustry || "Real client outcome"}
        title={<>{cs.title}</>}
        subhead={cs.excerpt || undefined}
      />

      {cs.featuredImage?.url && (
        <div className="container">
          <div className="article-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cs.featuredImage.url}
              alt={cs.featuredImage.altText || cs.title}
            />
          </div>
        </div>
      )}

      <article className="article-shell">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: renderWpContent(cs.content) }}
        />
        <div className="article-footer">
          <Link href="/case-study/" className="chip">
            ← Back to all case studies
          </Link>
        </div>
      </article>
    </main>
  );
}
