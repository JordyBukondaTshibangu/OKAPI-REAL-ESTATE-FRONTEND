import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  getPropertiesByCategory,
  filterProperties,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Appartements à vendre à Kinshasa — Prix & Annonces",
  description:
    "Achetez un appartement à Kinshasa : studios, T2, T3, duplex et penthouses disponibles. Annonces vérifiées avec photos, prix et contact agent direct sur Okapi Real Estate.",
  keywords: ["appartement à vendre Kinshasa", "acheter appartement RDC", "appartement neuf Kinshasa", "prix appartement Kinshasa"],
  openGraph: { title: "Appartements à vendre à Kinshasa", description: "Achetez un appartement à Kinshasa. Annonces vérifiées sur Okapi Real Estate.", url: "https://okapi-real-estate.com/acheter/appartements" },
  alternates: { canonical: "https://okapi-real-estate.com/acheter/appartements" },
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
