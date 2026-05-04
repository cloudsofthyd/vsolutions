import type { Metadata } from "next";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import "@/components/site/services-showcase.css";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Services | AI, Cloud, Web, Mobile, Cybersecurity & More",
  description:
    "Explore V Solutions services — AI, Cloud DevOps & SRE, Cybersecurity, Web Development, Mobile Apps, Digital Marketing, Content Writing, and VDI.",
  alternates: { canonical: "/service-overview/" },
};

export default function Page() {
  return <ServicesShowcase />;
}
