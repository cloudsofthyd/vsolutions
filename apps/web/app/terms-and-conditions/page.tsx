import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const p = await prisma.post.findFirst({
    where: { slug: "terms-and-conditions", type: "page", status: "PUBLISHED" },
  });
  const desc = (p?.seoDescription || p?.excerpt || undefined)?.slice(0, 160);
  return {
    title: p?.seoTitle ? { absolute: p.seoTitle } : "Terms and Conditions",
    description: desc,
    alternates: { canonical: "/terms-and-conditions/" },
  };
}

export default async function Page() {
  const p = await prisma.post.findFirst({
    where: { slug: "terms-and-conditions", type: "page", status: "PUBLISHED" },
  });
  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        pillLabel="Legal"
        pillBody="Working with V Solutions"
        title={
          <>
            Terms &amp; <em>Conditions.</em>
          </>
        }
        subhead={p?.excerpt || "The plain-English ground rules for our engagements."}
      />
      {p?.content && (
        <article className="article-shell">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: renderWpContent(p.content) }}
          />
        </article>
      )}
    </main>
  );
}
