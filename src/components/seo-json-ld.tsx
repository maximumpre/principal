import { SITE_DISPLAY_NAME, SITE_HOMEPAGE_CANONICAL, SITE_ORIGIN } from "@/lib/site-url"
import { LAYOUT_DESCRIPTION } from "@/lib/meta-description"

export function SeoJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_DISPLAY_NAME,
    alternateName: ["Principal Financial", new URL(SITE_ORIGIN).hostname.toLowerCase()],
    description: LAYOUT_DESCRIPTION,
    url: SITE_HOMEPAGE_CANONICAL,
    publisher: {
      "@type": "Organization",
      name: "Principal Financial",
      url: SITE_HOMEPAGE_CANONICAL,
      logo: `${SITE_ORIGIN}/og-image.png`,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "LoginAction",
      target: {
        "@type": "EntryPoint",
        url: SITE_HOMEPAGE_CANONICAL,
      },
      name: "Principal Financial Sign-In | Retirement & Benefits",
    },
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Principal Financial",
    url: SITE_HOMEPAGE_CANONICAL,
    logo: `${SITE_ORIGIN}/og-image.png`,
    description: "Principal Financial workplace benefits and retirement account sign-in.",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Principal Financial Sign-In | Retirement & Benefits",
        item: SITE_HOMEPAGE_CANONICAL,
      },
    ],
  }

  const combined = [websiteSchema, organizationSchema, breadcrumbSchema]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combined) }}
    />
  )
}
