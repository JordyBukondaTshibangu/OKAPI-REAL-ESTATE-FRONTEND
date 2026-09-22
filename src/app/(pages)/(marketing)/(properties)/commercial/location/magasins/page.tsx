
import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = {
  title: "Magasins à louer à Kinshasa — Boutiques & Locaux retail",
  description: "Louez un magasin ou une boutique à Kinshasa : locaux commerciaux, espaces de vente et boutiques en centre-ville disponibles. Annonces vérifiées sur Okapi Real Estate.",
  keywords: ["magasin à louer Kinshasa", "boutique location Kinshasa", "local retail RDC", "commerce Kinshasa"],
  alternates: { canonical: "https://okapi-real-estate.com/commercial/location/magasins" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }> }) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("commercial", "retail", "rent");
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
      title="Magasins à louer à Kinshasa"
      totalListings={all.length}
      mode="commercial"
      crumbs={[{ label: "Commercial", href: "/commercial" }, { label: "Location", href: "/commercial" }, { label: "Magasins" }]}
      categories={[
        { label: "Bureaux", count: 0, href: "/commercial/location/bureaux" },
        { label: "Magasins", count: all.length, href: "/commercial/location/magasins" },
        { label: "Entrepôts", count: 0, href: "/commercial/location/entrepots" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
    activeFilters={activeFilters}
    />
  );
}
