import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByCategory,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";



export const metadata = {
  title: "Maisons de ville à vendre à Kinshasa — Okapi Real Estate",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("sale", "townhouse");
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
      title="Maisons de ville à vendre à Kinshasa"
      totalListings={all.length}
      mode="buy"
      crumbs={[{ label: "Acheter", href: "/acheter" }, { label: "Maisons de ville" }]}
      categories={[
        { label: "Appartements", count: 0, href: "/acheter/appartements" },
        { label: "Villas", count: 0, href: "/acheter/villas" },
        { label: "Maisons de ville", count: all.length, href: "/acheter/maisons-ville" },
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
