"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { SlidersHorizontal } from "lucide-react";
import type { Property } from "@/features/properties/types/property";
import TravelTimes from "./TravelTimes";

type Mode = "rent" | "sale" | "buy" | "commercial";

interface FilterSidebarProps {
  mode: Mode;
  totalListings: number;
  /** Passed through to TravelTimes for the "Temps de trajet" tab. */
  properties?: Property[];
  /** Called when TravelTimes applies a distance filter. */
  onFilter?: (ids: string[] | null) => void;
}

const RENT_TYPES = [
  { label: "Tous", value: "" },
  { label: "Appartement", value: "apartment" },
  { label: "Studio", value: "studio" },
  { label: "Villa", value: "villa" },
  { label: "Maison de ville", value: "townhouse" },
  { label: "Duplex", value: "duplex" },
  { label: "Bureau", value: "office" },
  { label: "Commerce", value: "retail" },
];

const BUY_TYPES = [
  { label: "Tous", value: "" },
  { label: "Appartement", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Maison de ville", value: "townhouse" },
  { label: "Studio", value: "studio" },
  { label: "Duplex", value: "duplex" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Terrain", value: "land" },
];

const COMMERCIAL_TYPES = [
  { label: "Tous", value: "" },
  { label: "Bureau", value: "office" },
  { label: "Commerce", value: "retail" },
  { label: "Entrepôt", value: "warehouse" },
  { label: "Terrain", value: "land" },
];

const BEDS_OPTIONS = [
  { label: "Toutes les chambres", value: "" },
  { label: "1 chambre", value: "1" },
  { label: "2 chambres", value: "2" },
  { label: "3 chambres", value: "3" },
  { label: "4 chambres", value: "4" },
  { label: "5+ chambres", value: "5" },
];

const AMENITIES = [
  { key: "furnished", label: "Meublés" },
  { key: "ac", label: "Climatisation" },
  { key: "security", label: "Agents de sécurité" },
  { key: "rooftop", label: "Toiture/terrasse" },
  { key: "garden", label: "Jardin" },
  { key: "outdoor_toilet", label: "Toilette extérieure" },
  { key: "wifi", label: "Wi-Fi" },
  { key: "parking", label: "Parking" },
];

type Tab = "filters" | "travel";

export default function FilterSidebar({
  mode,
  totalListings,
  properties,
  onFilter,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const propertyTypes =
    mode === "commercial" ? COMMERCIAL_TYPES : mode === "rent" ? RENT_TYPES : BUY_TYPES;

  const [activeTab, setActiveTab] = useState<Tab>("filters");
  const [showAmenities, setShowAmenities] = useState(false);
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "Kinshasa");
  const [suburb, setSuburb] = useState(searchParams.get("suburb") ?? "");
  const [beds, setBeds] = useState(searchParams.get("beds") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [amenities, setAmenities] = useState<Record<string, boolean>>({});

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (city && city !== "Kinshasa") params.set("city", city);
    if (suburb) params.set("suburb", suburb);
    if (beds) params.set("beds", beds);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (searchParams.get("map")) params.set("map", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [type, city, suburb, beds, minPrice, maxPrice, searchParams, router, pathname]);

  const reset = useCallback(() => {
    setType("");
    setCity("Kinshasa");
    setSuburb("");
    setBeds("");
    setMinPrice("");
    setMaxPrice("");
    setAmenities({});
    router.push(pathname);
  }, [router, pathname]);

  const activeCount = [
    type !== "",
    suburb !== "",
    city !== "Kinshasa" && city !== "",
    beds !== "",
    minPrice !== "",
    maxPrice !== "",
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-primary">
            {activeTab === "filters" ? "Ajoutez vos filtres" : "Temps de trajet"}
          </h2>
          {activeTab === "filters" && activeCount > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-primary rounded-full px-2 py-0.5 hover:bg-primary/80 transition-colors"
              title="Effacer tous les filtres"
            >
              {activeCount} actif{activeCount > 1 ? "s" : ""} ×
            </button>
          )}
        </div>
        <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 rounded-full px-3 py-1 whitespace-nowrap">
          {totalListings.toLocaleString("fr-FR")} Résultats
        </span>
      </div>

      {/* ── Tab switcher ───────────────────────────────────────── */}
      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab("filters")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === "filters"
              ? "text-primary border-b-2 border-primary -mb-px"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Filtres
        </button>
        <button
          onClick={() => setActiveTab("travel")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
            activeTab === "travel"
              ? "text-primary border-b-2 border-primary -mb-px"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Temps de trajet
        </button>
      </div>

      {/* ── Travel tab ─────────────────────────────────────────── */}
      {activeTab === "travel" && (
        <TravelTimes
          embedded
          properties={properties}
          onFilter={onFilter}
        />
      )}

      {/* ── Filters tab ────────────────────────────────────────── */}
      {activeTab === "filters" && (
        <>
          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">

            {/* Type de propriété */}
            <section>
              <h3 className="text-sm font-bold text-foreground mb-3">Type de propriété</h3>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      type === t.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50 dark:hover:border-primary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Localisation */}
            <section>
              <h3 className="text-sm font-bold text-foreground mb-3">Localisation</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Commune</label>
                  <select
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  >
                    <option value="">— Tous —</option>
                    {KINSHASA_COMMUNES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Nombre de chambres */}
            <section>
              <h3 className="text-sm font-bold text-foreground mb-3">Nombre de chambres</h3>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              >
                {BEDS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </section>

            <div className="border-t border-border" />

            {/* Budget */}
            <section>
              <h3 className="text-sm font-bold text-foreground mb-3">Budget</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Minimum</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Maximum</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Équipements — collapsed by default */}
            <section>
              <button
                type="button"
                onClick={() => setShowAmenities((v) => !v)}
                className="flex items-center justify-between w-full group py-0.5"
              >
                <h3 className="text-sm font-bold text-foreground leading-none">Équipements</h3>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showAmenities ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showAmenities && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-3">
                  {AMENITIES.map((a) => (
                    <label key={a.key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={!!amenities[a.key]}
                        onChange={(e) =>
                          setAmenities((prev) => ({ ...prev, [a.key]: e.target.checked }))
                        }
                        className="w-4 h-4 rounded border-border text-primary accent-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                        {a.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-6 pt-3 border-t border-border space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={reset}
                className="py-2.5 px-3 rounded-full text-sm font-semibold border border-border text-primary hover:bg-primary/5 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={apply}
                className="py-2.5 px-3 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Appliquer
              </button>
            </div>
            <button className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <span>⚙️</span>
              Filtres personnalisés (WhatsApp)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
