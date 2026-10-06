import { cookies, headers } from "next/headers"
import type { Metadata } from "next";
import Script from "next/script";
import { SeoJsonLd } from "@/components/seo-json-ld";
import ProtectedLayout from "@/components/protected-layout";
import { SITE_KEYWORDS } from "@/lib/seo-keywords";
import { SITE_DISPLAY_NAME, SITE_HOMEPAGE_CANONICAL, SITE_ORIGIN } from "@/lib/site-url";
import { LAYOUT_DESCRIPTION } from "@/lib/meta-description";
import "./globals.css";
import CrawlerSeoPage from "@/components/CrawlerSeoPage"
import { isSearchCrawlerUA } from "@/lib/bot-detection"
import { isCrawlerSeoPreviewUnlocked } from "@/lib/crawler-seo-preview"
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths"

const OG_IMAGE = new URL("/og-image.png", SITE_HOMEPAGE_CANONICAL).href;

const SITE_NAME = "Principal";
const TITLE = "Principal Financial Sign-In | Retirement & Benefits";
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const cookieStore = await cookies()
  const pathname = headersList.get("x-pathname") || "/"
  const ua =
    headersList.get("user-agent") ||
    headersList.get("x-original-user-agent") ||
    headersList.get("x-forwarded-user-agent") ||
    ""
  // Header/cookie from middleware, or UA+path fallback if custom headers were stripped (GSC bug).
  const isCrawlerSeo =
    isCrawlerSeoPreviewUnlocked() ||
    headersList.get("x-crawler-seo-page") === "1" ||
    cookieStore.get("x-crawler-seo-page")?.value === "1" ||
    (isSearchCrawlerUA(ua) && isSeoCrawlerPath(pathname))

  if (isCrawlerSeo) {
    return (
      <html lang="en">
        <body>
          <SeoJsonLd />
          <CrawlerSeoPage />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
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
        <SeoJsonLd />
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
