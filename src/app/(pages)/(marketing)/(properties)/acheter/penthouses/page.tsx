import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = {
  title: "Penthouses à vendre à Kinshasa — Luxe & Vue Panoramique",
  description: "Achetez un penthouse à Kinshasa : appartements de luxe en dernier étage avec vue panoramique. Annonces haut de gamme vérifiées sur Okapi Real Estate.",
  keywords: ["penthouse Kinshasa", "appartement luxe Kinshasa", "penthouse à vendre RDC", "immobilier luxe Kinshasa"],
  openGraph: { title: "Penthouses à vendre à Kinshasa", url: "https://okapi-real-estate.com/acheter/penthouses" },
  alternates: { canonical: "https://okapi-real-estate.com/acheter/penthouses" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("sale", "penthouse");
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
      title="Penthouses à vendre à Kinshasa"
      totalListings={all.length}
      mode="buy"
      crumbs={[{ label: "Acheter", href: "/acheter" }, { label: "Penthouses" }]}
      categories={[
        { label: "Appartements", count: 0, href: "/acheter/appartements" },
        { label: "Villas", count: 0, href: "/acheter/villas" },
        { label: "Maisons de ville", count: 0, href: "/acheter/maisons-ville" },
        { label: "Terrains", count: 0, href: "/acheter/terrains" },
        { label: "Penthouses", count: all.length, href: "/acheter/penthouses" },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
