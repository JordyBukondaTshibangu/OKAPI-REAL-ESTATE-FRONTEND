"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Flame, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import type { PropertyPerformance } from "@/features/properties/types/property";
import { formatCompactCount } from "@/lib/properties";
import { useT } from "@/i18n/useT";

/* ─── demand model ────────────────────────────────────────────────────────
   A save is worth more than a share, a share more than a view.
   Score doubles as the gauge percentage (capped at 100).               */

export function demandScore(perf: PropertyPerformance): number {
  return perf.viewed + perf.shared * 5 + perf.saved * 10 + (perf.whatsappClicks ?? 0) * 15;
}

export function isHotProperty(perf?: PropertyPerformance | null): boolean {
  if (!perf) return false;
  return demandScore(perf) >= 50;
}

/* ─── animated counter ───────────────────────────────────────────────── */

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) {
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = reduced ? 0 : duration;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p =
        effectiveDuration <= 0
          ? 1
          : Math.min(1, (now - start) / effectiveDuration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ─── badges ─────────────────────────────────────────────────────────── */

export function HotBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-linear-to-r from-orange-500 to-rose-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">
      <Flame className="w-3 h-3 animate-pulse" /> {label}
    </span>
  );
}

/* ─── detail page panel ──────────────────────────────────────────────── */

function StatTile({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: string;
}) {
  const animated = useCountUp(value);
  return (
    <div className="rounded-xl border border-border bg-white dark:bg-card p-4 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-xl font-bold text-foreground tabular-nums">
          {formatCompactCount(animated)}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function PerformancePanel({ perf }: { perf: PropertyPerformance }) {
  const t = useT();
  const dp = t.detail.property;
  const score = demandScore(perf);
  const pct = Math.min(100, score);
  const hot = score >= 50;

  const demandLabel =
    pct < 25
      ? dp.perfDemandLow
      : pct < 50
        ? dp.perfDemandModerate
        : pct < 80
          ? dp.perfDemandHigh
          : dp.perfDemandVeryHigh;

  return (
    <section className="rounded-2xl border border-border bg-linear-to-br from-accent/40 via-white to-accent/20 dark:from-card dark:via-card dark:to-card p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="inline-flex items-center gap-2 text-base md:text-lg font-semibold text-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          {dp.perfHeading}
        </h2>
        {hot && <HotBadge label={dp.perfHot} />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          icon={<Eye className="w-4 h-4" />}
          value={perf.viewed}
          label={dp.perfViews}
          accent="bg-primary/10 text-primary"
        />
        <StatTile
          icon={<Share2 className="w-4 h-4" />}
          value={perf.shared}
          label={dp.perfShares}
          accent="bg-sky-500/10 text-sky-600"
        />
        <StatTile
          icon={<Heart className="w-4 h-4 fill-current" />}
          value={perf.saved}
          label={dp.perfSaves}
          accent="bg-rose-500/10 text-rose-500"
        />
        <StatTile
          icon={<MessageCircle className="w-4 h-4" />}
          value={perf.whatsappClicks ?? 0}
          label={dp.perfWhatsApp}
          accent="bg-green-500/10 text-green-600"
        />
      </div>

      {/* Demand gauge */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">{dp.perfDemandLabel}</span>
          <span className="font-semibold text-foreground">{demandLabel}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary via-secondary to-rose-500 transition-[width] duration-1000 ease-out"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
      </div>

      {perf.saved > 0 && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/75">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          {dp.perfSavedNote.replace("{n}", String(perf.saved))}
        </p>
      )}
    </section>
  );
}

/* ─── compact strip for listing cards ────────────────────────────────── */

export function CardPerformanceStrip({
  perf,
}: {
  perf?: PropertyPerformance | null;
}) {
  const t = useT();
  if (!perf || (perf.viewed === 0 && perf.shared === 0 && perf.saved === 0)) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
      <span
        className="inline-flex items-center gap-1"
        title={t.cards.viewsLabel}
        aria-label={`${perf.viewed} ${t.cards.viewsLabel}`}
      >
        <Eye className="w-3.5 h-3.5" /> {formatCompactCount(perf.viewed)}
      </span>
      <span
        className="inline-flex items-center gap-1"
        title={t.cards.savesLabel}
        aria-label={`${perf.saved} ${t.cards.savesLabel}`}
      >
        <Heart className="w-3.5 h-3.5" /> {formatCompactCount(perf.saved)}
      </span>
      <span
        className="inline-flex items-center gap-1"
        title={t.cards.sharesLabel}
        aria-label={`${perf.shared} ${t.cards.sharesLabel}`}
      >
        <Share2 className="w-3.5 h-3.5" /> {formatCompactCount(perf.shared)}
      </span>
    </span>
  );
}
