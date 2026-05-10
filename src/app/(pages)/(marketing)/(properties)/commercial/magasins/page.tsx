import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = { title: "Magasins & commerces à Kinshasa — Okapi Real Estate" };

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }> }) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("commercial", "retail");
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
      title="Magasins & commerces à Kinshasa"
      totalListings={all.length}
      mode="commercial"
      crumbs={[{ label: "Commercial", href: "/commercial" }, { label: "Magasins" }]}
      categories={[
        { label: "Bureaux", count: 0, href: "/commercial/bureaux" },
        { label: "Magasins", count: all.length, href: "/commercial/magasins" },
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
