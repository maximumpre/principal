import { SITE_DESCRIPTION } from "@/lib/seo-metadata"
import {
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
} from "@/lib/site-url"

/** Knowledge Graph entity links for Principal Financial Group (NYSE/Nasdaq: PFG). */
export const ORGANIZATION_SAME_AS: readonly string[] = [
  "https://www.wikidata.org/wiki/Q3403513",
  "https://en.wikipedia.org/wiki/Principal_Financial_Group",
  "https://www.principal.com/",
  "https://www.nasdaq.com/market-activity/stocks/pfg",
]

/** Brand phrases only — never raw hostnames (Google Site Name fallback trap). */
function buildAlternateNames(): string[] {
  return [
    `${SITE_DISPLAY_NAME} Login`,
    `${SITE_DISPLAY_NAME} Portal`,
    "Principal Financial",
    "Principal Financial Group",
    SITE_DISPLAY_NAME,
  ]
}

export function SeoJsonLd() {
  const websiteId = `${SITE_HOMEPAGE_CANONICAL}#website`
  const organizationId = `${SITE_ORIGIN}/#organization`
  const breadcrumbId = `${SITE_HOMEPAGE_CANONICAL}#breadcrumb`

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_DISPLAY_NAME,
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/og-image.png`,
      width: 1200,
      height: 630,
    },
    sameAs: [...ORGANIZATION_SAME_AS],
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_DISPLAY_NAME,
        alternateName: buildAlternateNames(),
        url: SITE_HOMEPAGE_CANONICAL,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
        potentialAction: {
          "@type": "LoginAction",
          target: {
            "@type": "EntryPoint",
            url: SITE_HOMEPAGE_CANONICAL,
          },
          name: `Sign in to ${SITE_DISPLAY_NAME}`,
        },
      },
      organization,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_HOMEPAGE_CANONICAL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sign In",
            item: SITE_HOMEPAGE_CANONICAL,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
