import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const CANONICAL_LOGIN_URL =
  "https://accounts.principal.com/app/bookmark/0oadm2qe1orihoKba5d7/login";
const SITE_DOMAIN = "accounts.principal.com";
const SITE_BRAND = "Principal";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || CANONICAL_LOGIN_URL,
  ),
  title: {
    default: "Principal Account Login",
    template: "%s | Principal",
  },
  keywords: [
    "Principal account login",
    "Principal Financial Group login",
    "accounts.principal.com",
    "Principal retirement account",
    "Principal insurance account",
    "Principal employer benefits login",
    "Principal participant login",
    "Principal online account access",
    "Principal retirement login",
    "Principal benefits login",
    "Principal account access",
    "Principal financial services",
  ],
  description: `${SITE_BRAND} - ${SITE_DOMAIN}. Sign in securely to access your Principal account, retirement information, insurance, and benefits.`,

  authors: [{ name: "Principal" }],
  creator: "Principal",
  publisher: "Principal",
  applicationName: SITE_BRAND,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Principal Account Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Sign in securely to access your Principal account and financial information.`,
    siteName: SITE_BRAND,
    url: CANONICAL_LOGIN_URL,
    images: [
      {
        url: "/1785580680466_image.webp",
        width: 32,
        height: 32,
        alt: `${SITE_BRAND}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Principal Account Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Sign in securely to access your Principal account and financial information.`,
    images: ["1785580680466_image.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#0878bd",
  category: "Business",
  alternates: {
    canonical: CANONICAL_LOGIN_URL,
    languages: {
      "en-US": CANONICAL_LOGIN_URL,
    },
  },
  other: {
    "geo.region": "US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_BRAND,
  url: CANONICAL_LOGIN_URL,
  description:
    "Principal account sign in portal. Securely access your Principal retirement, insurance, and benefits information.",
  publisher: {
    "@type": "Organization",
    name: "Principal",
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", url: CANONICAL_LOGIN_URL },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
