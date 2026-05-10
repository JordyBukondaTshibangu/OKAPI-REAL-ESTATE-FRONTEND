
import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = {
  title: "Terrains à vendre à Kinshasa — Okapi Real Estate",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("sale", "land");
  const _filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
  };
  const all = filterProperties(raw, _filters);
  const activeFilters = [q, type, minPrice, maxPrice, beds].filter(Boolean).length;
  const { items, totalPages } = paginateProperties(all, currentPage);

  return (
    <PropertyListingPage
      title="Terrains à vendre à Kinshasa"
      totalListings={all.length}
      mode="buy"
      crumbs={[{ label: "Acheter", href: "/acheter" }, { label: "Terrains" }]}
      categories={[
        { label: "Appartements", count: 0, href: "/acheter/appartements" },
        { label: "Villas", count: 0, href: "/acheter/villas" },
        { label: "Maisons de ville", count: 0, href: "/acheter/maisons-ville" },
        { label: "Terrains", count: all.length, href: "/acheter/terrains" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
    activeFilters={activeFilters}
    />
  );
}
