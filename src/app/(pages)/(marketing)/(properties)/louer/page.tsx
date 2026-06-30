import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByListingType,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

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
    isShortTerm?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds, isShortTerm } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allRent = await getPropertiesByListingType("rent");

  const filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
    isShortTerm: isShortTerm === "true" ? true : undefined,
  };
  const filtered = filterProperties(allRent, filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds, isShortTerm].filter(Boolean).length;
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
