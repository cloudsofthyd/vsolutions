import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import { DB_SLUG_TO_KEY, SERVICES, type ServiceKey } from "@/lib/services-data";
import { serviceLd, breadcrumbLd, faqLd, jsonLd } from "@/lib/seo";
import "@/components/site/services-showcase.css";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  return prisma.post.findFirst({
    where: { type: "service", slug, status: "PUBLISHED" },
    include: { featuredImage: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  const key = DB_SLUG_TO_KEY[slug];
  const showcase = key ? SERVICES[key] : null;
  const title = s?.seoTitle || s?.title || showcase?.name || "Service";
  const description =
    s?.seoDescription || s?.excerpt || showcase?.subhead || undefined;
  return {
    title,
    description,
    alternates: { canonical: s?.canonicalUrl || `/service/${slug}/` },
    openGraph: {
      title,
      description,
      url: `/service/${slug}/`,
      type: "website",
      images: s?.featuredImage?.url ? [{ url: s.featuredImage.url }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const services = await prisma.post.findMany({
    where: { type: "service", status: "PUBLISHED" },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export const revalidate = 600;

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const key = DB_SLUG_TO_KEY[slug] as ServiceKey | undefined;

  // Unknown slug → 404
  if (!key) {
    const s = await getService(slug);
    if (!s) notFound();
    notFound();
  }

  const showcase = SERVICES[key];
  const ldBlocks = [
    breadcrumbLd([
      { name: "Home", url: "/" },
      { name: "Services", url: "/service-overview/" },
      { name: showcase.name, url: `/service/${slug}/` },
    ]),
    serviceLd({
      name: showcase.name,
      description: showcase.subhead,
      permalink: `/service/${slug}/`,
      serviceType: showcase.name,
    }),
    ...(Array.isArray((showcase as { faqs?: Array<{ q: string; a: string }> }).faqs) &&
    (showcase as { faqs?: Array<{ q: string; a: string }> }).faqs!.length > 0
      ? [faqLd((showcase as { faqs: Array<{ q: string; a: string }> }).faqs)]
      : []),
  ];

  return (
    <>
      {ldBlocks.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
        />
      ))}
      <ServicesShowcase initialSlug={key} />
    </>
  );
}
