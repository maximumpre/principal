import { SITE_KEYWORDS } from "@/lib/seo-keywords"
import { SITE_DISPLAY_NAME, SITE_HOMEPAGE_CANONICAL, SITE_ORIGIN } from "@/lib/site-url"

const TITLE = "Principal Financial Sign-In | Retirement & Benefits"
const DESCRIPTION =
  "Sign in to your Principal retirement account — secure participant access to 401(k), 403(b) and workplace benefits."
const OG_IMAGE = new URL("/og-image.png", SITE_HOMEPAGE_CANONICAL).href

/**
 * Head elements for the crawler branch. React 19 hoists these into <head>.
 * Delivers title, og:site_name, canonical, and favicon signals to search bots.
 */
export function CrawlerSeoHead() {
  return (
    <>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content={SITE_KEYWORDS.join(",")} />
      <meta name="application-name" content={SITE_DISPLAY_NAME} />
      <meta name="author" content="Principal Financial" />
      <meta name="robots" content="index, follow" />
      <meta
        name="googlebot"
        content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
      />
      <link rel="canonical" href={SITE_HOMEPAGE_CANONICAL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={SITE_HOMEPAGE_CANONICAL} />
      <meta property="og:site_name" content={SITE_DISPLAY_NAME} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={TITLE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/icon-48x48.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  )
}
