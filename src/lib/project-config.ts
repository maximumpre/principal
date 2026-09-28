/** Control Center project id — must match Neon pending_logins.project_id */
export const DEFAULT_PROJECT_ID = "principal-financial"

export const PROJECT_ID = DEFAULT_PROJECT_ID

/**
 * Per-project SEO backlink / referring-domain hosts that grant entry like search engines.
 * Bare hostnames match subdomains (e.g. "linkedin.com" allows www.linkedin.com).
 * Leave empty until you have known backlinks for this site.
 */
export const ALLOWED_BACKLINK_HOSTS: string[] = [
  "principal.com",
  "wayranks.com",
  "ataiva.com",
  "factmags.com",
  "dotiqo.com",
  "domainwork.space",
]

export function getApprovalsUrl(): string {
  const adminUrlBase = (process.env.ADMIN_PORTAL_URL || "").trim()
  if (!adminUrlBase) return "/admin/login"
  return adminUrlBase
    .replace(/\/+$/, "")
    .replace(/\/admin\/login.*$/i, "")
    .replace(/\?.*$/, "")
}
