"use client";

import Link from "next/link";
import { TrendingUp, MapPin, Building2, BadgeCheck } from "lucide-react";
import { useT } from "@/i18n/useT";

const POPULAR_AREAS = ["Gombe", "Ngaliema", "Limete", "Kintambo", "Lingwala", "Masina"];

interface HeroStatsProps {
  totalCount?: number;
}

export default function HeroStats({ totalCount = 0 }: HeroStatsProps) {
  const t = useT();

  const stats = [
    {
      icon: Building2,
      value: totalCount > 0 ? totalCount.toLocaleString("fr-FR") : "—",
      label: t.hero.trustBadge,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: BadgeCheck,
      value: "+12%",
      label: t.hero.trendProperties,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: TrendingUp,
      value: "$285k",
      label: t.hero.trendAvgPrice,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: MapPin,
      value: "6",
      label: "Communes couvertes",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-4"
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-lg font-bold leading-tight ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground leading-snug">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Popular areas */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            {t.hero.popularAreas}
          </p>
          {POPULAR_AREAS.map((area) => (
            <Link
              key={area}
              href={`/acheter?suburb=${encodeURIComponent(area)}`}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {area}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
