import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByCategory,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Appartements à vendre à Kinshasa — Okapi Real Estate",
  description: "Trouvez les meilleurs appartements à acheter à Kinshasa.",
};

export default async function Page({
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

  const raw = await getPropertiesByCategory("sale", "apartment");
  const filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
  };
  const filtered = filterProperties(raw, filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds].filter(Boolean).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Appartements à vendre à Kinshasa"
      totalListings={filtered.length}
      mode="buy"
      crumbs={[{ label: "Acheter", href: "/acheter" }, { label: "Appartements" }]}
      categories={[
        { label: "Appartements", count: raw.length, href: "/acheter/appartements" },
        { label: "Villas", count: 0, href: "/acheter/villas" },
        { label: "Maisons de ville", count: 0, href: "/acheter/maisons-ville" },
        { label: "Terrains", count: 0, href: "/acheter/terrains" },
        { label: "Penthouses", count: 0, href: "/acheter/penthouses" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
