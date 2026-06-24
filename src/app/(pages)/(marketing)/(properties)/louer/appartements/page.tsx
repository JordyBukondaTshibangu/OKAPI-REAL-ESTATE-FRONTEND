import PropertyListingPage from "@/features/properties/components/PropertyListingPage";
import {
  filterProperties,
  getPropertiesByCategory,
  paginateProperties,
  type PropertyFilters,
} from "@/lib/properties";

export const metadata = {
  title: "Appartements à louer à Kinshasa — Okapi Real Estate",
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

  const raw = await getPropertiesByCategory("rent", "apartment");
  const _filters: PropertyFilters = {
    q: q || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    beds: beds ? Number(beds) : undefined,
  };
  const all = filterProperties(raw, _filters);

  const activeFilters = [q, type, minPrice, maxPrice, beds].filter(
    Boolean,
  ).length;

  const { items, totalPages } = paginateProperties(all, currentPage);

  return (
    <PropertyListingPage
      title="Appartements à louer à Kinshasa"
      totalListings={all.length}
      mode="rent"
      crumbs={[{ label: "Louer", href: "/louer" }, { label: "Appartements" }]}
      categories={[
        {
          label: "Appartements",
          count: all.length,
          href: "/louer/appartements",
        },
        { label: "Studios", count: 0, href: "/louer/studios" },
        { label: "Villas", count: 0, href: "/louer/villas" },
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
