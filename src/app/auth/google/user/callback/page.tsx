"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";

/**
 * Landing page after the backend Google OAuth callback for USERS.
 * URL: /auth/google/user/callback?token=<jwt>&user=<base64url-user>
 */
function GoogleUserCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { logout: clearAgentSession } = useAgentSessionStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userB64 = searchParams.get("user");

    if (!token || !userB64) {
      setError("Données manquantes — veuillez réessayer.");
      return;
    }

    try {
      const json = atob(userB64.replace(/-/g, "+").replace(/_/g, "/"));
      const user = JSON.parse(json);

      clearAgentSession();
      setAuth(token, user);
      router.replace("/");
    } catch {
      setError("Authentification échouée — veuillez vous reconnecter.");
    }
  }, [searchParams, router, setAuth, clearAgentSession]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <a href="/connexion" className="text-primary text-sm underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Connexion en cours…</p>
      </div>
    </div>
  );
}

export default function GoogleUserCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GoogleUserCallbackContent />
    </Suspense>
  );
}
