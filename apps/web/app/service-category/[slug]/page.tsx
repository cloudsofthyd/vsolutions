import type { Metadata } from "next";
import { TaxonomyArchive, buildTaxonomyMetadata } from "@/lib/taxonomy-archive";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildTaxonomyMetadata(slug, "service-category", "Service Category");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <TaxonomyArchive
      slug={slug}
      taxonomy="service-category"
      postType="service"
      label="Services"
    />
  );
}
