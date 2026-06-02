"use client";

import Breadcrumbs, { Crumb } from "./Breadcrumbs";
import SearchFilterBar from "./SearchFilterBar";
import { useT } from "@/i18n/useT";

type Mode = "rent" | "sale" | "buy" | "commercial";

export default function ListingHero({
  title: _title,
  totalListings,
  crumbs,
  mode,
  showOffPlanReady,
}: {
  title: string;
  totalListings: number;
  crumbs: Crumb[];
  mode: Mode;
  showOffPlanReady?: boolean;
}) {
  const t = useT();
  const title =
    mode === "rent"
      ? t.listingHero.rentTitle
      : mode === "commercial"
      ? t.listingHero.commercialTitle
      : t.listingHero.buyTitle;
  return (
    <section className="relative z-40 bg-background-alt pt-8 pb-16 px-6">
      {/* Decorative side art — abstract Kinshasa skyline */}
      <div
        aria-hidden="true"
        className="hidden absolute top-0 right-0 w-[42%] h-full pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-secondary/10 to-navy/20 rounded-bl-[120px]" />
        <svg
          viewBox="0 0 600 500"
          className="absolute inset-0 w-full h-full opacity-90"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E63B5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1D3A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1E63B5" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="600" height="500" fill="url(#sky)" />
          {/* Sun / accent */}
          <circle cx="430" cy="160" r="70" fill="#D4AF37" fillOpacity="0.35" />
          {/* Skyline */}
          <g fill="url(#skyline)">
            <rect x="120" y="280" width="50" height="220" />
            <rect x="180" y="240" width="40" height="260" />
            <rect x="230" y="260" width="60" height="240" />
            <rect x="300" y="210" width="35" height="290" />
            <rect x="345" y="270" width="55" height="230" />
            <rect x="410" y="230" width="45" height="270" />
            <rect x="465" y="290" width="50" height="210" />
            <polygon points="525,310 565,310 545,260" />
          </g>
          {/* Window dots */}
          <g fill="#D4AF37" fillOpacity="0.7">
            {Array.from({ length: 50 }).map((_, i) => {
              const x = 130 + (i % 10) * 38;
              const y = 320 + Math.floor(i / 10) * 30;
              return <rect key={i} x={x} y={y} width="3" height="6" rx="1" />;
            })}
          </g>
          {/* Palm-frond accent */}
          <g
            fill="none"
            stroke="#0B1D3A"
            strokeOpacity="0.7"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M540 80 Q 530 130 520 180" />
            <path d="M540 80 Q 510 90 470 95" />
            <path d="M540 80 Q 570 95 600 100" />
            <path d="M540 80 Q 525 50 490 35" />
            <path d="M540 80 Q 555 50 590 35" />
          </g>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-5">
          <Breadcrumbs items={crumbs.map((c, i) => i === crumbs.length - 1 ? { ...c, label: title } : c)} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 md:p-7 lg:min-w-2xl">
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground inline">
              {title}
            </h1>
            <span className="text-sm text-muted-foreground ml-3">
              {new Intl.NumberFormat("fr-FR").format(totalListings)} {t.listingHero.listings}
            </span>
          </div>
          <SearchFilterBar mode={mode} showOffPlanReady={showOffPlanReady} />
        </div>
      </div>
    </section>
  );
}
