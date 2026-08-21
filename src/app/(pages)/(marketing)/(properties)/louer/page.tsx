import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByListingType,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";
import { parseSearchQuery } from "@/lib/parseSearchQuery";

export const metadata = {
  title: "Biens à louer à Kinshasa — Okapi Real Estate",
  description:
    "Découvrez les biens à louer à Kinshasa : appartements, villas, maisons et plus encore.",
};

export default async function LouerPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    suburb?: string;
    isShortTerm?: string;
    rentalDuration?: string;
    minNightPrice?: string;
    maxNightPrice?: string;
    minStay?: string;
    maxStay?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds, isShortTerm, rentalDuration, minNightPrice, maxNightPrice, minStay, maxStay, suburb } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  // Parse natural language from q to enrich structured filters
  const parsed = q ? parseSearchQuery(q) : {};

  const allRent = await getPropertiesByListingType("rent");

  const filters: PropertyFilters = {
    q: parsed.cleanQ || undefined,
    type: type || parsed.category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : parsed.beds,
    suburb: suburb || parsed.suburb || undefined,
    isShortTerm: isShortTerm === "true" ? true : undefined,
    rentalDuration: (rentalDuration as PropertyFilters["rentalDuration"]) || undefined,
    minNightPrice: minNightPrice ? Number(minNightPrice) : undefined,
    maxNightPrice: maxNightPrice ? Number(maxNightPrice) : undefined,
    minStay: minStay ? Number(minStay) : undefined,
    maxStay: maxStay ? Number(maxStay) : undefined,
  };
  const filtered = filterProperties(allRent, filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds, suburb, isShortTerm, rentalDuration, minNightPrice, maxNightPrice, minStay, maxStay].filter(Boolean).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Biens à louer à Kinshasa"
      totalListings={filtered.length}
      mode="rent"
      crumbs={[{ label: "Biens à louer à Kinshasa" }]}
      categories={[
        {
          label: "Appartements",
          count: allRent.filter((p) => p.category === "apartment").length,
          href: "/louer/appartements",
        },
        {
          label: "Studios",
          count: allRent.filter((p) => p.category === "studio").length,
          href: "/louer/studios",
        },
        {
          label: "Villas",
          count: allRent.filter((p) => p.category === "villa").length,
          href: "/louer/villas",
        },
        {
          label: "Maisons de ville",
          count: allRent.filter((p) => p.category === "townhouse").length,
          href: "/louer/maisons-ville",
        },
        {
          label: "Penthouses",
          count: allRent.filter((p) => p.category === "penthouse").length,
          href: "/louer/appartements",
        },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
