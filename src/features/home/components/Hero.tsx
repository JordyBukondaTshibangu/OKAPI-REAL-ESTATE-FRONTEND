"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ChevronDown, Map, MapPin, Search } from "lucide-react";
import { useT } from "@/i18n/useT";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { getR2ImageUrl } from "@/shared/utils/utils";
import { formatPrice } from "@/lib/properties";
import type { Property } from "@/features/properties/types/property";

const TAB_ROUTES: Record<string, string> = {
  buy: "/acheter",
  rent: "/louer",
};

const POPULAR_AREAS = [
  "Gombe",
  "Ngaliema",
  "Limete",
  "Kintambo",
  "Lingwala",
  "Masina",
];

const ALL_COMMUNES = [
  "Gombe",
  "Ngaliema",
  "Limete",
  "Kintambo",
  "Lingwala",
  "Masina",
  "Barumbu",
  "Kinshasa",
  "Bandalungwa",
  "Kalamu",
  "Lemba",
  "Matete",
  "Ndjili",
  "Makala",
  "Mont-Ngafula",
  "Ngaba",
  "Selembao",
  "Bumbu",
  "Kisenso",
  "Maluku",
  "Nsele",
  "Kimbanseke",
  "Kimbaseke",
  "Kasavubu",
  "Rond-Point Victoire",
  "Matonge",
  "Binza",
  "Ozone",
];

/** Staggered CSS fade-in-up */
function anim(delayMs: number, durationMs = 600) {
  return {
    animation: `fade-in-up ${durationMs}ms ease-out ${delayMs}ms both`,
  } as React.CSSProperties;
}

/* ── Typewriter with colored segments ── */
function useTypewriter(segments: [string, string | null][], speed = 45) {
  const fullText = segments.map(([t]) => t).join("");
  // Store charCount together with which text it belongs to so we can
  // derive a 0 value when fullText changes without a synchronous setState.
  const [state, setState] = useState({ charCount: 0, done: false, forText: fullText });

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      const done = i >= fullText.length;
      setState({ charCount: i, done, forText: fullText });
      if (done) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [fullText, speed]);

  // When fullText has changed but the effect hasn't ticked yet, treat charCount as 0.
  const charCount = state.forText === fullText ? state.charCount : 0;
  const done = state.forText === fullText ? state.done : false;

  const { nodes } = segments.reduce<{ nodes: React.ReactNode[]; remaining: number }>(
    ({ nodes, remaining }, [seg, cls], idx) => {
      if (remaining <= 0) return { nodes: [...nodes, null], remaining: 0 };
      const visible = seg.slice(0, remaining);
      const node = cls
        ? <span key={idx} className={cls}>{visible}</span>
        : <span key={idx}>{visible}</span>;
      return { nodes: [...nodes, node], remaining: remaining - seg.length };
    },
    { nodes: [], remaining: charCount },
  );

  return { nodes, done };
}

interface HeroProps {
  previewProperties?: Property[];
  totalCount?: number;
}

export default function Hero({
  previewProperties = [],
  totalCount = 0,
}: HeroProps) {
  const router = useRouter();
  const t = useT();
  const [tab, setTab] = useState("buy");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions =
    query.trim().length > 0
      ? ALL_COMMUNES.filter((c) =>
          c.toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 8)
      : [];
  const heroSegments: [string, string | null][] = [
    [t.hero.titlePart1, null],
    [t.hero.titleVerified, "text-emerald-400"],
    [t.hero.titlePart2, null],
    [t.hero.highlight, "text-secondary"],
  ];
  const { nodes, done } = useTypewriter(heroSegments, 45);

  const FILTER_PILLS = [
    { label: t.hero.filterType, param: "type" },
    { label: t.hero.filterBedrooms, param: "beds" },
    { label: t.hero.filterMinPrice, param: "minPrice" },
    { label: t.hero.filterMaxPrice, param: "maxPrice" },
  ];

  function handleSearch() {
    const raw = query.trim();
    if (!raw) {
      router.push(TAB_ROUTES[tab] ?? "/acheter");
      return;
    }
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
    <section className="relative bg-navy text-white py-8 md:py-12 lg:py-16 px-5 md:px-8 overflow-hidden">
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 bg-linear-to-br from-navy via-navy to-primary/30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Orbs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl"
          style={{ animation: "orb-drift-a 18s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 -left-24 w-[380px] h-[380px] rounded-full bg-secondary/15 blur-3xl"
          style={{ animation: "orb-drift-b 22s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-primary/10 blur-2xl"
          style={{ animation: "orb-drift-a 14s ease-in-out 4s infinite" }}
        />
      </div>

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />

      {/* Two-column layout */}
      <div className="relative max-w-6xl mx-auto xl:grid xl:grid-cols-[1fr_420px] xl:gap-16 xl:items-center">
        {/* LEFT */}
        <div className="text-center xl:text-left">
          <p
            style={anim(80)}
            className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4"
          >
            {t.hero.tagline}
          </p>

          {/* Typewriter headline */}
          <h1
            style={anim(120, 200)}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 md:mb-8 leading-tight min-h-[3.5rem] md:min-h-[5rem] md:whitespace-nowrap"
          >
            {nodes}
            {!done && (
              <span
                aria-hidden="true"
                className="inline-block w-[3px] h-[0.85em] bg-secondary ml-1 align-middle"
                style={{ animation: "cursor-blink 0.8s step-end infinite" }}
              />
            )}
          </h1>

          {/* Search card */}
          <div
            style={anim(300)}
            ref={searchContainerRef}
            className="relative max-w-[920px]"
          >
            {/* Card shell — corners adapt when dropdown is open */}
            <div
              className={`bg-white dark:bg-card shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-[border-radius] duration-150 ${searchFocused ? "rounded-t-xl" : "rounded-xl"}`}
            >
              {/* Tabs */}
              <div className="px-5 pt-4">
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="bg-transparent gap-6 border-b border-border/60 rounded-none w-full justify-start pb-0">
                    {[
                      { value: "buy", label: t.hero.buyTab },
                      { value: "rent", label: t.hero.rentTab },
                    ].map(({ value, label }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="bg-transparent text-foreground/50 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-medium transition-colors"
                      >
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Search input */}
              <form
                className="flex items-center gap-3 px-5 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchFocused(false);
                  handleSearch();
                }}
              >
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="flex-1 border-0 rounded-none focus-visible:ring-0 text-foreground h-14 text-lg bg-transparent px-0 placeholder:text-muted-foreground/60"
                  placeholder={t.hero.searchPlaceholder}
                />
                <Button
                  type="submit"
                  variant="gold"
                  className="rounded-lg px-8 h-12 text-sm font-semibold shrink-0"
                >
                  {t.hero.search}
                </Button>
              </form>

              {/* Filter pills */}
              <div className="flex items-center gap-2 px-5 pb-4 flex-wrap border-t border-border/30 pt-3">
                {FILTER_PILLS.map(({ label, param }) => (
                  <Button
                    key={param}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(TAB_ROUTES[tab] ?? "/acheter")}
                    className="border-border text-foreground/70 bg-transparent hover:bg-accent hover:border-primary/50 rounded-full text-xs h-8 px-3"
                  >
                    {label}
                    <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`${TAB_ROUTES[tab] ?? "/acheter"}?map=1`)
                  }
                  className="border-border text-foreground/70 bg-transparent hover:bg-accent hover:border-primary/50 rounded-full text-xs h-8 px-3 ml-auto"
                >
                  <Map className="w-3 h-3 mr-1" />
                  Carte
                </Button>
              </div>
            </div>

            {/* Suggestions dropdown — floats below, corners match */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full z-50 bg-white dark:bg-card rounded-b-xl shadow-[0_16px_40px_rgba(0,0,0,0.22)] overflow-hidden border-t border-border/20">
                {suggestions.length > 0 ? (
                  /* Typing — district chips */
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                      Districts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((commune) => (
                        <button
                          key={commune}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setQuery(commune);
                            setSearchFocused(false);
                            handleSearch();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary text-sm text-foreground/80 transition-colors"
                        >
                          <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
                          {commune}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Idle — popular locations */
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                      {t.hero.popularAreas}
                    </p>
                    <ul>
                      {POPULAR_AREAS.slice(0, 4).map((area) => (
                        <li key={area}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setQuery(area);
                              setSearchFocused(false);
                              router.push(
                                `${TAB_ROUTES[tab] ?? "/acheter"}?suburb=${encodeURIComponent(area)}`,
                              );
                            }}
                            className="w-full flex items-center gap-2.5 py-1.5 px-2 hover:bg-accent rounded-lg transition-colors text-left group"
                          >
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                              <MapPin className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {area}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              · Kinshasa
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trust badge */}
          {totalCount > 0 && (
            <div
              style={anim(500)}
              className="flex justify-center xl:justify-start mt-4"
            >
              <span className="inline-flex items-center gap-2 text-xs text-white/70 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <strong className="text-white font-semibold">
                  {totalCount.toLocaleString("fr-FR")}
                </strong>{" "}
                {t.hero.trustBadge}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: floating preview cards — not clickable */}
        {previewProperties.length > 0 && (
          <div
            style={anim(500, 800)}
            className="hidden xl:flex xl:flex-col xl:items-end xl:gap-5 xl:pl-4"
          >
            {previewProperties.slice(0, 2).map((property, i) => (
              <HeroPreviewCard
                key={property.id}
                property={property}
                index={i}
              />
            ))}
            <p className="text-xs text-white/30 text-right mt-1 italic">
              {t.hero.verifiedLabel}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ── Floating preview card — display only, not a link ── */
function HeroPreviewCard({
  property,
  index,
}: {
  property: Property;
  index: number;
}) {
  const t = useT();
  const cover = getR2ImageUrl(property.gallery[0]);
  const price = formatPrice(property.price, property.currency, property.period);
  const isSecond = index === 1;

  return (
    <div
      className={`w-72 bg-white dark:bg-card rounded-2xl shadow-2xl dark:shadow-black/40 overflow-hidden border border-white/10 dark:border-white/[0.06] ${isSecond ? "ml-8 mr-0" : "mr-8 ml-0"}`}
      style={{
        animation: isSecond
          ? "float-delayed 6s ease-in-out 1.5s infinite"
          : "float 5s ease-in-out infinite",
      }}
    >
      <div className="relative w-full h-40 bg-muted overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="288px"
            className="object-cover"
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
        {property.gallery.length > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-black/55 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            📷 {property.gallery.length}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-base font-bold text-foreground">{price}</p>
        <p className="text-xs text-foreground/70 mt-0.5 line-clamp-1">
          {property.title}
        </p>
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
            <p className="text-[11px] text-muted-foreground truncate">
              {property.agent.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
