import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Insights, technical deep dives, and best practices from V Solutions Inc — covering AI, cloud, DevOps, cybersecurity, and digital marketing.",
  alternates: { canonical: "/blog-insights/" },
};

export const revalidate = 300;

function formatDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { type: "post", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      featuredImage: true,
      author: { select: { username: true, displayName: true } },
    },
  });

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog & Insights" }]}
        pillLabel="Resources"
        pillBody={`${posts.length} ${posts.length === 1 ? "story" : "stories"} from the team`}
        title={
          <>
            Blog &amp; <em>Insights.</em>
          </>
        }
        subhead="Technical deep dives and strategy from the V Solutions team."
        lede="Practical playbooks on AI, cloud, DevOps, cybersecurity, and digital marketing — written by the engineers and strategists shipping the work."
      />

      <section className="sec">
        <div className="container">
          {posts.length === 0 ? (
            <p>No posts yet — check back soon.</p>
          ) : (
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
                    <div className="post-meta">
                      <span>{formatDate(p.publishedAt)}</span>
                    </div>
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
