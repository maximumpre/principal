import type { Metadata } from "next";
import Script from "next/script";
import { SeoJsonLd } from "@/components/seo-json-ld";
import ProtectedLayout from "@/components/protected-layout";
import { SITE_KEYWORDS } from "@/lib/seo-keywords";
import { SITE_DISPLAY_NAME, SITE_HOMEPAGE_CANONICAL, SITE_ORIGIN } from "@/lib/site-url";
import { LAYOUT_DESCRIPTION } from "@/lib/meta-description";
import { INDEXABLE_PAGE_ROBOTS } from "@/lib/seo-robots-metadata";
import "./globals.css";

const OG_IMAGE = new URL("/og-image.png", SITE_HOMEPAGE_CANONICAL).href;

const SITE_NAME = SITE_DISPLAY_NAME;
const TITLE = `Retirement Account Sign-In | ${SITE_DISPLAY_NAME}`;
const DESCRIPTION = LAYOUT_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  alternates: { canonical: SITE_HOMEPAGE_CANONICAL },
  title: {
    default: TITLE,
    template: `%s | ${SITE_DISPLAY_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Principal Financial" }],
  creator: "Principal Financial",
  publisher: "Principal Financial",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: INDEXABLE_PAGE_ROBOTS,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_HOMEPAGE_CANONICAL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    "msapplication-TileImage": "/icon-48x48.png",
    "msapplication-TileColor": "#1c68bf",
  },
};

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SeoJsonLd />
        <link
          rel="stylesheet"
          href="https://ok12static.oktacdn.com/assets/js/sdk/okta-sign-in-widget/7.45.2/css/okta-sign-in.min.css"
          crossOrigin="anonymous"
        />
        <link
          href="https://credentials.principal.com/static-assets/pcom/style/login.min.css"
          rel="stylesheet"
        />
        <link
          href="https://credentials.principal.com/static-assets/pcom/style/pds-styles.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProtectedLayout>{children}</ProtectedLayout>
        <Script
          src="https://credentials.principal.com/static-assets/pcom/js/pds.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://credentials.principal.com/static-assets/pcom/js/login.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
