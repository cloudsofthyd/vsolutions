import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@vsi/db";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import { DB_SLUG_TO_KEY, SERVICES, type ServiceKey } from "@/lib/services-data";
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

  return <ServicesShowcase initialSlug={key} />;
}
