"use client";

import { Button } from "@/shared/components/ui/button";
import { verifyAgentEmail, resendAgentVerification } from "@/services/agentAuth";
import { useAgentSignupStore } from "@/store/useAgentSignupStore";
import { useT } from "@/i18n/useT";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AgentVerificationPage() {
  const router = useRouter();
  const { token, agentEmail, agentName, clear } = useAgentSignupStore();
  const t = useT();
  const s = t.agentSignup;

  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect back to registration if no token in store.
  // Skip if we just verified — clear() sets token=null but we're already navigating away.
  useEffect(() => {
    if (!token && !verified) router.replace("/devenir-agent");
  }, [token, router, verified]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleInput(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...codes];
    next[idx] = digit;
    setCodes(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (!digit && idx > 0) inputRefs.current[idx - 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !codes[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...codes];
    pasted.split("").forEach((d, i) => { if (i < 6) next[i] = d; });
    setCodes(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const code = codes.join("");
    if (code.length < 6) { setError(s.verifyCodeRequired); return; }
    setError(null);
    setSubmitting(true);
    try {
      await verifyAgentEmail(token, code);
      setVerified(true); // prevents the token guard from redirecting back
      clear();
      router.push("/devenir-agent/profil");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === "string" ? msg : s.verifyError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!token || resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      await resendAgentVerification(token);
      setResendCooldown(60);
      setCodes(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError(s.resendError);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/assets/images/company-logo.png"
              alt="Okapi Real Estate"
              width={120}
              height={48}
              className="h-24 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth={1.8}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 8l9 6 9-6" />
            </svg>
          </div>

          <h1 className="text-xl font-semibold mb-2">{s.verifyTitle}</h1>
          <p className="text-sm text-muted-foreground mb-1">{s.verifySentTo}</p>
          <p className="text-sm font-medium text-foreground mb-6">
            {agentEmail ?? s.verifyEmailFallback}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP input boxes */}
            <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
              {codes.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-13 text-center text-xl font-bold border-2 rounded-xl focus:border-primary focus:outline-none bg-background transition-colors"
                  style={{ borderColor: digit ? "hsl(var(--primary))" : undefined }}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? s.verifyingBtn : s.verifyBtn}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>{s.resendPrompt}</span>
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground">
                {s.resendCooldown.replace("{n}", String(resendCooldown))}
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                {resending ? s.resendingBtn : s.resendBtn}
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            {s.wrongAddress}{" "}
            <Link href="/devenir-agent" className="text-primary hover:underline">
              {s.restart}
            </Link>
          </p>
        </div>

        {agentName && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {s.connectedAs} <span className="font-medium">{agentName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
