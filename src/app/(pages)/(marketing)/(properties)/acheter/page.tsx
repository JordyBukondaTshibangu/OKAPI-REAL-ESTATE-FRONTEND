import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  filterProperties,
  getPropertiesByListingType,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Biens à acheter à Kinshasa — Okapi Real Estate",
  description:
    "Trouvez le bien idéal à acheter à Kinshasa avec Okapi Real Estate.",
};

export default async function AcheterPage({
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
    city?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds, suburb, city } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allSale = await getPropertiesByListingType("sale");

  const filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
    suburb: suburb || undefined,
    city: city || undefined,
  };
  const filtered = filterProperties(allSale, filters);

  const activeFilters = [q, type, minPrice, maxPrice, beds, suburb, city].filter(
    Boolean,
  ).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Biens à acheter à Kinshasa"
      totalListings={filtered.length}
      mode="buy"
      crumbs={[{ label: "Biens à acheter à Kinshasa" }]}
      categories={[
        {
          label: "Appartements",
          count: allSale.filter((p) => p.category === "apartment").length,
          href: "/acheter/appartements",
        },
        {
          label: "Villas",
          count: allSale.filter((p) => p.category === "villa").length,
          href: "/acheter/villas",
        },
        {
          label: "Maisons de ville",
          count: allSale.filter((p) => p.category === "townhouse").length,
          href: "/acheter/maisons-ville",
        },
        {
          label: "Terrains",
          count: allSale.filter((p) => p.category === "land").length,
          href: "/acheter/terrains",
        },
        {
          label: "Penthouses",
          count: allSale.filter((p) => p.category === "penthouse").length,
          href: "/acheter/appartements",
        },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
      showOffPlanReady
    />
  );
}
