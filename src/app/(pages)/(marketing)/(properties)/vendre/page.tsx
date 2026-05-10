import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByListingType,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Biens à vendre à Kinshasa — Okapi Real Estate",
  description:
    "Parcourez les biens à vendre à Kinshasa : appartements, villas, terrains et plus encore.",
};

export default async function VendrePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allSale = await getPropertiesByListingType("sale");

  const filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
  };
  const filtered = filterProperties(allSale, filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds].filter(Boolean).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Biens à vendre à Kinshasa"
      totalListings={filtered.length}
      mode="buy"
      crumbs={[{ label: "Biens à vendre à Kinshasa" }]}
      categories={[
        {
          label: "Appartements",
          count: allSale.filter((p) => p.category === "apartment").length,
          href: "/vendre/appartement",
        },
        {
          label: "Maisons",
          count: allSale.filter((p) => p.category === "townhouse").length,
          href: "/vendre/maison",
        },
        {
          label: "Villas",
          count: allSale.filter((p) => p.category === "villa").length,
          href: "/acheter/villas",
        },
        {
          label: "Terrains",
          count: allSale.filter((p) => p.category === "land").length,
          href: "/acheter/terrains",
        },
        { label: "Estimation gratuite", count: 0, href: "/vendre/estimation" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
      showOffPlanReady
    />
  );
}
