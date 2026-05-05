import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit allow for major search engines (Google, Bing, DuckDuckGo, Yandex,
      // GPTBot for AI training opt-in). Block private routes everywhere.
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
      {
        userAgent: "Slurp", // Yahoo
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
      // Catch-all
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
