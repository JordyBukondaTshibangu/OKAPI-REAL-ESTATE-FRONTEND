"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { PropertyStats } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

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

/* ── Animated count-up hook ───────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1200): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration]);

  return active ? value : 0;
}

/* ── Single stat tile with count-up ──────────────────────────────── */
function StatTile({
  value,
  label,
  active,
  colorClass,
  delay,
}: {
  value: number;
  label: string;
  active: boolean;
  colorClass: string;
  delay: number;
}) {
  const animated = useCountUp(value, active);

  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{
        animation: active ? `stat-pop 0.5s ease-out ${delay}ms both` : undefined,
      }}
    >
      <p className={`text-lg font-bold tabular-nums ${colorClass}`}>{animated}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

/* ── Animated bar ─────────────────────────────────────────────────── */
function AnimatedBar({
  pct,
  active,
  delay,
}: {
  pct: number;
  active: boolean;
  delay: number;
}) {
  return (
    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full"
        style={
          active
            ? {
                width: `${pct}%`,
                animation: `bar-grow 0.9s ease-out ${delay}ms both`,
              }
            : { width: 0 }
        }
      />
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function Regions({ stats }: { stats: PropertyStats }) {
  const { total, forSale, forRent, avgSalePrice, topSuburbs } = stats;
  const maxCount = topSuburbs[0]?.[1] ?? 1;

  /* Trigger animations once the card enters the viewport */
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setActive(true); io.disconnect(); }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-navy text-primary-foreground py-32 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">

        {/* Left: neighbourhood grid */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            {t.sectionLabel}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
            {t.heading}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-primary-foreground/85 dark:text-white">
            {suburbs.map((suburb, i) => (
              <Link
                key={suburb}
                href="/acheter"
                className="hover:text-secondary transition-colors duration-200"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {suburb}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: live market card */}
        <Card ref={cardRef} className="bg-white dark:bg-card text-foreground p-6 rounded-xl shadow-lg border-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">{t.liveLabel}</p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.liveTag}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">{t.liveTitle}</h2>

          {/* Animated stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-lg bg-accent/60">
              <StatTile value={total}   label={t.total}   active={active} colorClass="text-foreground" delay={0} />
            </div>
            <div className="rounded-lg bg-primary/10">
              <StatTile value={forSale} label={t.forSale} active={active} colorClass="text-primary"    delay={120} />
            </div>
            <div className="rounded-lg bg-secondary/10">
              <StatTile value={forRent} label={t.forRent} active={active} colorClass="text-secondary"  delay={240} />
            </div>
          </div>

          {/* Animated bar chart */}
          {topSuburbs.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground mb-2">{t.topSuburbs}</p>
              <div className="space-y-2">
                {topSuburbs.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="w-[72px] text-xs text-muted-foreground truncate text-right shrink-0">
                      {name}
                    </span>
                    <AnimatedBar
                      pct={(count / maxCount) * 100}
                      active={active}
                      delay={i * 80}
                    />
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
