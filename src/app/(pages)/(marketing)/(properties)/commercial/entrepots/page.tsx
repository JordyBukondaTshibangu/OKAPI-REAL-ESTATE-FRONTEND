
import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = {
  title: "Entrepôts à louer & à vendre à Kinshasa — Locaux industriels",
  description: "Louez ou achetez un entrepôt à Kinshasa : entrepôts logistiques, industriels et de stockage disponibles. Annonces vérifiées sur Okapi Real Estate.",
  keywords: ["entrepôt à louer Kinshasa", "entrepôt industriel RDC", "stockage Kinshasa", "local industriel Congo"],
  openGraph: { title: "Entrepôts à Kinshasa", url: "https://okapi-real-estate.com/commercial/entrepots" },
  alternates: { canonical: "https://okapi-real-estate.com/commercial/entrepots" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }> }) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("commercial", "warehouse");
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
      title="Entrepôts à Kinshasa"
      totalListings={all.length}
      mode="commercial"
      crumbs={[{ label: "Commercial", href: "/commercial" }, { label: "Entrepôts" }]}
      categories={[
        { label: "Bureaux", count: 0, href: "/commercial/bureaux" },
        { label: "Magasins", count: 0, href: "/commercial/magasins" },
        { label: "Entrepôts", count: all.length, href: "/commercial/entrepots" },
        { label: "Terrains", count: 0, href: "/commercial/terrains" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
    activeFilters={activeFilters}
    />
  );
}
