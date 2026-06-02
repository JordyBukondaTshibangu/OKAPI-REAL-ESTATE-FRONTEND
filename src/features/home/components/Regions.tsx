import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";
import { getAllProperties } from "@/lib/api";
import { TrendingUp } from "lucide-react";

const suburbs = [
  "Gombe",
  "Limete",
  "Lemba",
  "Ngaliema",
  "Bandalungwa",
  "Kintambo",
  "Lingwala",
  "Kalamu",
];

export default async function Regions() {
  let properties: Awaited<ReturnType<typeof getAllProperties>> = [];
  try {
    properties = await getAllProperties();
  } catch {
    // silently fail – show zeros
  }

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
            Quartiers
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Biens à vendre dans les quartiers de Kinshasa
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

        <Card className="bg-white text-foreground p-6 rounded-xl shadow-lg border-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">
              Tendances en direct
            </p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">Kinshasa</h2>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-lg bg-accent/60 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Annonces</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-lg font-bold text-primary">{forSale.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">À vendre</p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-3 text-center">
              <p className="text-lg font-bold text-secondary">{forRent.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">À louer</p>
            </div>
          </div>

          {/* Top suburbs bar chart */}
          {topSuburbs.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground mb-2">
                Quartiers les plus actifs
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
                Prix moyen à la vente :{" "}
                <span className="font-semibold text-foreground">
                  {avgSalePrice.toLocaleString("fr-FR")} $
                </span>
              </span>
            </div>
          )}

          <Button variant="outlineGold" className="rounded-full w-full" asChild>
            <Link href="/acheter">Tendances immobilières à Kinshasa</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
