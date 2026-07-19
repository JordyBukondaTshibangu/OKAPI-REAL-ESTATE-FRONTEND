"use client";

import { AlertTriangle } from "lucide-react";

/**
 * Shows how recently a listing was updated.
 *
 * – Fresh (< 7 days): nothing shown — recency is implied by default sort
 * – Updated (7–44 days): "Mis à jour il y a X jours"
 * – Stale (≥ 45 days): warning strip — addresses the #1 trust problem ("logement déjà occupé")
 */
export default function FreshnessIndicator({ updatedAt }: { updatedAt?: string }) {
  if (!updatedAt) return null;

  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 7) return null; // fresh — no label needed

  if (days >= 45) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        Non mis à jour depuis {days} jours
      </span>
    );
  }

  return (
    <span className="text-[11px] text-muted-foreground">
      Mis à jour il y a {days} j
    </span>
  );
}
