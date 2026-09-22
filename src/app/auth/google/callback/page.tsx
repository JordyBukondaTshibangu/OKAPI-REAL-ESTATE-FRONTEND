"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Suspense } from "react";

/**
 * Landing page after the backend Google OAuth callback redirects here.
 * URL format: /auth/google/callback?token=<jwt>&agent=<base64url-encoded-agent>
 *
 * The agent data is encoded in the URL by the backend — no second API call needed.
 */
function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAgentSessionStore();
  const { logout: clearUserSession } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const agentB64 = searchParams.get("agent");

    if (!token || !agentB64) {
      setError("Données manquantes — veuillez réessayer.");
      return;
    }

    try {
      // base64url → base64 → JSON
      const json = atob(agentB64.replace(/-/g, "+").replace(/_/g, "/"));
      const agent = JSON.parse(json);

      clearUserSession();
      setSession(token, agent);

      if (agent.agentType === "AGENCY_OWNER" && agent.agencyId) {
        router.replace("/espace-agence");
      } else {
        router.replace("/espace-agent");
      }
    } catch {
      setError("Authentification échouée — veuillez vous reconnecter.");
    }
  }, [searchParams, router, setSession, clearUserSession]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <a href="/connexion?tab=agent" className="text-primary text-sm underline">
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

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
