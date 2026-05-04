import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const p = await prisma.post.findFirst({
    where: { slug: "cookie-policy-v-solutions-inc", type: "page", status: "PUBLISHED" },
  });
  const desc = (p?.seoDescription || p?.excerpt || undefined)?.slice(0, 160);
  return {
    title: p?.seoTitle ? { absolute: p.seoTitle } : "Cookie Policy",
    description: desc,
    alternates: { canonical: "/cookie-policy-v-solutions-inc/" },
  };
}

export default async function Page() {
  const p = await prisma.post.findFirst({
    where: { slug: "cookie-policy-v-solutions-inc", type: "page", status: "PUBLISHED" },
  });
  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Cookies" }]}
        pillLabel="Legal"
        pillBody="What we store and why"
        title={
          <>
            Cookie <em>Policy.</em>
          </>
        }
        subhead={p?.excerpt || "How cookies and similar technologies are used on this site."}
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
