"use client";

import { useT } from "@/i18n/useT";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/features/properties/types/property";
import { Crumb } from "./Breadcrumbs";
import ListingHero from "./ListingHero";
import MapOverlay from "./MapOverlay";
import Pagination from "./Pagination";
import AlertSubscriptionBanner from "./AlertSubscriptionBanner";
import PropertyCard from "./PropertyCard";
import PropertyTypeChips, { CategoryCount } from "./PropertyTypeChips";
import FilterSidebar from "./FilterSidebar";

type Mode = "rent" | "sale" | "buy" | "commercial";

export type PropertyListingPageProps = {
  title: string;
  totalListings: number;
  mode: Mode;
  crumbs: Crumb[];
  categories: CategoryCount[];
  properties: Property[];
  showOffPlanReady?: boolean;
  currentPage?: number;
  totalPages?: number;
  activeFilters?: number;
  typeRoutes?: Record<string, string>;
};

const PER_PAGE = 6;

export default function PropertyListingPage({
  title,
  totalListings,
  mode,
  crumbs,
  categories,
  properties,
  showOffPlanReady,
  currentPage = 1,
  totalPages,
  activeFilters = 0,
  typeRoutes,
}: PropertyListingPageProps) {
  const t = useT();
  const searchParams = useSearchParams();
  const showMap = searchParams.get("map") === "1";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [travelFilterIds, setTravelFilterIds] = useState<string[] | null>(null);

  useEffect(() => {
    function check() {
      const scrolled = document.documentElement.scrollTop || window.scrollY || 0;
      const isLg = window.innerWidth >= 1024;
      setShowFilterSidebar(scrolled > 100 && isLg);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const filteredProperties = useMemo(
    () =>
      travelFilterIds
        ? properties.filter((p) => travelFilterIds.includes(p.id))
        : properties,
    [properties, travelFilterIds],
  );

  const pages = totalPages ?? Math.max(1, Math.ceil(filteredProperties.length / PER_PAGE));
  const visible = totalPages
    ? filteredProperties
    : filteredProperties.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <ListingHero
        title={title}
        totalListings={totalListings}
        crumbs={crumbs}
        mode={mode}
        showOffPlanReady={showOffPlanReady}
        typeRoutes={typeRoutes}
      />

      {/* ── Single unified section — window always scrolls, no context switch ── */}
      <section className="bg-background-alt pb-16 px-6">
        <div className="max-w-screen-2xl mx-auto">

          {/* Chips + toggle — sticky bar below header */}
          <div className="sticky top-28 z-20 bg-background-alt py-3 mb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <PropertyTypeChips categories={categories} />
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Flex row: animated sidebar + cards */}
          <div className="flex items-start gap-6">

            {/* Sidebar — width/opacity animate; no conditional rendering = no scroll jump */}
            <aside
              aria-label="Filtres"
              className="shrink-0 self-start overflow-hidden"
              style={{
                position: "sticky",
                top: "10rem",          // header (7rem) + chips bar (~3rem) ≈ 10rem
                width: showFilterSidebar ? 360 : 0,
                minWidth: showFilterSidebar ? 360 : 0,
                opacity: showFilterSidebar ? 1 : 0,
                pointerEvents: showFilterSidebar ? "auto" : "none",
                transition: "width 300ms ease, min-width 300ms ease, opacity 220ms ease",
                maxHeight: "calc(100vh - 10rem)",
              }}
            >
              {/* Fixed-width inner so content doesn't reflow during animation */}
              <div style={{ width: 360, height: "100%", maxHeight: "calc(100vh - 10rem)" }}>
                <FilterSidebar
                  mode={mode}
                  totalListings={totalListings}
                  properties={properties}
                  onFilter={setTravelFilterIds}
                />
              </div>
            </aside>

            {/* Cards — always window scroll, grid reflows smoothly via CSS transition */}
            <div className="flex-1 min-w-0 pt-2">
              <PropertyGrid
                visible={visible}
                viewMode={viewMode}
                mode={mode}
                t={t}
                sidebar={showFilterSidebar}
              />
              <Pagination current={currentPage} total={pages} />
            </div>
          </div>
        </div>
      </section>

      {showMap && <MapOverlay properties={properties} />}
    </>
  );
}

/* ── View toggle ──────────────────────────────────────────────────── */
function ViewToggle({
  viewMode,
  onChange,
}: {
  viewMode: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-card border border-border rounded-lg p-1 shrink-0">
      <button
        aria-label="Vue grille"
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
          viewMode === "grid"
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
        Grille
      </button>
      <button
        aria-label="Vue liste"
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
          viewMode === "list"
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <rect x="1" y="2" width="14" height="2" rx="1" />
          <rect x="1" y="7" width="14" height="2" rx="1" />
          <rect x="1" y="12" width="14" height="2" rx="1" />
        </svg>
        Liste
      </button>
    </div>
  );
}

/* ── Property grid / list renderer ───────────────────────────────── */
function PropertyGrid({
  visible,
  viewMode,
  mode,
  t,
  sidebar = false,
}: {
  visible: Property[];
  viewMode: "grid" | "list";
  mode: string;
  t: ReturnType<typeof useT>;
  sidebar?: boolean;
}) {
  const empty = (
    <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-12 text-center col-span-full">
      <p className="text-muted-foreground text-sm mb-2">{t.listing.noResults}</p>
      <p className="text-xs text-muted-foreground">{t.listing.noResultsHint}</p>
      <AlertSubscriptionBanner mode={mode as any} />
    </div>
  );

  if (viewMode === "grid") {
    // Sidebar open → 2 cols; full width → 3 cols
    // CSS transition on grid-template-columns makes the reflow smooth
    const cols = sidebar
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
    return (
      <div
        className={`grid gap-4 pb-8 ${cols}`}
        style={{ transition: "grid-template-columns 300ms ease" }}
      >
        {visible.length > 0
          ? visible.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i === 0} variant="grid" />
            ))
          : empty}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {visible.length > 0
        ? visible.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i === 0} variant="list" />
          ))
        : empty}
    </div>
  );
}
