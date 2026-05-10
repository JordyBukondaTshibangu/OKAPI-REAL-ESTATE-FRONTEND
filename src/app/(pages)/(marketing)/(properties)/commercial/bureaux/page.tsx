import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByCategory,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = { title: "Bureaux à Kinshasa — Okapi Real Estate" };

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }> }) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("commercial", "office");
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
      title="Bureaux à Kinshasa"
      totalListings={all.length}
      mode="commercial"
      crumbs={[{ label: "Commercial", href: "/commercial" }, { label: "Bureaux" }]}
      categories={[
        { label: "Bureaux", count: all.length, href: "/commercial/bureaux" },
        { label: "Magasins", count: 0, href: "/commercial/magasins" },
        { label: "Entrepôts", count: 0, href: "/commercial/entrepots" },
        { label: "Terrains", count: 0, href: "/commercial/terrains" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
    activeFilters={activeFilters}
    />
  );
}
