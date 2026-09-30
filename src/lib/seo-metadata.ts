/**
 * Single source for layout metadata and CrawlerSeoPage.
 */

import { CANONICAL_HOST, SITE_DISPLAY_NAME } from "@/lib/site-url"
import { SITE_KEYWORDS } from "./seo-keywords"
export const SITE_TITLE = `${SITE_DISPLAY_NAME} Financial Sign-In | Retirement & Benefits`

export const SITE_DESCRIPTION =
  "Sign in to your Principal retirement account — secure participant access to 401(k), 403(b) and workplace benefits."

export { SITE_KEYWORDS } from "./seo-keywords"

const VISIBLE_HOST_TOKENS = [
  CANONICAL_HOST.toLowerCase(),
  CANONICAL_HOST.replace(/^www\./, "").toLowerCase(),
]

/**
 * Body-safe keywords for the visible `Related searches: …` crawler body block.
 * Raw domain tokens stay in `<meta name="keywords">` only — Yandex still reads
 * meta keywords; a domain in visible body copy reads as stuffing to Google/Bing.
 */
export function buildVisibleKeywords(): string[] {
  return SITE_KEYWORDS.filter((k) => !VISIBLE_HOST_TOKENS.some((h) => k.toLowerCase().includes(h)))
}

export const SITE_VISIBLE_KEYWORDS = buildVisibleKeywords()
