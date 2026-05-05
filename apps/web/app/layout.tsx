import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import "./auth.css";
import "./premium.css";
import { Announce } from "@/components/site/Announce";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Decorations } from "@/components/site/Decorations";
import { SiteScripts } from "@/components/site/SiteScripts";
import { SITE } from "@/lib/site";
import { organizationLd, websiteLd, localBusinessLd, jsonLd } from "@/lib/seo";

// Paths that render their own shell (sidebar/header) and must NOT inherit public chrome.
function isAppPath(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/portal");
}

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vsolutionsinc.com"),
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: "https://vsolutionsinc.com" }],
  generator: "Next.js",
  keywords: [
    "AI consulting",
    "Cloud DevOps services",
    "Cybersecurity",
    "Mobile app development",
    "Web development",
    "Digital marketing agency",
    "VDI Citrix",
    "Site Reliability Engineering",
    "Custom software development",
    "Enterprise software",
    "Digital transformation",
    "Troy Michigan",
    "USA technology consulting",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vsolutionsinc.com",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Vsolutionsinc",
    creator: "@Vsolutionsinc",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  // Search-console verification — fill in tokens once you claim the property.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E1B3A",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";
  const appShell = isAppPath(pathname);

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        {/* Geo-targeting USA — secondary signal alongside hreflang en-US */}
        <meta name="geo.region" content="US-MI" />
        <meta name="geo.placename" content="Troy, Michigan" />
        <meta name="geo.position" content="42.5803;-83.1499" />
        <meta name="ICBM" content="42.5803, -83.1499" />
        <meta name="format-detection" content="telephone=yes,address=no,email=no" />

        {/* Critical asset preload */}
        <link
          rel="preload"
          as="image"
          href="/uploads/2026/03/vsolutions-final.svg"
          type="image/svg+xml"
          fetchPriority="high"
        />

        {/* Resource hints — prefetch likely-next-hop origins */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Sitewide JSON-LD — Organization + WebSite + LocalBusiness */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteLd()) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessLd()) }}
        />

        {/* Google tag (gtag.js) — Google Ads AW-18126408102 */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18126408102"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18126408102');
          `}
        </Script>
      </head>
      <body>
        {appShell ? (
          children
        ) : (
          <>
            <Decorations />
            <Announce />
            <Header />
            {children}
            <Footer />
            <SiteScripts />
          </>
        )}
      </body>
    </html>
  );
}
