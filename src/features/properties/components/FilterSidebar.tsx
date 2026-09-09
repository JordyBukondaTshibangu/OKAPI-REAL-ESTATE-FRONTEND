"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";
import { SlidersHorizontal } from "lucide-react";
import type { Property } from "@/features/properties/types/property";
import TravelTimes from "./TravelTimes";
import { useT } from "@/i18n/useT";

type Mode = "rent" | "sale" | "buy" | "commercial";

interface FilterSidebarProps {
  mode: Mode;
  totalListings: number;
  /** Passed through to TravelTimes for the "Temps de trajet" tab. */
  properties?: Property[];
  /** Called when TravelTimes applies a distance filter. */
  onFilter?: (ids: string[] | null) => void;
}


export default function FilterSidebar({
  mode,
  totalListings,
  properties,
  onFilter,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters: tf } = useT();

  const RENT_TYPES = [
    { label: tf.allTypes, value: "" },
    { label: tf.apartment, value: "apartment" },
    { label: tf.studio, value: "studio" },
    { label: tf.villa, value: "villa" },
    { label: tf.townhouse, value: "townhouse" },
    { label: tf.duplex, value: "duplex" },
    { label: tf.office, value: "office" },
    { label: tf.retail, value: "retail" },
  ];

  const BUY_TYPES = [
    { label: tf.allTypes, value: "" },
    { label: tf.apartment, value: "apartment" },
    { label: tf.villa, value: "villa" },
    { label: tf.townhouse, value: "townhouse" },
    { label: tf.studio, value: "studio" },
    { label: tf.duplex, value: "duplex" },
    { label: tf.penthouse, value: "penthouse" },
    { label: tf.land, value: "land" },
  ];

  const COMMERCIAL_TYPES = [
    { label: tf.allTypes, value: "" },
    { label: tf.office, value: "office" },
    { label: tf.retail, value: "retail" },
    { label: tf.warehouse, value: "warehouse" },
    { label: tf.land, value: "land" },
  ];

  const BEDS_OPTIONS = [
    { label: tf.sidebarAllBedrooms, value: "" },
    { label: tf.sidebarBed1, value: "1" },
    { label: tf.sidebarBed2, value: "2" },
    { label: tf.sidebarBed3, value: "3" },
    { label: tf.sidebarBed4, value: "4" },
    { label: tf.sidebarBed5, value: "5" },
  ];

  const AMENITIES = [
    { key: "furnished", label: tf.amenityFurnished },
    { key: "ac", label: tf.amenityAC },
    { key: "security", label: tf.amenitySecurity },
    { key: "rooftop", label: tf.amenityRooftop },
    { key: "garden", label: tf.amenityGarden },
    { key: "outdoor_toilet", label: tf.amenityOutdoorToilet },
    { key: "wifi", label: tf.amenityWifi },
    { key: "parking", label: tf.amenityParking },
  ];

  const propertyTypes =
    mode === "commercial" ? COMMERCIAL_TYPES : mode === "rent" ? RENT_TYPES : BUY_TYPES;

  const [showAmenities, setShowAmenities] = useState(false);
  const [showTravel, setShowTravel] = useState(false);
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
          <h2 className="text-sm font-bold text-primary">{tf.sidebarTitle}</h2>
          {activeCount > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-primary rounded-full px-2 py-0.5 hover:bg-primary/80 transition-colors"
              title={tf.sidebarReset}
            >
              {activeCount} {activeCount > 1 ? tf.sidebarActivePlural : tf.sidebarActive} ×
            </button>
          )}
        </div>
        <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 rounded-full px-3 py-1 whitespace-nowrap">
          {totalListings.toLocaleString("fr-FR")} {tf.sidebarResults}
        </span>
      </div>

      {/* ── Single scrollable body ─────────────────────────────── */}
      <>
          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 min-h-0 p-6 space-y-6">

            {/* Type de propriété */}
            <section>
              <h3 className="text-sm font-bold text-foreground mb-3">{tf.sidebarPropType}</h3>
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
              <h3 className="text-sm font-bold text-foreground mb-3">{tf.sidebarLocation}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{tf.sidebarCity}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{tf.sidebarCommune}</label>
                  <select
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  >
                    <option value="">{tf.sidebarAllCommunes}</option>
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
              <h3 className="text-sm font-bold text-foreground mb-3">{tf.sidebarBedrooms}</h3>
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
              <h3 className="text-sm font-bold text-foreground mb-3">{tf.sidebarBudget}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{tf.sidebarMin}</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{tf.sidebarMax}</label>
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
                <h3 className="text-sm font-bold text-foreground leading-none">{tf.sidebarAmenities}</h3>
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

            <div className="border-t border-border" />

            {/* Temps de trajet — collapsible */}
            <section>
              <button
                type="button"
                onClick={() => setShowTravel((v) => !v)}
                className="flex items-center justify-between w-full group py-0.5"
              >
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 className="text-sm font-bold text-foreground leading-none">{tf.sidebarTravel}</h3>
                </div>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showTravel ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showTravel && (
                <div className="mt-3 -mx-6">
                  <TravelTimes embedded properties={properties} onFilter={onFilter} />
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
                {tf.sidebarReset}
              </button>
              <button
                onClick={apply}
                className="py-2.5 px-3 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {tf.sidebarApply}
              </button>
            </div>
          </div>
        </>
    </div>
  );
}
