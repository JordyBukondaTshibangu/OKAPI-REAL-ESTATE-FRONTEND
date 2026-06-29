"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ChevronDown, TrendingUp } from "lucide-react";
import { useT } from "@/i18n/useT";

const TAB_ROUTES: Record<string, string> = {
  buy: "/acheter",
  rent: "/louer",
  sell: "/vendre",
};

const POPULAR_AREAS = [
  "Gombe",
  "Ngaliema",
  "Limete",
  "Kintambo",
  "Lingwala",
  "Masina",
];

export default function Hero() {
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
    const base = TAB_ROUTES[tab] ?? "/acheter";
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(params.toString() ? `${base}?${params}` : base);
  }

  return (
    <section className="relative bg-navy text-white py-14 md:py-20 lg:py-32 px-5 md:px-8 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-linear-to-br from-navy via-navy to-primary/30 pointer-events-none"
        aria-hidden="true"
      />
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Tagline + title */}
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {t.hero.tagline}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight">
          {t.hero.title}{" "}
          <span className="text-secondary">{t.hero.highlight}</span>
        </h1>

        {/* Buy / Rent / Sell tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="bg-transparent gap-6 border-b border-white/15 rounded-none">
            {[
              { value: "buy", label: t.hero.buyTab },
              { value: "rent", label: t.hero.rentTab },
              { value: "sell", label: t.hero.sellTab },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="bg-transparent text-white/70 data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none pb-2 font-medium"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search bar */}
        <form
          className="bg-white dark:bg-card/95 rounded-xl flex overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 rounded-none focus-visible:ring-0 text-foreground h-14 text-base bg-transparent"
            placeholder={t.hero.searchPlaceholder}
          />
          <Button
            type="submit"
            variant="gold"
            className="rounded-none rounded-r-xl h-auto px-8 text-base font-semibold"
          >
            {t.hero.search}
          </Button>
        </form>

        {/* Filter pills */}
        <div className="flex justify-center flex-wrap gap-x-2 gap-y-2 mt-5">
          {FILTER_PILLS.map(({ label, param }) => (
            <Button
              key={param}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(TAB_ROUTES[tab] ?? "/acheter")}
              className="border-white/25 text-white/80 bg-white dark:bg-card/8 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground rounded-full transition-all duration-200"
            >
              {label}
              <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
            </Button>
          ))}
        </div>

        {/* Popular areas + Live Trends */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-3xl mx-auto items-start">
          {/* Popular neighbourhoods */}
          <div className="md:pt-4">
            <p className="text-xs font-semibold text-white/45 uppercase tracking-widest mb-3">
              {t.hero.popularAreas}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {POPULAR_AREAS.map((area) => (
                <Link
                  key={area}
                  href={`/acheter?suburb=${encodeURIComponent(area)}`}
                  className="text-sm text-white/75 hover:text-secondary transition-colors duration-200"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Live Trends card */}
          <div className="bg-white dark:bg-card/10 backdrop-blur-sm border border-secondary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Live Trends
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-secondary/70 ml-auto" />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{t.hero.trendProperties}</span>
                <span className="font-semibold text-white">+12%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{t.hero.trendAvgPrice}</span>
                <span className="font-semibold text-white">$285k</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{t.hero.trendNewToday}</span>
                <span className="font-semibold text-secondary">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
