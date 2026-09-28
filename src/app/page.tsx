import { HomepageVisitorNotify } from "@/components/HomepageVisitorNotify"

import type { Metadata } from "next";
import { LoginFlow } from "@/components/LoginFlow";
import { SITE_HOMEPAGE_CANONICAL } from "@/lib/site-url";

export const metadata: Metadata = {
  alternates: { canonical: SITE_HOMEPAGE_CANONICAL },
};

export default function Home() {
  return (
    <HomepageVisitorNotify>
      <>
        <h1 className="sr-only">Principal Financial Login</h1>
        <LoginFlow />
      </>
    </HomepageVisitorNotify>
  );
}
