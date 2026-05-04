import type { Metadata } from "next";
import { TaxonomyArchive, buildTaxonomyMetadata } from "@/lib/taxonomy-archive";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildTaxonomyMetadata(slug, "case-study-category", "Case Study Category");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <TaxonomyArchive
      slug={slug}
      taxonomy="case-study-category"
      postType="case-study"
      label="Case Studies"
    />
  );
}
