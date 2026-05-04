import Link from "next/link";
import { prisma } from "@vsi/db";

function formatDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export async function LatestBlog({ limit = 6 }: { limit?: number }) {
  const posts = await prisma.post.findMany({
    where: { type: "post", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { featuredImage: true, author: { select: { username: true, displayName: true } } },
  });

  if (posts.length === 0) return null;

  return (
    <section className="sec fade-up">
      <div className="container">
        <div className="sec-head">
          <div className="sec-eyebrow">Latest Blog</div>
          <h2 className="sec-title">
            We&apos;re here to share story &amp; more news from{" "}
            <em>resource library.</em>
          </h2>
        </div>

        <div className="blog-grid">
          {posts.map((p) => {
            const img = p.featuredImage?.url || p.ogImage || "/uploads/2026/01/cloud-integration-2026-devops-digital-marketing-372x256.jpg";
            return (
              <Link key={p.id} href={p.permalink} className="post-card">
                <div className="post-thumb">
                  <div
                    className="post-img"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span>{formatDate(p.publishedAt)}</span>
                  </div>
                  <h3 className="post-title">{p.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
