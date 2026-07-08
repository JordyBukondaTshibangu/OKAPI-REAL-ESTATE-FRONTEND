"use client";

import { useT } from "@/i18n/useT";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import { BadgeCheck, Star } from "lucide-react";
import Link from "next/link";
import TitleBadge from "./TitleBadge";

import { Agent } from "@/features/agents/types/agent";

function membreSince(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const t = useT();
  const isVerified = agent.verificationTier === "VERIFIE";
  const since = membreSince(agent.verifiedAt ?? agent.createdAt);

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group block bg-white dark:bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden"
    >
      <div className="grid grid-cols-[160px_1fr]">
        {/* Photo — AgentAvatar handles missing/broken photos with a gradient+initials fallback */}
        <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
          <AgentAvatar
            name={agent.name}
            photo={agent.photo}
            size={160}
            className="rounded-none! w-full h-full"
          />
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agent.specialization}
              </p>
            </div>
            {/* Agency mini-card */}
            <div
              className={`shrink-0 w-12 h-12 rounded-md ${agent.agencyAccent} text-white flex items-center justify-center text-sm font-bold tracking-tight shadow-sm`}
              aria-label={agent.agency}
              title={agent.agency}
            >
              {agent.agencyMonogram}
            </div>
          </div>

          {/* Verified badge — prominent, first thing seen */}
          {isVerified && (
            <div className="flex items-center gap-1.5 mt-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" />
                Agent Vérifié
              </span>
              {since && (
                <span className="text-[11px] text-muted-foreground">
                  · Membre depuis {since}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <TitleBadge title={agent.title} />
            <span className="inline-flex items-center gap-1 text-xs text-foreground/85">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span className="font-semibold">{agent.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({agent.ratingsCount})
              </span>
            </span>
          </div>

          <dl className="mt-3 text-xs text-foreground/85 space-y-1.5">
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-20 shrink-0">
                {t.cards.nationality}
              </dt>
              <dd>{agent.nationality}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-20 shrink-0">
                {t.cards.languages}
              </dt>
              <dd className="line-clamp-1">{agent.languages.join(", ")}</dd>
            </div>
          </dl>

          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent text-primary font-medium">
              {t.cards.forSale} {agent.forSaleCount}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent text-primary font-medium">
              {t.cards.forRent} {agent.forRentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
