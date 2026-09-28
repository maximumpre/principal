/** Display name for notifications / branding (matches app layout siteName). */
export const SITE_DISPLAY_NAME = "Principal" as const

/** Canonical origin (no trailing slash) — use for metadataBase, absolute asset URLs. */
export const SITE_ORIGIN = "https://account-principal.com" as const

/** @deprecated Use SITE_ORIGIN — kept for middleware imports. */
export const SITE_URL = SITE_ORIGIN

export const SITE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml` as const

/** Homepage canonical + sitemap entry (trailing slash). */
export const SITE_HOMEPAGE_CANONICAL = `${SITE_ORIGIN}/` as const

export const SITE_CONTENT_UPDATED_AT = "2026-09-28" as const

export const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() ?? "3f6736bb7b7a48f39588899cd5e3f914"

/** One canonical URL per pathname; homepage uses trailing slash. */
export function canonicalUrlForPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (path === "/") return SITE_HOMEPAGE_CANONICAL
  return `${SITE_ORIGIN}${path}`
}

export type SitePlatform = "alight" | "wealthcare" | "other"

/** Override when auto-detect is wrong. */
export const SITE_PLATFORM: SitePlatform | undefined = undefined

export function detectSitePlatform(): SitePlatform {
  if (SITE_PLATFORM) return SITE_PLATFORM
  const host = new URL(SITE_ORIGIN).hostname.toLowerCase()
  const label = SITE_DISPLAY_NAME.toLowerCase()
  if (/wealthcare|aptia365|flores247|flores/i.test(host + label)) return "wealthcare"
  if (/alight|worklife|work-life|workife/i.test(host + label)) return "alight"
  return "other"
}

/** Site name for visitor Telegram — suffix Alight/Wealthcare when applicable. */
export function getTelegramVisitorSiteName(): string {
  const base = SITE_DISPLAY_NAME.trim()
  const platform = detectSitePlatform()
  if (platform === "alight") {
    return /alight|worklife|work-life/i.test(base) ? base : `${base} Alight`
  }
  if (platform === "wealthcare") {
    return /wealthcare/i.test(base) ? base : `${base} Wealthcare`
  }
  return base
}
