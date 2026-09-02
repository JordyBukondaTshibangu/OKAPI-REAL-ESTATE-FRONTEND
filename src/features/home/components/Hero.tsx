"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ChevronDown, TrendingUp } from "lucide-react";
import { useT } from "@/i18n/useT";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { getR2ImageUrl } from "@/shared/utils/utils";
import { formatPrice } from "@/lib/properties";
import type { Property } from "@/features/properties/types/property";

const TAB_ROUTES: Record<string, string> = {
  buy: "/acheter",
  rent: "/louer",
  sell: "/vendre",
};

const POPULAR_AREAS = ["Gombe", "Ngaliema", "Limete", "Kintambo", "Lingwala", "Masina"];

/** Shorthand for a staggered CSS fade-in-up animation */
function anim(delayMs: number, durationMs = 600) {
  return {
    animation: `fade-in-up ${durationMs}ms ease-out ${delayMs}ms both`,
  } as React.CSSProperties;
}

interface HeroProps {
  previewProperties?: Property[];
  totalCount?: number;
}

export default function Hero({ previewProperties = [], totalCount = 0 }: HeroProps) {
  const router = useRouter();
  const t = useT();
  const [tab, setTab] = useState("buy");
  const [query, setQuery] = useState("");

  const FILTER_PILLS = [
    { label: t.hero.filterType, param: "type" },
    { label: t.hero.filterMinPrice, param: "minPrice" },
    { label: t.hero.filterMaxPrice, param: "maxPrice" },
    { label: t.hero.filterBedrooms, param: "beds" },
  ];

  function handleSearch() {
    const raw = query.trim();
    if (!raw) { router.push(TAB_ROUTES[tab] ?? "/acheter"); return; }
    const parsed = parseSearchQuery(raw);
    let destination = TAB_ROUTES[tab] ?? "/acheter";
    if (parsed.listingType === "rent") destination = "/louer";
    else if (parsed.listingType === "sale") destination = "/acheter";
    const params = new URLSearchParams();
    if (parsed.cleanQ) params.set("q", parsed.cleanQ);
    if (parsed.category) params.set("type", parsed.category);
    if (parsed.beds) params.set("beds", String(parsed.beds));
    if (parsed.suburb) params.set("suburb", parsed.suburb);
    router.push(params.toString() ? `${destination}?${params}` : destination);
  }

  return (
    <section className="relative bg-navy text-white py-14 md:py-20 lg:py-24 px-5 md:px-8 overflow-hidden">

      {/* ── Ambient background gradient ── */}
      <div className="absolute inset-0 bg-linear-to-br from-navy via-navy to-primary/30 pointer-events-none" aria-hidden="true" />

      {/* ── Animated ambient orbs ── */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb — large, top-right */}
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl"
          style={{ animation: "orb-drift-a 18s ease-in-out infinite" }}
        />
        {/* Gold orb — lower-left */}
        <div
          className="absolute bottom-0 -left-24 w-[380px] h-[380px] rounded-full bg-secondary/15 blur-3xl"
          style={{ animation: "orb-drift-b 22s ease-in-out infinite" }}
        />
        {/* Tiny accent orb */}
        <div
          className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-primary/10 blur-2xl"
          style={{ animation: "orb-drift-a 14s ease-in-out 4s infinite" }}
        />
      </div>

      {/* ── Top gold line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/60 to-transparent" aria-hidden="true" />

      {/* ── Two-column layout: search left, floating cards right ── */}
      <div className="relative max-w-7xl mx-auto xl:grid xl:grid-cols-[1fr_420px] xl:gap-16 xl:items-center">

        {/* LEFT ───────────────────────────────────────────────── */}
        <div className="text-center xl:text-left">

          <p style={anim(80)} className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
            {t.hero.tagline}
          </p>

          <h1 style={anim(180)} className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
            {t.hero.title}{" "}
            <span className="text-secondary">{t.hero.highlight}</span>
          </h1>

          <div style={anim(300)}>
            <Tabs value={tab} onValueChange={setTab} className="mb-6">
              <TabsList className="bg-transparent gap-6 border-b border-white/15 rounded-none xl:justify-start">
                {[
                  { value: "buy", label: t.hero.buyTab },
                  { value: "rent", label: t.hero.rentTab },
                  { value: "sell", label: t.hero.sellTab },
                ].map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="bg-transparent text-white/70 data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none pb-2 font-medium transition-colors duration-200"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <form
            style={anim(420)}
            className="bg-white dark:bg-card/95 rounded-xl flex overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 rounded-none focus-visible:ring-0 text-foreground h-14 text-base bg-transparent"
              placeholder={t.hero.searchPlaceholder}
            />
            <Button type="submit" variant="gold" className="rounded-none rounded-r-xl h-auto px-8 text-base font-semibold">
              {t.hero.search}
            </Button>
          </form>

          {/* Filter pills */}
          <div style={anim(530)} className="flex justify-center xl:justify-start flex-wrap gap-x-2 gap-y-2 mt-5">
            {FILTER_PILLS.map(({ label, param }) => (
              <Button
                key={param}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push(TAB_ROUTES[tab] ?? "/acheter")}
                className="border-white/25 text-white/80 bg-white/15 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground rounded-full transition-all duration-200"
              >
                {label}
                <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
              </Button>
            ))}
          </div>

          {/* Trust badge */}
          {totalCount > 0 && (
            <div style={anim(620)} className="flex justify-center xl:justify-start mt-5">
              <span className="inline-flex items-center gap-2 text-xs text-white/70 bg-white/10 border border-white/15 rounded-full px-4 py-2 hover:bg-white/15 transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <strong className="text-white font-semibold">{totalCount.toLocaleString("fr-FR")}</strong>
                {" "}{t.hero.trustBadge}
              </span>
            </div>
          )}

          {/* Popular areas + Live Trends */}
          <div style={anim(720)} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-3xl mx-auto xl:mx-0 xl:max-w-none items-start">
            <div className="md:pt-4">
              <p className="text-xs font-semibold text-white/45 uppercase tracking-widest mb-3">
                {t.hero.popularAreas}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {POPULAR_AREAS.map((area) => (
                  <Link key={area} href={`/acheter?suburb=${encodeURIComponent(area)}`}
                    className="text-sm text-white/75 hover:text-secondary transition-colors duration-200">
                    {area}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-secondary/20 rounded-lg p-4 space-y-3 hover:bg-white/[0.13] transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Live Trends</span>
                <TrendingUp className="w-3.5 h-3.5 text-secondary/70 ml-auto" />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{t.hero.trendProperties}</span>
                  <span className="font-semibold text-emerald-400">+12%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{t.hero.trendAvgPrice}</span>
                  <span className="font-semibold text-white">$285k</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{t.hero.trendNewToday}</span>
                  <span className="font-semibold text-secondary">{totalCount > 0 ? totalCount : 24}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: floating preview cards ──────────────────────── */}
        {previewProperties.length > 0 && (
          <div
            style={anim(500, 800)}
            className="hidden xl:flex xl:flex-col xl:items-end xl:gap-5 xl:pl-4"
          >
            {previewProperties.slice(0, 2).map((property, i) => (
              <HeroPreviewCard key={property.id} property={property} index={i} />
            ))}
            <p className="text-xs text-white/30 text-right mt-1 italic">{t.hero.verifiedLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Floating mini preview card ─────────────────────────────────── */
function HeroPreviewCard({ property, index }: { property: Property; index: number }) {
  const t = useT();
  const cover = getR2ImageUrl(property.gallery[0]);
  const price = formatPrice(property.price, property.currency, property.period);
  const isSecond = index === 1;

  return (
    <Link
      href={`/property/${property.id}`}
      className={`w-72 bg-white dark:bg-card rounded-2xl shadow-2xl dark:shadow-black/40 overflow-hidden border border-white/10 dark:border-white/[0.06] hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 group ${isSecond ? "ml-8 mr-0" : "mr-8 ml-0"}`}
      style={{
        animation: isSecond
          ? "float-delayed 6s ease-in-out 1.5s infinite"
          : "float 5s ease-in-out infinite",
      }}
    >
      {/* Photo */}
      <div className="relative w-full h-40 bg-muted overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="288px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <span className="text-4xl opacity-30">🏠</span>
          </div>
        )}
        {property.verified && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            {t.hero.verifiedBadge}
          </span>
        )}
        {/* Photo count */}
        {property.gallery.length > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-black/55 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            📷 {property.gallery.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-base font-bold text-foreground">{price}</p>
        <p className="text-xs text-foreground/70 mt-0.5 line-clamp-1">{property.title}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{property.suburb}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {property.bedrooms > 0 && <span>{property.bedrooms} ch.</span>}
            {property.areaSqm > 0 && <span>{property.areaSqm} m²</span>}
          </div>
        </div>
        {property.agent?.name && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
              {property.agent.name[0]}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{property.agent.name}</p>
            <span className="ml-auto text-[10px] font-semibold text-primary group-hover:underline">{t.hero.seeProperty}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
