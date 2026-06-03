"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import CarIcon from "@/shared/components/ui/icons/CarIcon";
import ClockIcon from "@/shared/components/ui/icons/ClockIcon";
import TrainIcon from "@/shared/components/ui/icons/TrainIcon";
import WalkIcon from "@/shared/components/ui/icons/WalkIcon";
import { useT } from "@/i18n/useT";

export default function TravelTimes() {
  const t = useT();
  const [travelTime, setTravelTime] = useState(15);
  const [mode, setMode] = useState<"car" | "train" | "walk">("car");
  const [peakHours, setPeakHours] = useState(false);

  const modes = [
    { key: "car" as const, Icon: CarIcon, label: t.travelTimes.byCar },
    { key: "train" as const, Icon: TrainIcon, label: t.travelTimes.byTrain },
    { key: "walk" as const, Icon: WalkIcon, label: t.travelTimes.byFoot },
  ];

  return (
    <aside className="bg-white dark:bg-card rounded-xl border border-border shadow-sm p-5 sticky top-28">
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

      {/* Selected location */}
      <div className="mb-5">
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
            className="w-4 h-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder={t.travelTimes.searchPlace}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
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

      <Button className="w-full" disabled>
        {t.travelTimes.confirm}
      </Button>
    </aside>
  );
}
