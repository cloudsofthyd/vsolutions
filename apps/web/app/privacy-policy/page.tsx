import { prisma } from "@vsi/db";
import { renderWpContent } from "@/lib/wp-content";
import { PageHero } from "@/components/site/PageHero";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const p = await prisma.post.findFirst({
    where: { slug: "privacy-policy", type: "page", status: "PUBLISHED" },
  });
  const desc = (p?.seoDescription || p?.excerpt || undefined)?.slice(0, 160);
  return {
    title: p?.seoTitle ? { absolute: p.seoTitle } : "Privacy Policy",
    description: desc,
    alternates: { canonical: "/privacy-policy/" },
  };
}

export default async function Page() {
  const p = await prisma.post.findFirst({
    where: { slug: "privacy-policy", type: "page", status: "PUBLISHED" },
  });
  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        pillLabel="Legal"
        pillBody="How we handle your data"
        title={
          <>
            Privacy <em>Policy.</em>
          </>
        }
        subhead={p?.excerpt || "Your data, handled with care and transparency."}
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
