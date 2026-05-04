import type { MetadataRoute } from "next";
import { prisma } from "@vsi/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        type: { in: ["post", "page", "service", "case-study", "portfolio"] },
      },
      select: { permalink: true, updatedAt: true, publishedAt: true, type: true },
    }),
    prisma.category.findMany({ select: { slug: true, taxonomy: true, count: true } }),
    prisma.tag.findMany({ select: { slug: true, count: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "/", "/about-v-solutions-inc/", "/about-v-solutions-inc/v-framework/",
    "/how-we-work/", "/service-overview/", "/case-study/", "/careers/",
    "/pricing/", "/contact/", "/blog-insights/",
    "/terms-and-conditions/", "/privacy-policy/", "/cookie-policy-v-solutions-inc/",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1.0 : 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}${p.permalink}`,
    lastModified: p.updatedAt,
    changeFrequency: p.type === "post" ? "weekly" : "monthly",
    priority: p.type === "post" ? 0.7 : 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.count > 0 && c.taxonomy === "category")
    .map((c) => ({
      url: `${SITE_URL}/category/${c.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const tagPages: MetadataRoute.Sitemap = tags
    .filter((t) => t.count > 0)
    .map((t) => ({
      url: `${SITE_URL}/tag/${t.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
