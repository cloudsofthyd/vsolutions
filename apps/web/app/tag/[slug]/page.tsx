import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTag(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          post: { include: { featuredImage: true } },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTag(slug);
  if (!t) return { title: "Tag not found" };
  return {
    title: `#${t.name} — Tag`,
    alternates: { canonical: `/tag/${slug}/` },
  };
}

export const revalidate = 600;

export default async function TagArchive({ params }: Props) {
  const { slug } = await params;
  const t = await getTag(slug);
  if (!t) notFound();

  const posts = t.posts
    .map((pt) => pt.post)
    .filter((p) => p.status === "PUBLISHED")
    .sort((a, b) => +b.publishedAt - +a.publishedAt);

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog & Insights", href: "/blog-insights/" },
          { label: `#${t.name}` },
        ]}
        pillLabel="Tag"
        pillBody={`${posts.length} ${posts.length === 1 ? "post" : "posts"} tagged`}
        title={<>#{t.name}</>}
        subhead={`Everything we've published tagged with #${t.name}.`}
      />
      <section className="sec">
        <div className="container">
          <div className="blog-grid">
            {posts.map((p) => (
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
