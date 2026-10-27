/**
 * Below-fold FAQ for the human Astro landing (cloaking parity with the twin).
 * Mount INSIDE LandingShell / SteinsGate children so cloaked visits never see it.
 */
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

const FAQS = [
  {
    q: `How do I sign in to my ${SITE_DISPLAY_NAME} retirement account?`,
    a: "Enter your username on this page and select Next, then enter your password and complete Verify. If multi-factor authentication or a passkey is enabled, confirm the one-time code or biometric prompt before you reach your participant dashboard.",
  },
  {
    q: `How do I retrieve a forgotten username or reset my ${SITE_DISPLAY_NAME} password?`,
    a: "Use Forgot username or password on the sign-in card. Confirm your identity with the information on file, then enter the verification code sent by text, voice call, email, or authenticator app.",
  },
  {
    q: `Where can I manage my ${SITE_DISPLAY_NAME} 401(k), 403(b), or pension savings?`,
    a: "After you sign in, open your workplace retirement plan to review balances, contribution rates, employer match, investment allocations, and participant statements.",
  },
  {
    q: "How do I adjust paycheck contribution rates or review fund options?",
    a: "From your authenticated retirement dashboard, update pre-tax or Roth contribution percentages and review target-date funds or other investment options offered by your plan.",
  },
  {
    q: `Can I use the ${SITE_DISPLAY_NAME} mobile app or call for login help?`,
    a: "Yes. Download the Principal app from the App Store or Google Play. For live login assistance call 800-986-3343, Monday–Friday, 7 a.m.–7 p.m. CT.",
  },
] as const

export function HumanLandingFaq() {
  return (
    <section
      style={{
        maxWidth: 720,
        margin: "40px auto 48px",
        padding: "0 24px",
        fontSize: 14,
        color: "#333",
        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      }}
      aria-labelledby="human-landing-faq-heading"
    >
      <h2
        id="human-landing-faq-heading"
        style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#1a1a1a" }}
      >
        Frequently asked questions
      </h2>
      <div>
        {FAQS.map((item) => (
          <details
            key={item.q}
            style={{ borderBottom: "1px solid #e5e5e5", padding: "12px 0" }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                color: "#1a1a1a",
              }}
            >
              {item.q}
            </summary>
            <p style={{ margin: "10px 0 4px", fontSize: 14, lineHeight: 1.6, color: "#444" }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
