import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: { slug, taxonomy: "category" },
    include: {
      posts: {
        include: {
          post: {
            include: {
              featuredImage: true,
              author: { select: { displayName: true, username: true } },
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) return { title: "Category not found" };
  return {
    title: c.seoTitle || `${c.name} — Blog Category`,
    description: c.seoDescription || `Posts categorized under ${c.name}.`,
    alternates: { canonical: `/category/${slug}/` },
  };
}

export const revalidate = 600;

export default async function CategoryArchive({ params }: Props) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) notFound();

  const visiblePosts = c.posts
    .map((pc) => pc.post)
    .filter((p) => p.status === "PUBLISHED")
    .sort((a, b) => +b.publishedAt - +a.publishedAt);

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog & Insights", href: "/blog-insights/" },
          { label: c.name },
        ]}
        pillLabel="Category"
        pillBody={`${visiblePosts.length} ${visiblePosts.length === 1 ? "post" : "posts"} in this topic`}
        title={
          <>
            <em>{c.name}</em>
          </>
        }
        subhead={c.description || `Posts and insights filed under ${c.name}.`}
      />

      <section className="sec">
        <div className="container">
          <div className="blog-grid">
            {visiblePosts.map((p) => (
              <Link key={p.id} href={p.permalink} className="post-card">
                <div className="post-thumb">
                  <div
                    className="post-img"
                    style={{
                      backgroundImage: `url('${p.featuredImage?.url || "/uploads/2026/01/cloud-integration-2026-devops-digital-marketing-372x256.jpg"}')`,
                    }}
                  />
                </div>
                <div className="post-body">
                  <h3 className="post-title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
