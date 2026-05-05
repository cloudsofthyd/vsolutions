// Bulk re-submit every published URL to Bing Webmaster Tools.
// Authentication: x-admin-token header must match SEO_ADMIN_TOKEN env var.
//
// Use cases:
//   • Nightly cron from EC2 (systemd timer) keeps Bing's index fresh
//   • Manual trigger after major content updates
//   • Auto-fire from future admin "Publish post" flow (call submitUrlToBing
//     directly with the new permalink — see lib/bing-submit.ts)

import { NextResponse } from "next/server";
import { prisma } from "@vsi/db";
import { submitUrlsToBing, getBingQuota } from "@/lib/bing-submit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const expected = process.env.SEO_ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "SEO_ADMIN_TOKEN not configured on server" },
      { status: 503 },
    );
  }
  const provided = req.headers.get("x-admin-token");
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Optional: caller can pass { urls: [...] } to submit a specific list.
  // Otherwise we'll resubmit every URL in the sitemap.
  let body: { urls?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }

  let urlList: string[] = [];

  if (Array.isArray(body.urls) && body.urls.length > 0) {
    urlList = body.urls.filter((u) => typeof u === "string" && u.startsWith("http"));
  } else {
    // Build the same set the sitemap exposes
    const STATIC_PAGES = [
      "/",
      "/about-v-solutions-inc/",
      "/about-v-solutions-inc/v-framework/",
      "/how-we-work/",
      "/service-overview/",
      "/case-study/",
      "/careers/",
      "/pricing/",
      "/contact/",
      "/blog-insights/",
      "/terms-and-conditions/",
      "/privacy-policy/",
      "/cookie-policy-v-solutions-inc/",
    ];
    const [posts, categories, tags] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          type: { in: ["post", "page", "service", "case-study", "portfolio"] },
        },
        select: { permalink: true },
      }),
      prisma.category.findMany({ select: { slug: true, taxonomy: true, count: true } }),
      prisma.tag.findMany({ select: { slug: true, count: true } }),
    ]);
    urlList = [
      ...STATIC_PAGES.map((p) => `${SITE_URL}${p}`),
      ...posts.map((p) => `${SITE_URL}${p.permalink}`),
      ...categories
        .filter((c) => c.count > 0 && c.taxonomy === "category")
        .map((c) => `${SITE_URL}/category/${c.slug}/`),
      ...tags.filter((t) => t.count > 0).map((t) => `${SITE_URL}/tag/${t.slug}/`),
    ];
  }

  const result = await submitUrlsToBing(urlList);
  const quota = await getBingQuota();

  return NextResponse.json({
    requestedUrls: urlList.length,
    ...result,
    quota: quota.ok ? { daily: quota.daily, monthly: quota.monthly } : null,
    ts: new Date().toISOString(),
  });
}
