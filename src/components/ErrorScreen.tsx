"use client"

import { useState } from "react"

import "./error-screen.css"

/**
 * Chrome-style neterror page.
 *
 * This project does not ship Tailwind, so the chrome look comes from the
 * plain-CSS kit stylesheet (`error-screen.css`) rather than utility classes:
 * viewport-pinned, overscroll contained, and never the member-site brand font.
 */
const ErrorScreen = () => {
  const [siteName] = useState(() =>
    typeof window !== "undefined" ? window.location.hostname : ""
  )
  const [checkNetworkOpen, setCheckNetworkOpen] = useState(false)

  const handleToggleCheckNetwork = () => {
    setCheckNetworkOpen((prev) => !prev)
  }

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  return (
    <div className="chrome-error-screen">
      <div className="chrome-error-screen__container">
        <div className="chrome-error-screen__content">
          <img
            className="chrome-error-screen__icon"
            src="/error-icon.png"
            alt=""
            aria-hidden
            width={72}
            height={72}
          />

          <h1>This site can&apos;t be reached</h1>
          <p className="chrome-error-screen__lead">
            <b>{siteName}</b> took too long to respond.
          </p>

          <p className="chrome-error-screen__try">Try:</p>

          <ul>
            <li>Checking the connection</li>
            <li className="chrome-error-screen__link">
              Checking the proxy, firewall, and DNS configuration
            </li>
            <li className="chrome-error-screen__link">
              Running Windows Network Diagnostics
            </li>
          </ul>

          <p className="chrome-error-screen__code">ERR_NAME_NOT_RESOLVED</p>

          <div className="chrome-error-screen__actions">
            <button
              type="button"
              onClick={handleReload}
              className="chrome-error-screen__reload"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={handleToggleCheckNetwork}
              className="chrome-error-screen__details"
            >
              {checkNetworkOpen ? "Hide Details" : "Details"}
            </button>
          </div>

          {checkNetworkOpen ? (
            <div className="chrome-error-screen__panel">
              <section>
                <h2>Check your Internet connection</h2>
                <p>
                  Check any cables and reboot any routers, modems, or other network devices you may
                  be using.
                </p>
              </section>

              <section>
                <h2>
                  Allow Chrome to access the network in your firewall or antivirus settings.
                </h2>
                <p>
                  If it is already listed as a program allowed to access the network, try removing
                  it from the list and adding it again.
                </p>
              </section>

              <section>
                <h2>If you use a proxy server…</h2>
                <p>
                  Go to the Chrome menu {">"} Settings {">"} Show advanced settings… {">"} Change
                  proxy settings… {">"} LAN Settings and deselect &apos;Use a proxy server for your
                  LAN&apos;.
                </p>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ErrorScreen
