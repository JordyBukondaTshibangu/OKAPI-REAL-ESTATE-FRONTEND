import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import { getPropertiesByCategory, paginateProperties, filterProperties, type PropertyFilters } from "@/lib/properties";

export const metadata = {
  title: "Villas à louer à Kinshasa — Résidences de standing",
  description: "Louez une villa à Kinshasa : villas meublées, avec piscine, en résidence sécurisée. Annonces vérifiées avec prix et contact agent direct sur Okapi Real Estate.",
  keywords: ["villa à louer Kinshasa", "louer villa RDC", "villa meublée Kinshasa", "location villa Congo"],
  openGraph: { title: "Villas à louer à Kinshasa", url: "https://okapi-real-estate.com/louer/villas" },
  alternates: { canonical: "https://okapi-real-estate.com/louer/villas" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string; minPrice?: string; maxPrice?: string; beds?: string }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const raw = await getPropertiesByCategory("rent", "villa");
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
      title="Villas à louer à Kinshasa"
      totalListings={all.length}
      mode="rent"
      crumbs={[{ label: "Louer", href: "/louer" }, { label: "Villas" }]}
      categories={[
        { label: "Appartements", count: 0, href: "/louer/appartements" },
        { label: "Studios", count: 0, href: "/louer/studios" },
        { label: "Villas", count: all.length, href: "/louer/villas" },
        { label: "Maisons de ville", count: 0, href: "/louer/maisons-ville" },
      ]}
      typeRoutes={{
        apartment: "/louer/appartements",
        villa: "/louer/villas",
        studio: "/louer/studios",
        townhouse: "/louer/maisons-ville",
        penthouse: "/louer",
      }}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
