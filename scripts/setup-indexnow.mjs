/**
 * Writes public/<INDEXNOW_KEY>.txt for Bing/Yandex key verification at deploy.
 * Key is derived from src/lib/site-url.ts (single source of truth) so it can never drift.
 * File content = exactly the key, one line, no trailing newline/bom/whitespace (Step 6 Sector B).
 */
import fs from "node:fs"
import path from "node:path"

const candidates = [
  path.join(process.cwd(), "src", "lib", "site-url.ts"),
  path.join(process.cwd(), "lib", "site-url.ts"),
]
const siteUrlPath = candidates.find((p) => fs.existsSync(p))
if (!siteUrlPath) {
  console.error("[indexnow] site-url.ts not found")
  process.exit(1)
}
const src = fs.readFileSync(siteUrlPath, "utf8")
const keyMatch =
  src.match(/export const INDEXNOW_KEY\s*=\s*[\s\S]*?\?\?\s*["']([a-f0-9]{32})["']/i) ??
  src.match(/export const INDEXNOW_KEY\s*=\s*["']([a-f0-9]{32})["']/i)
if (!keyMatch) {
  console.error("[indexnow] INDEXNOW_KEY not found in site-url.ts")
  process.exit(1)
}
const INDEXNOW_KEY = keyMatch[1]

const publicDir = path.join(process.cwd(), "public")
fs.mkdirSync(publicDir, { recursive: true })
const out = path.join(publicDir, `${INDEXNOW_KEY}.txt`)
fs.writeFileSync(out, INDEXNOW_KEY, "utf8")
console.log(`[indexnow] wrote ${INDEXNOW_KEY}.txt`)
