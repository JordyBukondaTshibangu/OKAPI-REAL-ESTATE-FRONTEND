"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useProperties } from "@/hooks/useProperties";

const suburbs = [
  "Gombe", "Limete", "Lemba", "Ngaliema",
  "Bandalungwa", "Kintambo", "Lingwala", "Kalamu",
];

export default function Regions() {
  const t = useT();
  const { data: properties = [] } = useProperties({ limit: 200 });

  const forSale = properties.filter((p) => p.listingType === "sale");
  const forRent = properties.filter((p) => p.listingType === "rent");
  const total = properties.length;

  const avgSalePrice =
    forSale.length > 0
      ? Math.round(forSale.reduce((s, p) => s + p.price, 0) / forSale.length)
      : 0;

  const suburbCounts: Record<string, number> = {};
  for (const p of properties) {
    const key = p.suburb || "Autre";
    suburbCounts[key] = (suburbCounts[key] || 0) + 1;
  }
  const topSuburbs = Object.entries(suburbCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxCount = topSuburbs[0]?.[1] ?? 1;

  return (
    <section className="bg-navy text-primary-foreground py-32 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            {t.regions.sectionLabel}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            {t.regions.heading}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-primary-foreground/85">
            {suburbs.map((suburb) => (
              <Link
                key={suburb}
                href="/acheter"
                className="hover:text-secondary transition-colors"
              >
                {suburb}
              </Link>
            ))}
          </div>
        </div>

        <Card className="bg-white dark:bg-card text-foreground p-6 rounded-xl shadow-lg border-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">
              {t.regions.liveLabel}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.regions.liveTag}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">{t.regions.liveTitle}</h2>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-lg bg-accent/60 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.regions.total}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-lg font-bold text-primary">{forSale.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.regions.forSale}</p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-3 text-center">
              <p className="text-lg font-bold text-secondary">{forRent.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.regions.forRent}</p>
            </div>
          </div>

          {/* Top suburbs bar chart */}
          {topSuburbs.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground mb-2">
                {t.regions.topSuburbs}
              </p>
              <div className="space-y-2">
                {topSuburbs.map(([name, count]) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="w-[72px] text-xs text-muted-foreground truncate text-right shrink-0">
                      {name}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-5 text-xs font-semibold text-foreground shrink-0 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Average price */}
          {avgSalePrice > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                {t.regions.avgPrice}{" "}
                <span className="font-semibold text-foreground">
                  {avgSalePrice.toLocaleString("fr-FR")} $
                </span>
              </span>
            </div>
          )}

          <Button variant="outlineGold" className="rounded-full w-full" asChild>
            <Link href="/acheter">{t.regions.ctaLabel}</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
