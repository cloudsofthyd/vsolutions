import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers at V Solutions | Remote-Friendly Roles",
  description:
    "Join our team of designers, developers, marketers, and AI specialists. Remote-friendly, flexible hours, real ownership of projects. View open roles and apply today.",
  alternates: { canonical: "/careers/" },
};

export default function Page() {
  return (
    <main className="page-main">
      <CareersClient />
    </main>
  );
}
