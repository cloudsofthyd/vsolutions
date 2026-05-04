import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
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
    images: ["/og-default.png"],
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
        <link
          rel="preload"
          as="image"
          href="/uploads/2026/03/vsolutions-final.svg"
          type="image/svg+xml"
          fetchPriority="high"
        />
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
