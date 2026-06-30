import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  filterProperties,
  getPropertiesByListingType,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Biens commerciaux à Kinshasa — Okapi Real Estate",
  description:
    "Bureaux, locaux commerciaux et entrepôts à vendre ou à louer à Kinshasa.",
};

export default async function CommercialPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    isShortTerm?: string;
    rentalDuration?: string;
    minNightPrice?: string;
    maxNightPrice?: string;
    minStay?: string;
    maxStay?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds, isShortTerm, rentalDuration, minNightPrice, maxNightPrice, minStay, maxStay } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allCommercial = await getPropertiesByListingType("commercial");

  const filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
    isShortTerm: isShortTerm === "true" ? true : undefined,
    rentalDuration: (rentalDuration as PropertyFilters["rentalDuration"]) || undefined,
    minNightPrice: minNightPrice ? Number(minNightPrice) : undefined,
    maxNightPrice: maxNightPrice ? Number(maxNightPrice) : undefined,
    minStay: minStay ? Number(minStay) : undefined,
    maxStay: maxStay ? Number(maxStay) : undefined,
  };
  const filtered = filterProperties(allCommercial, filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds, isShortTerm, rentalDuration, minNightPrice, maxNightPrice, minStay, maxStay].filter(
    Boolean,
  ).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Biens commerciaux à vendre et à louer"
      totalListings={filtered.length}
      mode="commercial"
      crumbs={[{ label: "Commercial" }]}
      categories={[
        {
          label: "Bureaux",
          count: allCommercial.filter((p) => p.category === "office").length,
          href: "/commercial/bureaux",
        },
        {
          label: "Magasins",
          count: allCommercial.filter((p) => p.category === "retail").length,
          href: "/commercial/magasins",
        },
        {
          label: "Entrepôts",
          count: allCommercial.filter((p) => p.category === "warehouse").length,
          href: "/commercial/entrepots",
        },
        {
          label: "Terrains",
          count: allCommercial.filter((p) => p.category === "land").length,
          href: "/commercial/terrains",
        },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
