"use client";

import { Bell, CheckCircle2, LogIn } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { createAlert } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";

type Mode = "rent" | "sale" | "buy" | "commercial";

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "Appartements",
  villa: "Villas",
  studio: "Studios",
  townhouse: "Maisons de ville",
  land: "Terrains",
  commercial: "Commerciaux",
};

const MODE_LABEL: Record<Mode, string> = {
  rent: "à louer",
  sale: "à vendre",
  buy: "à vendre",
  commercial: "commercial",
};

function buildAlertName(mode: Mode, params: URLSearchParams): string {
  const parts: string[] = [];
  const type = params.get("type");
  const q = params.get("q");

  if (type && CATEGORY_LABELS[type]) parts.push(CATEGORY_LABELS[type]);
  if (q) parts.push(q);
  parts.push(MODE_LABEL[mode]);

  return `Alerte ${parts.join(" · ")}`;
}

export default function AlertSubscriptionBanner({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { isAuthenticated: isAgentAuth } = useAgentSessionStore();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Agents don't create saved searches
  if (isAgentAuth) return null;

  const listingType = mode === "rent" ? "for-rent" : "for-sale";

  async function handleSubscribe() {
    if (!token) {
      // Encode current URL as redirect target
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/connexion?redirect=${redirect}`);
      return;
    }

    setState("loading");
    try {
      const type = params.get("type") ?? undefined;
      const minPriceRaw = params.get("minPrice");
      const maxPriceRaw = params.get("maxPrice");
      const bedsRaw = params.get("beds");
      const q = params.get("q") ?? undefined;

      await createAlert(token, {
        name: buildAlertName(mode, params),
        listingType,
        category: type ?? undefined,
        city: q ?? undefined,
        minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
        maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
        minBedrooms: bedsRaw ? Number(bedsRaw) : undefined,
        active: true,
      });
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-4 flex items-center gap-2 justify-center px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          Alerte créée ! Vous serez notifié dès qu&apos;un bien correspond à votre recherche.{" "}
          <a href="/tableau-de-bord/alertes" className="underline font-medium">
            Gérer mes alertes
          </a>
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSubscribe}
        disabled={state === "loading"}
        className="gap-2 border-primary/40 text-primary hover:bg-primary/5"
      >
        {state === "loading" ? (
          <>
            <Bell className="w-4 h-4 animate-pulse" />
            Création de l&apos;alerte…
          </>
        ) : token ? (
          <>
            <Bell className="w-4 h-4" />
            Être alerté dès qu&apos;une annonce correspond
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Se connecter pour créer une alerte
          </>
        )}
      </Button>
      {state === "error" && (
        <span className="text-xs text-destructive">
          Impossible de créer l&apos;alerte. Réessayez.
        </span>
      )}
    </div>
  );
}
