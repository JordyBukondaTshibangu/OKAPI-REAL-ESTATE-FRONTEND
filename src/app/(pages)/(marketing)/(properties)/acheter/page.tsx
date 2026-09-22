import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  filterProperties,
  getPropertiesByListingType,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";
import { parseSearchQuery } from "@/lib/parseSearchQuery";

export const metadata = {
  title: "Biens à acheter à Kinshasa — Appartements, Villas, Maisons",
  description:
    "Achetez un appartement, une villa ou une maison à Kinshasa. Parcourez des centaines d'annonces vérifiées sur Okapi Real Estate et trouvez le bien idéal en RDC.",
  keywords: [
    "acheter appartement Kinshasa",
    "villa à vendre Kinshasa",
    "maison à vendre RDC",
    "achat immobilier Kinshasa",
    "bien à acheter Congo",
  ],
  openGraph: {
    title: "Biens à acheter à Kinshasa — Appartements, Villas, Maisons",
    description: "Achetez un appartement, une villa ou une maison à Kinshasa. Annonces vérifiées sur Okapi Real Estate.",
    url: "https://okapi-real-estate.com/acheter",
  },
  alternates: { canonical: "https://okapi-real-estate.com/acheter" },
};

export default async function AcheterPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    suburb?: string;
    city?: string;
    isShortTerm?: string;
  }>;
}) {
  const { page, q, type, minPrice, maxPrice, beds, suburb, city, isShortTerm } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  // Parse natural language from q to enrich structured filters
  const parsed = q ? parseSearchQuery(q) : {};

  const allSale = await getPropertiesByListingType("sale");

  const filters: PropertyFilters = {
    // Use clean remaining words (not structural keywords) for text matching
    q: parsed.cleanQ || undefined,
    // Explicit URL param takes precedence over parsed; fall back to parsed
    type: type || parsed.category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : parsed.beds,
    suburb: suburb || parsed.suburb || undefined,
    city: city || undefined,
    isShortTerm: isShortTerm === "true" ? true : undefined,
  };
  const filtered = filterProperties(allSale, filters);

  const activeFilters = [q, type, minPrice, maxPrice, beds, suburb, city, isShortTerm].filter(
    Boolean,
  ).length;
  const { items, totalPages } = paginateProperties(filtered, currentPage);

  return (
    <PropertyListingPage
      title="Biens à acheter à Kinshasa"
      totalListings={filtered.length}
      mode="buy"
      crumbs={[{ label: "Biens à acheter à Kinshasa" }]}
      categories={[
        {
          label: "Appartements",
          count: allSale.filter((p) => p.category === "apartment").length,
          href: "/acheter",
          typeValue: "apartment",
        },
        {
          label: "Villas",
          count: allSale.filter((p) => p.category === "villa").length,
          href: "/acheter",
          typeValue: "villa",
        },
        {
          label: "Maisons de ville",
          count: allSale.filter((p) => p.category === "townhouse").length,
          href: "/acheter",
          typeValue: "townhouse",
        },
        {
          label: "Terrains",
          count: allSale.filter((p) => p.category === "land").length,
          href: "/acheter",
          typeValue: "land",
        },
        {
          label: "Penthouses",
          count: allSale.filter((p) => p.category === "penthouse").length,
          href: "/acheter",
          typeValue: "penthouse",
        },
      ]}
      properties={items}
      currentPage={currentPage}
      totalPages={totalPages}
      activeFilters={activeFilters}
    />
  );
}
