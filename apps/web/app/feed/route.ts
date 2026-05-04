// RSS 2.0 feed of latest blog posts. Mirrors WP's /feed/ behavior.

import { prisma } from "@vsi/db";
import { SITE } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { type: "post", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: { select: { displayName: true, username: true } } },
  });

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${p.permalink}`;
      const author =
        p.author?.displayName || p.author?.username || "admin";
      const description = p.excerpt
        ? escapeXml(p.excerpt)
        : escapeXml(p.content.slice(0, 400).replace(/<[^>]+>/g, ""));
      return `<item>
  <title>${escapeXml(p.title)}</title>
  <link>${url}</link>
  <pubDate>${p.publishedAt.toUTCString()}</pubDate>
  <dc:creator><![CDATA[${author}]]></dc:creator>
  <guid isPermaLink="true">${url}</guid>
  <description><![CDATA[${description}]]></description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(SITE.name)}</title>
  <atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml" />
  <link>${SITE_URL}/</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en-US</language>
  <generator>Next.js</generator>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
