"use client";

import { AlertTriangle } from "lucide-react";
import { useT } from "@/i18n/useT";

const now = Date.now();

export default function FreshnessIndicator({ updatedAt }: { updatedAt?: string }) {
  const t = useT();
  if (!updatedAt) return null;

  const diffMs = now - new Date(updatedAt).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 7) return null;

  if (days >= 45) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {t.cards.staleWarning.replace("{days}", String(days))}
      </span>
    );
  }

  return (
    <span className="text-[11px] text-muted-foreground">
      {t.cards.freshUpdated.replace("{days}", String(days))}
    </span>
  );
}
