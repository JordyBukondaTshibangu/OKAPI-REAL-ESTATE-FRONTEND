"use client";

import { useT } from "@/i18n/useT";
import { PropertyCategory } from "@/features/properties/types/property";
import { Button } from "@/shared/components/ui/button";
import {
  Bell,
  ChevronDown,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "rent" | "sale" | "buy" | "commercial";

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  cb: () => void,
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

function DropdownPill({
  label,
  active,
  onClear,
  children,
}: {
  label: string;
  active?: boolean;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(ref, close);

  return (
    <div ref={ref} className={`relative ${open ? "z-100" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 h-10 text-sm transition-colors ${
          active
            ? "border-primary text-primary bg-accent font-medium"
            : "border-border text-foreground/80 hover:border-primary/50 bg-white dark:bg-card"
        }`}
      >
        {label}
        {active && onClear ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.stopPropagation(), onClear())
            }
            className="ml-0.5 hover:text-destructive"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 min-w-50 bg-white dark:bg-card rounded-xl border border-border shadow-lg z-100 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── PriceDropdown ─────────────────────────────────────────────────────── */

function PriceDropdown({
  label,
  active,
  currentMinPrice,
  currentMaxPrice,
  ranges,
  allLabel,
  onClear,
  onSelectRange,
  onApplyCustom,
}: {
  label: string;
  active: boolean;
  currentMinPrice: string;
  currentMaxPrice: string;
  ranges: { min?: number; max?: number; label: string }[];
  allLabel: string;
  onClear: () => void;
  onSelectRange: (min?: number, max?: number) => void;
  onApplyCustom: (min: string, max: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(ref, close);

  return (
    <div ref={ref} className={`relative ${open ? "z-100" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 h-10 text-sm transition-colors ${
          active
            ? "border-primary text-primary bg-accent font-medium"
            : "border-border text-foreground/80 hover:border-primary/50 bg-white dark:bg-card"
        }`}
      >
        {label}
        {active ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), onClear())}
            className="ml-0.5 hover:text-destructive"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-card rounded-xl border border-border shadow-lg z-100 overflow-hidden">
          {/* Preset ranges */}
          <button
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
            onClick={() => { onClear(); setOpen(false); }}
          >
            {allLabel}
          </button>
          {ranges.map((r) => {
            const isActive =
              (r.min === undefined || String(r.min) === currentMinPrice) &&
              (r.max === undefined || String(r.max) === currentMaxPrice) &&
              (r.min !== undefined || r.max !== undefined);
            return (
              <button
                key={r.label}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${isActive ? "bg-accent text-primary font-semibold" : ""}`}
                onClick={() => { onSelectRange(r.min, r.max); setOpen(false); }}
              >
                {r.label}
              </button>
            );
          })}

          {/* Custom range inputs */}
          <div className="border-t border-border px-4 py-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Montant personnalisé ($)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-primary"
              />
              <span className="text-muted-foreground text-xs shrink-0">–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              disabled={!customMin && !customMax}
              onClick={() => { onApplyCustom(customMin, customMax); setCustomMin(""); setCustomMax(""); setOpen(false); }}
              className="w-full rounded-lg bg-primary text-white text-xs font-medium py-1.5 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── BedsDropdown ──────────────────────────────────────────────────────── */

function BedsDropdown({
  label,
  active,
  currentBeds,
  options,
  allLabel,
  onClear,
  onSelect,
}: {
  label: string;
  active: boolean;
  currentBeds: string;
  options: { value: number; label: string }[];
  allLabel: string;
  onClear: () => void;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(ref, close);

  return (
    <div ref={ref} className={`relative ${open ? "z-100" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 h-10 text-sm transition-colors ${
          active
            ? "border-primary text-primary bg-accent font-medium"
            : "border-border text-foreground/80 hover:border-primary/50 bg-white dark:bg-card"
        }`}
      >
        {label}
        {active ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), onClear())}
            className="ml-0.5 hover:text-destructive"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 min-w-50 bg-white dark:bg-card rounded-xl border border-border shadow-lg z-100 overflow-hidden">
          <button
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
            onClick={() => { onClear(); setOpen(false); }}
          >
            {allLabel}
          </button>
          {options.map((b) => (
            <button
              key={b.value}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${currentBeds === String(b.value) ? "bg-accent text-primary font-semibold" : ""}`}
              onClick={() => { onSelect(String(b.value)); setOpen(false); }}
            >
              {b.label}
            </button>
          ))}

          {/* Custom number input */}
          <div className="border-t border-border px-4 py-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Nombre exact</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={20}
                placeholder="ex: 6"
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                disabled={!customVal}
                onClick={() => { onSelect(customVal); setCustomVal(""); setOpen(false); }}
                className="rounded-lg bg-primary text-white text-xs font-medium px-3 py-1.5 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

export type SearchFilterBarProps = {
  mode: Mode;
  showOffPlanReady?: boolean;
  /** Maps a type value (e.g. "villa") to a base route (e.g. "/louer/villas").
   *  When set, selecting a type navigates to that route instead of appending ?type=. */
  typeRoutes?: Record<string, string>;
};

export default function SearchFilterBar({
  mode,
  showOffPlanReady,
  typeRoutes,
}: SearchFilterBarProps) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const TYPES_BY_MODE: Record<
    Mode,
    { value: PropertyCategory; label: string }[]
  > = {
    buy: [
      { value: "apartment", label: t.filters.apartment },
      { value: "villa", label: t.filters.villa },
      { value: "townhouse", label: t.filters.townhouse },
      { value: "land", label: t.filters.land },
      { value: "penthouse", label: t.filters.penthouse },
      { value: "duplex", label: t.filters.duplex },
    ],
    sale: [
      { value: "apartment", label: t.filters.apartment },
      { value: "villa", label: t.filters.villa },
      { value: "townhouse", label: t.filters.townhouse },
      { value: "land", label: t.filters.land },
      { value: "penthouse", label: t.filters.penthouse },
    ],
    rent: [
      { value: "apartment", label: t.filters.apartment },
      { value: "villa", label: t.filters.villa },
      { value: "townhouse", label: t.filters.townhouse },
      { value: "studio", label: t.filters.studio },
      { value: "penthouse", label: t.filters.penthouse },
    ],
    commercial: [
      { value: "office", label: t.filters.office },
      { value: "retail", label: t.filters.retail },
      { value: "warehouse", label: t.filters.warehouse },
      { value: "land", label: t.filters.land },
    ],
  };

  const PRICE_RANGES_BY_MODE: Record<
    Mode,
    { min?: number; max?: number; label: string }[]
  > = {
    buy: [
      { label: t.filters.buyPrice1, max: 100000 },
      { label: t.filters.buyPrice2, min: 100000, max: 250000 },
      { label: t.filters.buyPrice3, min: 250000, max: 500000 },
      { label: t.filters.buyPrice4, min: 500000, max: 1000000 },
      { label: t.filters.buyPrice5, min: 1000000 },
    ],
    sale: [
      { label: t.filters.salePrice1, max: 100000 },
      { label: t.filters.salePrice2, min: 100000, max: 250000 },
      { label: t.filters.salePrice3, min: 250000, max: 500000 },
      { label: t.filters.salePrice4, min: 500000 },
    ],
    rent: [
      { label: t.filters.rentPrice1, max: 1000 },
      { label: t.filters.rentPrice2, min: 1000, max: 3000 },
      { label: t.filters.rentPrice3, min: 3000, max: 6000 },
      { label: t.filters.rentPrice4, min: 6000 },
    ],
    commercial: [
      { label: t.filters.commPrice1, max: 3000 },
      { label: t.filters.commPrice2, min: 3000, max: 8000 },
      { label: t.filters.commPrice3, min: 8000 },
      { label: t.filters.commPrice4, max: 300000 },
      { label: t.filters.commPrice5, min: 300000 },
    ],
  };

  const BEDS_OPTIONS = [
    { value: 1, label: t.filters.bed1 },
    { value: 2, label: t.filters.bed2 },
    { value: 3, label: t.filters.bed3 },
    { value: 4, label: t.filters.bed4 },
    { value: 5, label: t.filters.bed5 },
  ];

  const currentQ = searchParams.get("q") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentBeds = searchParams.get("beds") ?? "";
  const currentIsShortTerm = searchParams.get("isShortTerm") === "true";

  const [localQ, setLocalQ] = useState(currentQ);

  function buildUrl(overrides: Record<string, string | null>) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page"); // reset pagination on filter change
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    });
    return `${pathname}?${p.toString()}`;
  }

  function setFilter(key: string, value: string | null) {
    router.push(buildUrl({ [key]: value }));
  }

  function clearAll() {
    router.push(pathname);
    setLocalQ("");
  }

  function setTypeFilter(value: string | null) {
    if (value && typeRoutes && typeRoutes[value]) {
      // Navigate to the dedicated route, preserving non-type filters
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");
      p.delete("type");
      const qs = p.toString();
      router.push(typeRoutes[value] + (qs ? `?${qs}` : ""));
    } else {
      setFilter("type", value);
    }
  }

  const hasFilters =
    currentType ||
    currentMinPrice ||
    currentMaxPrice ||
    currentBeds ||
    currentQ ||
    currentIsShortTerm;

  // Price label
  const priceLabel = (() => {
    if (currentMinPrice && currentMaxPrice)
      return `${Number(currentMinPrice).toLocaleString("fr-FR")} – ${Number(currentMaxPrice).toLocaleString("fr-FR")} $`;
    if (currentMinPrice)
      return `${t.filters.priceFrom} ${Number(currentMinPrice).toLocaleString("fr-FR")} $`;
    if (currentMaxPrice)
      return `${t.filters.priceUpTo} ${Number(currentMaxPrice).toLocaleString("fr-FR")} $`;
    return null;
  })();

  // Type label
  const typeLabel =
    TYPES_BY_MODE[mode]?.find((t) => t.value === currentType)?.label ?? null;

  // Beds label
  const bedsLabel = currentBeds
    ? BEDS_OPTIONS.find((b) => b.value === Number(currentBeds))?.label ?? null
    : null;

  return (
    <div className="space-y-3 relative">
      {/* Search input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFilter("q", localQ.trim() || null);
        }}
        className="flex items-center gap-2 border border-border rounded-full px-5 h-12 bg-white dark:bg-card"
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="search"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder={t.filters.searchPlaceholder}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
        />
        {localQ && (
          <button
            type="button"
            onClick={() => {
              setLocalQ("");
              setFilter("q", null);
            }}
          >
            {/* <X className="w-4 h-4 text-muted-foreground hover:text-foreground" /> */}
          </button>
        )}
        <button
          type="submit"
          className="text-primary text-xs font-medium hover:underline shrink-0"
        >
          {t.filters.searchBtn}
        </button>
      </form>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type de bien */}
        <DropdownPill
          label={typeLabel ?? t.filters.typePlaceholder}
          active={!!currentType}
          onClear={() => setFilter("type", null)}
        >
          <button
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
            onClick={() => setFilter("type", null)}
          >
            {t.filters.allTypes}
          </button>
          {TYPES_BY_MODE[mode]?.map((item) => (
            <button
              key={item.value}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${
                currentType === item.value
                  ? "bg-accent text-primary font-semibold"
                  : ""
              }`}
              onClick={() => setTypeFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </DropdownPill>

        {/* Chambres (hide for commercial & land) */}
        {mode !== "commercial" && currentType !== "land" && (
          <BedsDropdown
            label={bedsLabel ?? t.filters.bedsPlaceholder}
            active={!!currentBeds}
            currentBeds={currentBeds}
            options={BEDS_OPTIONS}
            allLabel={t.filters.allBeds}
            onClear={() => setFilter("beds", null)}
            onSelect={(v) => setFilter("beds", v)}
          />
        )}

        {/* Prix */}
        <PriceDropdown
          label={priceLabel ?? t.filters.pricePlaceholder}
          active={!!(currentMinPrice || currentMaxPrice)}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
          ranges={PRICE_RANGES_BY_MODE[mode] ?? []}
          allLabel={t.filters.allPrices}
          onClear={() => router.push(buildUrl({ minPrice: null, maxPrice: null }))}
          onSelectRange={(min, max) =>
            router.push(
              buildUrl({
                minPrice: min !== undefined ? String(min) : null,
                maxPrice: max !== undefined ? String(max) : null,
              }),
            )
          }
          onApplyCustom={(min, max) =>
            router.push(
              buildUrl({
                minPrice: min ? min : null,
                maxPrice: max ? max : null,
              }),
            )
          }
        />

        {/* Courte durée toggle */}
        {(mode === "rent" || mode === "commercial") && (
          <button
            type="button"
            onClick={() => setFilter("isShortTerm", currentIsShortTerm ? null : "true")}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 h-10 text-sm transition-colors ${
              currentIsShortTerm
                ? "border-primary text-primary bg-accent font-medium"
                : "border-border text-foreground/80 hover:border-primary/50 bg-white dark:bg-card"
            }`}
          >
            Courte durée
            {currentIsShortTerm && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setFilter("isShortTerm", null); }}
                onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), setFilter("isShortTerm", null))}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>
        )}

        {showOffPlanReady && (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-4 h-10 text-sm bg-white dark:bg-card hover:border-primary/50"
            >
              {t.filters.offPlan} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-4 h-10 text-sm bg-white dark:bg-card hover:border-primary/50"
            >
              {t.filters.ready} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Divider */}
        <span className="hidden lg:inline-block w-px h-6 bg-border mx-1" />

        <button
          aria-label={t.filters.ariaSortBtn}
          className="w-10 h-10 rounded-full border border-border bg-white dark:bg-card flex items-center justify-center text-foreground/70 hover:border-primary/50"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <button
          aria-label={t.filters.ariaAlertsBtn}
          className="w-10 h-10 rounded-full border border-border bg-white dark:bg-card flex items-center justify-center text-foreground/70 hover:border-primary/50"
        >
          <Bell className="w-4 h-4" />
        </button>

        <Button
          variant="navy"
          size="sm"
          className="gap-2 ml-auto h-10 shrink-0"
          onClick={() => setFilter("map", "1")}
        >
          <Map className="w-4 h-4" /> {t.filters.map}
        </Button>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-destructive py-2.5 px-2 border border-destructive rounded-full cursor-pointer hover:bg-destructive/10"
          >
            {t.filters.clearAll}
          </button>
        )}
      </div>
    </div>
  );
}
