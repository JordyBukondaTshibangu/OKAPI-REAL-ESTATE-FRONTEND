"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { deleteAccount } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useT } from "@/i18n/useT";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAuthHydrated } from "@/shared/hooks/useAuthHydrated";

const SUPPORT_EMAIL = "privacy@okapiimmobilier.cd";

export default function DeleteAccountPage() {
  const p = useT().deleteAccountPage;
  const { token, user, isAuthenticated, logout } = useAuthStore();
  const mounted = useMounted();
  const hydrated = useAuthHydrated();

  const [acknowledged, setAcknowledged] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await deleteAccount(token);
      logout();
      setDeleted(true);
    } catch {
      setError(p.errDelete);
      setLoading(false);
    }
  }

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(p.emailSubject)}`;

  function renderAction() {
    // Wait for the persisted session so a signed-in user doesn't see the login prompt flash.
    if (!mounted || !hydrated) return <div className="h-24" />;

    if (deleted) {
      return (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{p.successTitle}</h3>
          <p className="text-sm text-muted-foreground mb-6">{p.successBody}</p>
          <Button asChild>
            <Link href="/">{p.backHome}</Link>
          </Button>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{p.loginPrompt}</p>
          <Button asChild>
            <Link href="/connexion?redirect=/supprimer-mon-compte">{p.loginBtn}</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          {p.signedInAs.replace("{{email}}", user.email)}
        </p>

        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-destructive"
          />
          <span>{p.acknowledge}</span>
        </label>

        {!showConfirm ? (
          <Button
            variant="outline"
            className="gap-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
            disabled={!acknowledged}
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
            {p.deleteBtn}
          </Button>
        ) : (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
            <p className="text-sm font-medium text-destructive">{p.confirmText}</p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                {p.cancel}
              </Button>
              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90 text-white gap-2"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                {loading ? p.deleting : p.confirmBtn}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {p.badge}
        </p>
        <h1 className="text-4xl font-semibold mb-4">{p.heading}</h1>
        <p className="text-white/70 text-sm max-w-xl mx-auto">{p.subtitle}</p>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-base font-semibold mb-3">{p.whatTitle}</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-light leading-relaxed">
              {p.whatItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-3">{p.keptTitle}</h2>
            <p className="text-sm text-text-light leading-relaxed">{p.keptBody}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-3">{p.delayTitle}</h2>
            <p className="text-sm text-text-light leading-relaxed">{p.delayBody}</p>
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-4 sm:p-8 border border-destructive/20">
            <h2 className="text-base font-semibold text-destructive mb-4">{p.actionTitle}</h2>
            {renderAction()}
          </div>

          <div className="border-t border-border pt-8 space-y-3">
            <h2 className="text-base font-semibold">{p.noAccessTitle}</h2>
            <p className="text-sm text-text-light">
              {p.noAccessBody}{" "}
              <a href={mailto} className="text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="text-xs text-muted-foreground">{p.agentNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
