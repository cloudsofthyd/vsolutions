import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing & Plans | Transparent Service Costs",
  description:
    "Transparent starting prices with fully customized solutions. Digital Marketing, Web Development, AI, Cloud, Cybersecurity & more. Free consultation included.",
  alternates: { canonical: "/pricing/" },
};

export default function Page() {
  return (
    <main className="page-main">
      <PricingClient />
    </main>
  );
}
