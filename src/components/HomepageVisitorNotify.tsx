"use client"

import { useContext, useEffect, useRef } from "react"
import { BotAccessContext } from "@/ReffererProvider"
import { isCrawlerUserAgent } from "@/utils/botDetection"
import BotFingerprintCollector from "@/components/BotFingerprintCollector"

export function HomepageVisitorNotify({ children }: { children: React.ReactNode }) {
  const sentRef = useRef(false)
  const isBot = useContext(BotAccessContext)

  useEffect(() => {
    if (isBot || isCrawlerUserAgent() || sentRef.current || typeof window === "undefined") return
    // Kit: exactly one visit notification per tab, even across re-mounts/reloads.
    const VISITOR_SENT_KEY = "principal_visitor_notified"
    try {
      if (sessionStorage.getItem(VISITOR_SENT_KEY) === "1") return
      sessionStorage.setItem(VISITOR_SENT_KEY, "1")
    } catch {
      // ignore sessionStorage failures
    }
    sentRef.current = true
    void fetch("/api/telegram/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        referrer: document.referrer || "Direct",
        pageUrl: window.location.href,
      }),
    })
  }, [isBot])

  return (
    <>
      <BotFingerprintCollector />
      {children}
    </>
  )
}
