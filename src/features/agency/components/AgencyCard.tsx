"use client";

import { useT } from "@/i18n/useT";
import { Agency } from "@/features/agency/types/agency";
import { MapPin, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AgencyCard({ agency }: { agency: Agency }) {
  const t = useT();

  return (
    <Link
      href={`/agences/${agency.id}`}
      className="group block bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden"
    >
      <div className="grid grid-cols-[140px_1fr]">
        {/* Logo panel */}
        <div
          className={`${agency?.accentClass? agency?.accentClass : 'bg-yellow-600'} flex flex-col items-center justify-center gap-2 p-6`}
        >
          <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center text-white text-2xl font-bold tracking-tight">
            {agency.monogram}
          </div>
          <p className="text-white/80 text-[10px] font-semibold tracking-wider text-center leading-tight">
            {t.cards.since.replace("{year}", String(agency.founded))}
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
            {agency.name}
          </h3>
          <p className="text-xs text-muted-foreground italic mb-3 line-clamp-1">
            {agency.tagline}
          </p>

          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 mb-4">
            {agency.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border pt-3">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              {agency.agentCount}{" "}
              {agency.agentCount > 1 ? t.cards.agents : t.cards.agent}
            </span>
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              {agency.closedDeals} {t.cards.transactions}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {agency.areasServed[0]}
              {agency.areasServed.length > 1 &&
                ` +${agency.areasServed.length - 1}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
