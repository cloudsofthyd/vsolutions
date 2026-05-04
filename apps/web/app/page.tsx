import type { Metadata } from "next";
import { HomepageHero, HomepageCta } from "@/components/site/HomepageStatic";
import { LatestBlog } from "@/components/site/LatestBlog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE.defaultTitle },
  description: SITE.description,
  alternates: { canonical: "/" },
};

// Revalidate every 5 minutes — homepage rarely changes but should reflect new blog posts.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HomepageHero />
      <LatestBlog limit={6} />
      <HomepageCta />
    </>
  );
}
