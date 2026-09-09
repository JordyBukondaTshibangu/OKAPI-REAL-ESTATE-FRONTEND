"use client";

import { useT } from "@/i18n/useT";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import { BadgeCheck, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import TitleBadge from "./TitleBadge";

import { Agent } from "@/features/agents/types/agent";

export default function AgentCard({ agent }: { agent: Agent }) {
  const t = useT();
  const isVerified = agent.verificationTier === "VERIFIE";
  const activeListings = (agent.forSaleCount ?? 0) + (agent.forRentCount ?? 0);

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group flex flex-col bg-white dark:bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <AgentAvatar
          name={agent.name}
          photo={agent.photo}
          size={400}
          className="rounded-none! w-full h-full object-cover"
        />

        {/* Agency monogram — top right */}
        <div
          className={`absolute top-3 right-3 w-10 h-10 rounded-lg ${agent.agencyAccent} text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-md`}
          aria-label={agent.agency}
          title={agent.agency}
        >
          {agent.agencyMonogram}
        </div>

        {/* Verified badge — bottom left overlay */}
        {isVerified && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-sm shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5" />
              Vérifié
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name + specialization */}
        <div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {agent.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {agent.specialization}
          </p>
        </div>

        {/* Title badge + rating */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TitleBadge title={agent.title} />
          <span className="inline-flex items-center gap-1 text-xs text-foreground/85">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
            <span className="font-semibold">{agent.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({agent.ratingsCount})</span>
          </span>
        </div>

        {/* Languages */}
        {agent.languages?.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
            {t.cards.languages}: <span className="text-foreground/80">{agent.languages.join(", ")}</span>
          </p>
        )}

        {/* Stats bar */}
        <div className="mt-auto pt-3 mt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-bold text-foreground">{activeListings}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{t.cards.forSale} / {t.cards.forRent}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground flex items-center justify-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-primary" />
              {agent.closedDeals ?? 0}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">Ventes conclues</p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground flex items-center justify-center gap-0.5">
              <Clock className="w-3 h-3 text-primary" />
              {agent.responseMinutes ? `${agent.responseMinutes}m` : "–"}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">Réponse moy.</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
