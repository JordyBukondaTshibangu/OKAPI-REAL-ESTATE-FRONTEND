"use client";

import { useT } from "@/i18n/useT";
import { useSearchParams } from "next/navigation";
import { Property } from "@/features/properties/types/property";
import { Crumb } from "./Breadcrumbs";
import ListingHero from "./ListingHero";
import MapOverlay from "./MapOverlay";
import Pagination from "./Pagination";
import PropertyCard from "./PropertyCard";
import PropertyTypeChips, { CategoryCount } from "./PropertyTypeChips";
import TravelTimes from "./TravelTimes";

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
}: PropertyListingPageProps) {
  const t = useT();
  const searchParams = useSearchParams();
  const showMap = searchParams.get("map") === "1";

  const pages =
    totalPages ?? Math.max(1, Math.ceil(properties.length / PER_PAGE));
  // When totalPages is provided the caller already paginated server-side
  const visible = totalPages
    ? properties
    : properties.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <ListingHero
        title={title}
        totalListings={totalListings}
        crumbs={crumbs}
        mode={mode}
        showOffPlanReady={showOffPlanReady}
      />

      <section className="bg-background-alt pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <PropertyTypeChips categories={categories} />
          </div>

          {activeFilters > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">
                {properties.length}
              </span>{" "}
              {t.listing.foundWithFilters.replace("{count}", String(properties.length))}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            <div className="space-y-5">
              {visible.length > 0 ? (
                visible.map((p) => <PropertyCard key={p.id} property={p} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-12 text-center">
                  <p className="text-muted-foreground text-sm mb-2">
                    {t.listing.noResults}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.listing.noResultsHint}
                  </p>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <TravelTimes />
            </div>
          </div>

          <Pagination current={currentPage} total={pages} />
        </div>
      </section>

      {showMap && <MapOverlay properties={properties} />}
    </>
  );
}
