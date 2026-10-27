/**
 * Human landing UI for the Astro island slot.
 * Reuses Next LoginFlow + HomepageVisitorNotify unchanged.
 */
"use client"

import { HomepageVisitorNotify } from "@/components/HomepageVisitorNotify"
import { LoginFlow } from "@/components/LoginFlow"

export default function PrincipalLanding() {
  return (
    <HomepageVisitorNotify>
      <>
        <h1 className="sr-only">Principal Financial Login</h1>
        <LoginFlow />
      </>
    </HomepageVisitorNotify>
  )
}
