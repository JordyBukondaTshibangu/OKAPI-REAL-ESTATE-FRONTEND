import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { PropertyStats } from "@/lib/api";

// Translations are inlined here since this is now a Server Component
// (useT / useLocaleStore are client-only hooks).
const t = {
  sectionLabel: "Explorer par quartier",
  heading: "Trouvez votre bien idéal à Kinshasa",
  liveLabel: "Marché en direct",
  liveTag: "Mis à jour",
  liveTitle: "Le marché immobilier aujourd'hui",
  total: "Annonces",
  forSale: "À vendre",
  forRent: "À louer",
  topSuburbs: "Communes les plus actives",
  avgPrice: "Prix moyen de vente :",
  ctaLabel: "Voir tous les biens",
};

const suburbs = [
  "Gombe", "Limete", "Lemba", "Ngaliema",
  "Bandalungwa", "Kintambo", "Lingwala", "Kalamu",
];

export default function Regions({ stats }: { stats: PropertyStats }) {
  const { total, forSale, forRent, avgSalePrice, topSuburbs } = stats;
  const maxCount = topSuburbs[0]?.[1] ?? 1;

  return (
    <section className="bg-navy text-primary-foreground py-32 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            {t.sectionLabel}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
            {t.heading}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-primary-foreground/85 dark:text-white">
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
              {t.liveLabel}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.liveTag}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">{t.liveTitle}</h2>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-lg bg-accent/60 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.total}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-lg font-bold text-primary">{forSale}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.forSale}</p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-3 text-center">
              <p className="text-lg font-bold text-secondary">{forRent}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.forRent}</p>
            </div>
          </div>

          {/* Top suburbs bar chart */}
          {topSuburbs.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground mb-2">
                {t.topSuburbs}
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
                {t.avgPrice}{" "}
                <span className="font-semibold text-foreground">
                  {avgSalePrice.toLocaleString("fr-FR")} $
                </span>
              </span>
            </div>
          )}

          <Button variant="outlineGold" className="rounded-full w-full" asChild>
            <Link href="/acheter">{t.ctaLabel}</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
