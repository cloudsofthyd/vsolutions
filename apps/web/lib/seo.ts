// Centralized SEO helpers — JSON-LD structured data for Google/Bing rich results.
// Each generator returns a script-tag-ready string of valid schema.org JSON-LD.

import { SITE } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

// Organization (sitewide)
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE.name,
    legalName: "V Solutions Inc",
    alternateName: ["V Solutions", "VSolutions Inc", "VSolutions"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/uploads/2026/03/vsolutions-final.svg`,
      width: 1120,
      height: 240,
    },
    description: SITE.description,
    foundingDate: "2022",
    email: SITE.email,
    telephone: `+1${SITE.phone.replace(/\D/g, "")}`,
    address: SITE.offices.map((o) => ({
      "@type": "PostalAddress",
      streetAddress: o.lines[0],
      addressLocality: o.city.split(",")[0].trim(),
      addressRegion: o.city.split(",")[1]?.trim(),
      postalCode: o.lines[o.lines.length - 1].match(/\b\d{5,6}\b/)?.[0],
      addressCountry: o.country === "United States" ? "US" : "IN",
    })),
    sameAs: ([SITE.social.linkedin, SITE.social.x] as string[]).filter(
      (s) => Boolean(s) && s.startsWith("http"),
    ),
    knowsAbout: [
      "Artificial Intelligence",
      "Cloud Computing",
      "DevOps",
      "Cybersecurity",
      "Mobile Application Development",
      "Web Development",
      "Digital Marketing",
      "Search Engine Optimization",
      "Virtual Desktop Infrastructure",
      "Site Reliability Engineering",
    ],
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "North America" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+1${SITE.phone.replace(/\D/g, "")}`,
        contactType: "customer service",
        email: SITE.email,
        areaServed: ["US", "IN"],
        availableLanguage: ["English"],
      },
    ],
  };
}

// Website (sitewide)
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// LocalBusiness (US HQ — boosts US local SEO)
export function localBusinessLd() {
  const us = SITE.offices.find((o) => o.country === "United States") ?? SITE.offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#local-business`,
    name: SITE.name,
    image: `${SITE_URL}/uploads/2026/03/vsolutions-final.svg`,
    url: SITE_URL,
    telephone: us.phoneHref?.replace("tel:", "") ?? `+1${SITE.phone.replace(/\D/g, "")}`,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: us.lines[0],
      addressLocality: us.city.split(",")[0].trim(),
      addressRegion: us.city.split(",")[1]?.trim() || "Michigan",
      postalCode: us.lines[us.lines.length - 1].match(/\b\d{5}\b/)?.[0],
      addressCountry: "US",
    },
    geo: us.coords
      ? {
          "@type": "GeoCoordinates",
          latitude: us.coords.lat,
          longitude: us.coords.lng,
        }
      : undefined,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$$",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "AdministrativeArea", name: "Michigan" },
      { "@type": "City", name: "Detroit" },
      { "@type": "City", name: "Troy" },
      { "@type": "City", name: "Chicago" },
      { "@type": "City", name: "New York" },
      { "@type": "City", name: "Los Angeles" },
      { "@type": "City", name: "Atlanta" },
    ],
  };
}

// Breadcrumb (per page)
export function breadcrumbLd(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      ...(b.url ? { item: b.url.startsWith("http") ? b.url : `${SITE_URL}${b.url}` } : {}),
    })),
  };
}

// Article (single blog post)
export function articleLd(post: {
  title: string;
  excerpt?: string | null;
  permalink: string;
  publishedAt: Date;
  updatedAt: Date;
  authorName?: string | null;
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.imageUrl ?? `${SITE_URL}/og-default.png`,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${post.permalink}`,
    },
    inLanguage: "en-US",
  };
}

// Service (service detail page)
export function serviceLd(opts: {
  name: string;
  description?: string;
  permalink: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType ?? opts.name,
    url: `${SITE_URL}${opts.permalink}`,
    provider: { "@id": `${SITE_URL}#organization` },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "India" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Mid-market and enterprise businesses",
    },
  };
}

// FAQPage (use on pages with Q&A blocks)
export function faqLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Helper to render JSON-LD as a script tag string in a server component
export function jsonLd(data: object | object[]) {
  // Strip undefined keys recursively (schema.org validators don't like them)
  const clean = JSON.parse(JSON.stringify(data));
  return JSON.stringify(clean);
}
