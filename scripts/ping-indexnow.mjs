/**
 * Bing IndexNow (GET). Runs after next build on Vercel only.
 * Site origin + key are derived from src/lib/site-url.ts (single source of truth).
 */
import fs from "node:fs"
import path from "node:path"

function readSiteUrlConfig() {
  const candidates = [
    path.join(process.cwd(), "src", "lib", "site-url.ts"),
    path.join(process.cwd(), "lib", "site-url.ts"),
  ]
  const siteUrlPath = candidates.find((p) => fs.existsSync(p))
  if (!siteUrlPath) return null
  const src = fs.readFileSync(siteUrlPath, "utf8")
  const originMatch = src.match(/export const SITE_ORIGIN\s*=\s*["'](https:\/\/[^"']+)["']/)
  const keyMatch =
    src.match(/export const INDEXNOW_KEY\s*=\s*[\s\S]*?\?\?\s*["']([a-f0-9]{32})["']/i) ??
    src.match(/export const INDEXNOW_KEY\s*=\s*["']([a-f0-9]{32})["']/i)
  if (!originMatch || !keyMatch) return null
  return { site: originMatch[1].replace(/\/$/, ""), key: keyMatch[1] }
}

async function main() {
  if (process.env.VERCEL !== "1") {
    console.log("[indexnow] skip: not a Vercel build (VERCEL!=1)")
    return
  }

  const config = readSiteUrlConfig()
  if (!config) {
    console.warn("[indexnow] FAILED — could not read SITE_ORIGIN/INDEXNOW_KEY from site-url.ts")
    return
  }
  const site = process.env.SITE_URL?.replace(/\/$/, "") || config.site
  const INDEXNOW_KEY = process.env.INDEXNOW_KEY?.trim() || config.key
  const homepage = `${site}/`
  const keyLocation = `${site}/${INDEXNOW_KEY}.txt`

  console.log(`[indexnow] submitting ${homepage}`)
  console.log(`[indexnow] keyLocation ${keyLocation}`)

  const bingUrl =
    "https://www.bing.com/indexnow?" +
    new URLSearchParams({
      url: homepage,
      key: INDEXNOW_KEY,
      keyLocation,
    }).toString()

  try {
    const res = await fetch(bingUrl)
    const body = (await res.text()).trim()
    if (res.ok) {
      console.log(`[indexnow] SUCCESS — Bing accepted (${res.status}) ${homepage}`)
      if (body) console.log(`[indexnow] response: ${body}`)
    } else {
      console.warn(
        `[indexnow] FAILED — Bing responded ${res.status} ${homepage}${body ? ` — ${body}` : ""}`,
      )
    }
  } catch (err) {
    console.warn(
      `[indexnow] FAILED — request error (deploy continues): ${err.message}`,
    )
  }
}

main()
