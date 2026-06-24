"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Home, Landmark, Layers, LayoutGrid, DoorOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import PropertyCard from "@/features/properties/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useT } from "@/i18n/useT";
import type { Property } from "@/features/properties/types/property";

/* ─── category chip data ─────────────────────────────────────────────────── */

type CategoryChip = {
  value: string | null;
  labelFr: string;
  labelEn: string;
  labelLn: string;
  Icon: LucideIcon;
};

const CHIPS: CategoryChip[] = [
  { value: null,        labelFr: "Tous les biens",   labelEn: "All properties",   labelLn: "Bandako nyonso", Icon: LayoutGrid },
  { value: "apartment", labelFr: "Appartements",     labelEn: "Apartments",       labelLn: "Appartement",    Icon: Building2  },
  { value: "villa",     labelFr: "Villas",           labelEn: "Villas",           labelLn: "Villas",         Icon: Home       },
  { value: "studio",    labelFr: "Studios",          labelEn: "Studios",          labelLn: "Studios",        Icon: DoorOpen   },
  { value: "townhouse", labelFr: "Maisons de ville", labelEn: "Town houses",      labelLn: "Bandako ya mboka", Icon: Landmark },
  { value: "duplex",    labelFr: "Duplex",           labelEn: "Duplex",           labelLn: "Duplex",         Icon: Layers     },
];

/* ─── skeleton ───────────────────────────────────────────────────────────── */

const SKELETON_COUNT = 3;

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <div className="aspect-4/3 md:aspect-auto md:h-48 bg-muted" />
        <div className="p-5 space-y-3">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */

/**
 * `initialRent` is fetched server-side in page.tsx — the default state
 * (all categories, rent) renders instantly with no client XHR.
 * Any other combination fetches client-side via React Query (cached).
 */
export default function LatestListings({ initialRent }: { initialRent: Property[] }) {
  const t = useT();
  const [tab, setTab]           = useState<"rent" | "sale">("rent");
  const [category, setCategory] = useState<string | null>(null);

  // Determine whether we need a client-side fetch:
  // default state (rent + all categories) uses server-provided initialRent.
  const isDefault = tab === "rent" && category === null;

  const { data: fetchedProperties = [], isFetching } = useProperties(
    { listingType: tab, ...(category ? { category } : {}), limit: 6 },
    { enabled: !isDefault },
  );

  const properties = isDefault ? initialRent : fetchedProperties;
  const isLoading  = !isDefault && isFetching && fetchedProperties.length === 0;

  // Derive "View all" href — include category if selected
  const viewAllBase = tab === "rent" ? "/louer" : "/acheter";
  const viewAllHref = category ? `${viewAllBase}?type=${category}` : viewAllBase;

  return (
    <section className="bg-background py-14 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Category chips ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              {t.home.latestListings.chipsHeading}
            </h2>
            <Button variant="outlineGold" size="sm" className="rounded-full gap-2 px-5 shrink-0" asChild>
              <Link href={viewAllHref}>
                {t.home.latestListings.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {CHIPS.map((chip) => {
              const active = chip.value === category;
              return (
                <button
                  key={chip.value ?? "all"}
                  type="button"
                  onClick={() => setCategory(chip.value)}
                  className={`inline-flex items-center gap-2.5 px-4 h-11 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white dark:bg-card border-border text-foreground/80 hover:border-primary/50 hover:bg-accent/40"
                  }`}
                >
                  <chip.Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary-foreground" : "text-primary"}`} />
                  {chip.labelFr}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Header row: heading + rent/sale toggle ─────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {t.home.latestListings.subheading}
            </p>
          </div>

          <Tabs value={tab} onValueChange={(v) => { setTab(v as "rent" | "sale"); }}>
            <TabsList className="bg-muted rounded-full h-auto p-1 gap-1">
              <TabsTrigger
                value="rent"
                className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
              >
                {t.home.latestListings.tabRent}
              </TabsTrigger>
              <TabsTrigger
                value="sale"
                className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
              >
                {t.home.latestListings.tabSale}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* ── Listings ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : properties.map((property, i) => (
                <PropertyCard key={property.id} property={property} priority={i === 0} />
              ))}
        </div>

      </div>
    </section>
  );
}
