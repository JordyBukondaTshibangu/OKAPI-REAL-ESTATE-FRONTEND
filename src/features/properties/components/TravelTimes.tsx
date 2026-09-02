"use client";

import { ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import CarIcon from "@/shared/components/ui/icons/CarIcon";
import ClockIcon from "@/shared/components/ui/icons/ClockIcon";
import TrainIcon from "@/shared/components/ui/icons/TrainIcon";
import WalkIcon from "@/shared/components/ui/icons/WalkIcon";
import { useT } from "@/i18n/useT";
import {
  NAMED_LOCATIONS,
  distanceKm,
  getPropertyCoords,
  normalize,
  type NamedLocation,
} from "@/features/properties/constants/kinshasaCoords";
import type { Property } from "@/features/properties/types/property";

type Mode = "car" | "train" | "walk";

/** Rough average speeds (km/h) used to turn distance into an estimated duration. */
const MODE_SPEED_KMH: Record<Mode, number> = {
  car: 32,
  train: 22,
  walk: 5,
};

/** Cars slow down a lot more than walking/transit during peak hours. */
const PEAK_PENALTY: Record<Mode, number> = {
  car: 1.7,
  train: 1.2,
  walk: 1,
};

function estimateMinutes(km: number, mode: Mode, peakHours: boolean): number {
  const speed = MODE_SPEED_KMH[mode] / (peakHours ? PEAK_PENALTY[mode] : 1);
  return (km / speed) * 60;
}

export type TravelTimesProps = {
  /** Properties currently shown on the listing; required for filtering to do anything. */
  properties?: Property[];
  /** Called with the list of property ids within range, or null when no filter is active. */
  onFilter?: (ids: string[] | null) => void;
  /**
   * When true, renders as a plain scrollable div (no card shell, no sticky, no heading row).
   * Used when TravelTimes is a tab inside FilterSidebar.
   */
  embedded?: boolean;
};

export default function TravelTimes({ properties, onFilter, embedded }: TravelTimesProps) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NamedLocation | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [travelTime, setTravelTime] = useState(15);
  const [mode, setMode] = useState<Mode>("car");
  const [peakHours, setPeakHours] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const modes = [
    { key: "car" as const, Icon: CarIcon, label: t.travelTimes.byCar },
    { key: "train" as const, Icon: TrainIcon, label: t.travelTimes.byTrain },
    { key: "walk" as const, Icon: WalkIcon, label: t.travelTimes.byFoot },
  ];

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return NAMED_LOCATIONS.filter((l) => normalize(l.label).includes(q)).slice(0, 6);
  }, [query]);

  function handleSelect(loc: NamedLocation) {
    setSelected(loc);
    setQuery(loc.label);
    setShowSuggestions(false);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setShowSuggestions(true);
    if (selected && normalize(value) !== normalize(selected.label)) {
      setSelected(null);
    }
  }

  function handleClear() {
    setQuery("");
    setSelected(null);
    setMatchCount(null);
    onFilter?.(null);
  }

  function handleConfirm() {
    if (!selected) return;
    if (!properties || !onFilter) {
      // Standalone usage (no list to filter): nothing further to do.
      setMatchCount(0);
      return;
    }
    const matches = properties.filter((p) => {
      const km = distanceKm(selected, getPropertyCoords(p));
      return estimateMinutes(km, mode, peakHours) <= travelTime;
    });
    setMatchCount(matches.length);
    onFilter(matches.map((p) => p.id));
  }

  const content = (
    <>
      {/* Heading row — hidden in embedded mode (tab bar is the title) */}
      {!embedded && (
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-foreground">{t.travelTimes.heading}</h3>
            <span className="text-[9px] font-bold uppercase bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
              {t.travelTimes.newBadge}
            </span>
          </div>
          <button
            aria-label={t.travelTimes.collapse}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick-select landmarks */}
      {!selected && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Lieux fréquents</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Centre-ville Gombe", key: "gombe" },
              { label: "Aéroport N'Djili", key: "n'djili" },
              { label: "Univ. de Kinshasa", key: "lemba" },
              { label: "Limete", key: "limete" },
              { label: "Ngaliema", key: "ngaliema" },
            ].map((lm) => {
              const loc = NAMED_LOCATIONS.find((l) => l.key === lm.key);
              if (!loc) return null;
              return (
                <button
                  key={lm.key}
                  type="button"
                  onClick={() => handleSelect({ ...loc, label: lm.label })}
                  className="px-2.5 py-1 rounded-full border border-border text-xs text-foreground hover:border-primary/50 hover:text-primary transition-colors bg-muted/30"
                >
                  {lm.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected location */}
      <div className="mb-5 relative">
        <p className="text-sm font-medium text-foreground mb-2">
          {t.travelTimes.selectedPlace}
        </p>
        <div className="flex items-center gap-2 border border-border rounded-full px-4 h-11 bg-muted/40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-muted-foreground shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            placeholder={t.travelTimes.searchPlace}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label={t.travelTimes.clear}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showSuggestions && query && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-white dark:bg-card shadow-lg overflow-hidden">
            {suggestions.length > 0 ? (
              suggestions.map((loc) => (
                <button
                  key={loc.key}
                  type="button"
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {loc.label}
                </button>
              ))
            ) : (
              <p className="px-4 py-2.5 text-sm text-muted-foreground">
                {t.travelTimes.noLocationsFound}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Travel time slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">{t.travelTimes.maxDuration}</p>
          <p className="text-sm font-semibold text-foreground">{travelTime} min</p>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={travelTime}
          onChange={(e) => setTravelTime(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-5">
        {modes.map(({ key, Icon, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            aria-label={label}
            className={`flex-1 h-11 rounded-lg border flex items-center justify-center transition-colors ${
              mode === key
                ? "border-primary text-primary bg-accent"
                : "border-border text-foreground/70 bg-white dark:bg-card hover:border-primary/40"
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Peak hours toggle */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-foreground">{t.travelTimes.peakHours}</p>
        <button
          role="switch"
          aria-checked={peakHours}
          onClick={() => setPeakHours((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            peakHours ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              peakHours ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <Button className="w-full" disabled={!selected} onClick={handleConfirm}>
        {t.travelTimes.confirm}
      </Button>

      {matchCount !== null && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          {t.travelTimes.resultsCount.replace("{n}", String(matchCount))}
        </p>
      )}
    </>
  );

  if (embedded) {
    return <div className="overflow-y-auto flex-1 p-5 space-y-5">{content}</div>;
  }

  return (
    <aside className="bg-white dark:bg-card rounded-xl border border-border shadow-sm p-5 sticky top-28">
      {content}
    </aside>
  );
}
