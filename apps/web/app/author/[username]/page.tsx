import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { PageHero } from "@/components/site/PageHero";

interface Props {
  params: Promise<{ username: string }>;
}

async function getAuthor(username: string) {
  return prisma.user.findFirst({
    where: { username },
    include: {
      posts: {
        where: { status: "PUBLISHED", type: { in: ["post", "page"] } },
        orderBy: { publishedAt: "desc" },
        include: { featuredImage: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const u = await getAuthor(username);
  if (!u) return { title: "Author not found" };
  return {
    title: `${u.displayName} — Author`,
    description: u.bio || undefined,
    alternates: { canonical: `/author/${username}/` },
  };
}

export const revalidate = 600;

export default async function AuthorArchive({ params }: Props) {
  const { username } = await params;
  const u = await getAuthor(username);
  if (!u) notFound();

  return (
    <main className="page-main">
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Authors", href: "/blog-insights/" },
          { label: u.displayName },
        ]}
        pillLabel="Author"
        pillBody={`${u.posts.length} ${u.posts.length === 1 ? "post" : "posts"} published`}
        title={
          <>
            {u.displayName.split(" ")[0]}{" "}
            {u.displayName.split(" ").slice(1).length > 0 && (
              <em>{u.displayName.split(" ").slice(1).join(" ")}.</em>
            )}
          </>
        }
        subhead={u.bio || undefined}
      />

      <section className="sec">
        <div className="container">
          <div className="blog-grid">
            {u.posts.map((p) => (
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
