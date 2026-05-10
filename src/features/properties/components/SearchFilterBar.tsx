"use client";

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

const TYPES_BY_MODE: Record<
  Mode,
  { value: PropertyCategory; label: string }[]
> = {
  buy: [
    { value: "apartment", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Maison" },
    { value: "land", label: "Terrain" },
    { value: "penthouse", label: "Penthouse" },
    { value: "duplex", label: "Duplex" },
  ],
  sale: [
    { value: "apartment", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Maison" },
    { value: "land", label: "Terrain" },
    { value: "penthouse", label: "Penthouse" },
  ],
  rent: [
    { value: "apartment", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Maison" },
    { value: "studio", label: "Studio" },
    { value: "penthouse", label: "Penthouse" },
  ],
  commercial: [
    { value: "office", label: "Bureau" },
    { value: "retail", label: "Commerce" },
    { value: "warehouse", label: "Entrepôt" },
    { value: "land", label: "Terrain" },
  ],
};

const PRICE_RANGES_BY_MODE: Record<
  Mode,
  { min?: number; max?: number; label: string }[]
> = {
  buy: [
    { label: "Moins de 100 000 $", max: 100000 },
    { label: "100 000 – 250 000 $", min: 100000, max: 250000 },
    { label: "250 000 – 500 000 $", min: 250000, max: 500000 },
    { label: "500 000 – 1 000 000 $", min: 500000, max: 1000000 },
    { label: "Plus de 1 000 000 $", min: 1000000 },
  ],
  sale: [
    { label: "Moins de 100 000 $", max: 100000 },
    { label: "100 000 – 250 000 $", min: 100000, max: 250000 },
    { label: "250 000 – 500 000 $", min: 250000, max: 500000 },
    { label: "Plus de 500 000 $", min: 500000 },
  ],
  rent: [
    { label: "Moins de 1 000 $/mois", max: 1000 },
    { label: "1 000 – 3 000 $/mois", min: 1000, max: 3000 },
    { label: "3 000 – 6 000 $/mois", min: 3000, max: 6000 },
    { label: "Plus de 6 000 $/mois", min: 6000 },
  ],
  commercial: [
    { label: "Moins de 3 000 $/mois", max: 3000 },
    { label: "3 000 – 8 000 $/mois", min: 3000, max: 8000 },
    { label: "Plus de 8 000 $/mois", min: 8000 },
    { label: "Moins de 300 000 $", max: 300000 },
    { label: "Plus de 300 000 $", min: 300000 },
  ],
};

const BEDS_OPTIONS = [
  { value: 1, label: "1+ chambre" },
  { value: 2, label: "2+ chambres" },
  { value: 3, label: "3+ chambres" },
  { value: 4, label: "4+ chambres" },
  { value: 5, label: "5+ chambres" },
];

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
            : "border-border text-foreground/80 hover:border-primary/50 bg-white"
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
        <div className="absolute left-0 mt-1.5 min-w-50 bg-white rounded-xl border border-border shadow-lg z-100 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

export type SearchFilterBarProps = {
  mode: Mode;
  showOffPlanReady?: boolean;
};

export default function SearchFilterBar({
  mode,
  showOffPlanReady,
}: SearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentBeds = searchParams.get("beds") ?? "";

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

  const hasFilters =
    currentType ||
    currentMinPrice ||
    currentMaxPrice ||
    currentBeds ||
    currentQ;

  // Price label
  const priceLabel = (() => {
    if (currentMinPrice && currentMaxPrice)
      return `${Number(currentMinPrice).toLocaleString("fr-FR")} – ${Number(currentMaxPrice).toLocaleString("fr-FR")} $`;
    if (currentMinPrice)
      return `À partir de ${Number(currentMinPrice).toLocaleString("fr-FR")} $`;
    if (currentMaxPrice)
      return `Jusqu'à ${Number(currentMaxPrice).toLocaleString("fr-FR")} $`;
    return null;
  })();

  // Type label
  const typeLabel =
    TYPES_BY_MODE[mode]?.find((t) => t.value === currentType)?.label ?? null;

  // Beds label
  const bedsLabel = currentBeds
    ? `${currentBeds}+ chambre${Number(currentBeds) > 1 ? "s" : ""}`
    : null;

  return (
    <div className="space-y-3 relative">
      {/* Search input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFilter("q", localQ.trim() || null);
        }}
        className="flex items-center gap-2 border border-border rounded-full px-5 h-12 bg-white"
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="search"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder="Commune, quartier ou référence"
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
          Rechercher
        </button>
      </form>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type de bien */}
        <DropdownPill
          label={typeLabel ?? "Type de bien"}
          active={!!currentType}
          onClear={() => setFilter("type", null)}
        >
          <button
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
            onClick={() => setFilter("type", null)}
          >
            Tous les types
          </button>
          {TYPES_BY_MODE[mode]?.map((t) => (
            <button
              key={t.value}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${
                currentType === t.value
                  ? "bg-accent text-primary font-semibold"
                  : ""
              }`}
              onClick={() => setFilter("type", t.value)}
            >
              {t.label}
            </button>
          ))}
        </DropdownPill>

        {/* Chambres (hide for commercial & land) */}
        {mode !== "commercial" && currentType !== "land" && (
          <DropdownPill
            label={bedsLabel ?? "Chambres"}
            active={!!currentBeds}
            onClear={() => setFilter("beds", null)}
          >
            <button
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
              onClick={() => setFilter("beds", null)}
            >
              Toutes
            </button>
            {BEDS_OPTIONS.map((b) => (
              <button
                key={b.value}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${
                  currentBeds === String(b.value)
                    ? "bg-accent text-primary font-semibold"
                    : ""
                }`}
                onClick={() => setFilter("beds", String(b.value))}
              >
                {b.label}
              </button>
            ))}
          </DropdownPill>
        )}

        {/* Prix */}
        <DropdownPill
          label={priceLabel ?? "Prix"}
          active={!!(currentMinPrice || currentMaxPrice)}
          onClear={() => {
            setFilter("minPrice", null);
            setFilter("maxPrice", null);
          }}
        >
          <button
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent text-muted-foreground"
            onClick={() =>
              router.push(buildUrl({ minPrice: null, maxPrice: null }))
            }
          >
            Tous les prix
          </button>
          {PRICE_RANGES_BY_MODE[mode]?.map((r) => {
            const isActive =
              (r.min === undefined || String(r.min) === currentMinPrice) &&
              (r.max === undefined || String(r.max) === currentMaxPrice) &&
              (r.min !== undefined || r.max !== undefined);
            return (
              <button
                key={r.label}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${
                  isActive ? "bg-accent text-primary font-semibold" : ""
                }`}
                onClick={() =>
                  router.push(
                    buildUrl({
                      minPrice: r.min !== undefined ? String(r.min) : null,
                      maxPrice: r.max !== undefined ? String(r.max) : null,
                    }),
                  )
                }
              >
                {r.label}
              </button>
            );
          })}
        </DropdownPill>

        {showOffPlanReady && (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-4 h-10 text-sm bg-white hover:border-primary/50"
            >
              Sur plan <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-4 h-10 text-sm bg-white hover:border-primary/50"
            >
              Prêt <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Divider */}
        <span className="hidden md:inline-block w-px h-6 bg-border mx-1" />

        <button
          aria-label="Trier"
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-foreground/70 hover:border-primary/50"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <button
          aria-label="Alertes"
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-foreground/70 hover:border-primary/50"
        >
          <Bell className="w-4 h-4" />
        </button>

        <Button variant="navy" size="sm" className="gap-2 ml-auto h-10">
          <Map className="w-4 h-4" /> Carte
        </Button>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-destructive py-2.5 px-2 border border-destructive rounded-full cursor-pointer hover:bg-destructive/10"
          >
            Effacer tout
          </button>
        )}
      </div>
    </div>
  );
}
