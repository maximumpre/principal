import { CANONICAL_HOST, SITE_DISPLAY_NAME } from "@/lib/site-url"

/** Visible H1 for crawler twin / SERP brand consensus (Google site-name point 2). */
export const PAGE_H1_HEADING = SITE_DISPLAY_NAME

function mergeKeywords(...lists: Array<readonly string[]>): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const list of lists) {
    for (const keyword of list) {
      const key = keyword.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      result.push(keyword)
    }
  }
  return result
}

function siteIdentityKeywords(siteName: string, host: string): string[] {
  const bareHost = host.replace(/^www\./, "")
  return [
    siteName,
    `${siteName} login`,
    `${siteName} sign in`,
    `${siteName} account login`,
    host,
    `${host} login`,
    `${host} sign in`,
    bareHost,
    `${bareHost} login`,
    `${bareHost} account login`,
    `${bareHost} index`,
    `${bareHost} search`,
  ]
}

const PRINCIPAL_KEYWORDS = [
  "account-principal.com",
  "account-principal.com login",
  "Principal",
  "Principal Financial",
  "Principal login",
  "Principal sign in",
  "Principal Financial login",
  "Principal credentials login",
  "Principal.com login",
  "Login-Principal",
  "Principal retirement login",
  "Principal 401k",
  "Principal 401(k) login",
  "Principal 403b login",
  "Principal IRA login",
  "Principal investment account",
  "Principal workplace benefits",
  "Principal benefits login",
  "Principal employee login",
  "Principal participant login",
  "Principal plan sponsor login",
  "retirement account sign in",
  "workplace benefits login",
  "401k participant login",
  "403b participant login",
  "retirement plan login",
  "investment account login",
  "employer retirement portal",
  "Principal secure login",
  "Principal username login",
  "Principal password login",
  "Principal forgot password",
  "Principal account access",
  "Principal financial services login",
  "Principal retirement savings",
]

const RESEARCH_KEYWORDS = [
  "principal app login",
  "principal mobile app sign in",
  "principal passkey login",
  "principal face id login",
  "principal authenticator app",
  "principal forgot username",
  "principal account verification failed",
  "verification code not received",
  "principal login not working",
  "can't log into principal account",
  "principal login help",
  "set up principal online account",
  "principal create account",
  "principal 401k balance check",
  "principal participant statement",
  "principal 457b login",
  "log in to principal.com",
]

const INTENT_KEYWORDS = [
  "forgot password",
  "secure login",
  "two step verification",
  "account login",
  "sign in",
  "login",
]

const USER_SUPPLIED_KEYWORDS = [
  "Principal",
  "pricipal login",
  "principal 401k",
  "principal financial",
  "principal financial login",
  "retirment calculator",
  "principal 401k login",
  "p r i n c i p a l",
  "principal Retirement",
  "roth ira",
  "pricipal retirement account",
  "www.principal/welcome.com",
  "www principal com",
  "www principle com",
  "www.principal.com",
  "https www principal com",
  "principal..com",
  "principal website",
  "principal bank principal com",
  "principal agent login",
] as const

const DESTINATION_KEYWORDS = [
  "login.principal.com",
  "login.principal.com login",
  "login.principal.com sign in",
  "principal.com",
  "principal.com login",
  "Principal.com login",
  "Principal.com account",
  "Log in to your account",
  "Forgot username or password",
  "New user? Register here",
  "Verify your identity",
  "verification code",
  "workplace retirement plan",
  "401(k) contributions",
  "401(k) & 403(b) retirement plans",
  "401 (k) & 403 (b) retirement plans",
  "Enroll in your 401(k) or 403(b)",
  "Log in to increase your contributions",
  "retirement wellness planner",
  "retirement wellness planner tool",
  "Principal retirement plans",
  "retirement plan login",
] as const

/** Step 5 2026-10-27 harvest + archetype research — append-only. */
const HARVEST_2026_10_27 = [
  "principal login 401k",
  "principal login dental",
  "principal login 401k sign in",
  "principal login dental provider",
  "principal login employer",
  "principal login retirement",
  "principal login provider",
  "principal login insurance",
  "principal login page",
  "principal login employee",
  "principal login dental insurance",
  "principal login for advisors",
  "principal login phone number",
  "principal login help",
  "principal sign in online",
  "principal log in 401k",
  "principal log in my account",
  "principal log in dental",
  "principal employee login",
  "principal employee login app",
  "principal portal login employee",
  "principal employee benefits",
  "principal employer portal login",
  "principal employer portal",
] as const

/** Astro Hybrid conversion — append-only SERP cluster (do not remove prior lists). */
const ASTRO_HYBRID_2026_10_27 = [
  "Principal Astro landing sign in",
  "Principal participant portal access",
  "Principal retirement search engine login",
  "Principal retirement account search login",
  "account-principal.com secure sign in",
] as const

/** Cluster deepen — Corporate, Benefits, Auth, Workforce, Platform, Self-Service. */
const CLUSTER_DEEPEN_2026_10_27 = [
  "Principal Financial Group",
  "Principal Financial Group login",
  "Nasdaq PFG",
  "Principal Life Insurance",
  "Principal Global Investors",
  "Principal retirement income solutions",
  "Principal defined contribution login",
  "Principal defined benefit pension",
  "Principal 401k contribution rate",
  "Principal employer match 401k",
  "Principal target date fund",
  "Principal rollover IRA",
  "Principal hardship withdrawal",
  "Principal plan loan",
  "Principal beneficiary designation",
  "Principal open enrollment benefits",
  "Principal dental vision ID card",
  "Principal group insurance claims",
  "Principal participant MFA",
  "Principal multi factor authentication",
  "Principal passkey setup",
  "Principal credentials recovery",
  "Principal new user register",
  "Principal retiree account access",
  "Principal former employee 401k",
  "Principal dependent beneficiary portal",
  "Principal plan sponsor access",
  "Principal workforce benefits portal",
  "Principal total rewards login",
  "Principal recordkeeper login",
  "Principal retirement recordkeeper",
  "Principal mobile app balances",
  "Principal app store download",
  "Principal google play app",
  "Principal W-2 tax documents",
  "Principal 1099 R download",
  "Principal direct deposit reimbursement",
  "Principal customer service 800-986-3343",
  "Principal Des Moines benefits login",
  "retirement.individuals.principal.com",
  "credentials.principal.com recovery",
] as const

export const SITE_KEYWORDS = mergeKeywords(
  siteIdentityKeywords(SITE_DISPLAY_NAME, CANONICAL_HOST),
  PRINCIPAL_KEYWORDS,
  USER_SUPPLIED_KEYWORDS,
  DESTINATION_KEYWORDS,
  INTENT_KEYWORDS,
  RESEARCH_KEYWORDS,
  HARVEST_2026_10_27,
  CLUSTER_DEEPEN_2026_10_27,
  ASTRO_HYBRID_2026_10_27,
)

export function buildSiteKeywords(): string[] {
  return Array.isArray(SITE_KEYWORDS) ? [...SITE_KEYWORDS] : []
}
