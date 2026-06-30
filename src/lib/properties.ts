import type {
  ListingType,
  Property,
  PropertyCategory,
} from "@/features/properties/types/property";

const API_URL = process.env.API_URL || "http://localhost:3000";
export const PER_PAGE = 6;

export type PropertyFilters = {
  q?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  suburb?: string;
  city?: string;
  /** Legacy toggle — prefer rentalDuration */
  isShortTerm?: boolean;
  /** "short" | "long" | "both" — replaces isShortTerm */
  rentalDuration?: "short" | "long" | "both";
  minNightPrice?: number;
  maxNightPrice?: number;
  /** User wants to stay at least minStay nights — hides properties whose minStayNights > minStay */
  minStay?: number;
  /** User wants to stay at most maxStay nights — hides properties whose maxStayNights < maxStay */
  maxStay?: number;
};

export async function getPropertiesByListingType(
  listingType: ListingType | "commercial",
): Promise<Property[]> {
  try {
    const res = await fetch(
      `${API_URL}/properties?listingType=${listingType}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getPropertiesByCategory(
  listingType: string,
  category: PropertyCategory,
  transaction?: string,
): Promise<Property[]> {
  try {
    const query = new URLSearchParams({ listingType, category });
    if (transaction) query.set("transaction", transaction);
    const res = await fetch(`${API_URL}/properties?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export function filterProperties(
  items: Property[],
  filters: PropertyFilters,
): Property[] {
  return (items ?? []).filter((item) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.suburb.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.suburb && !item.suburb.toLowerCase().includes(filters.suburb.toLowerCase()))
      return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.type && item.category !== filters.type) return false;
    if (filters.minPrice !== undefined && item.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && item.price > filters.maxPrice)
      return false;
    if (filters.beds !== undefined && item.bedrooms !== filters.beds)
      return false;
    // Rental duration filter (new)
    if (filters.rentalDuration === "short" && !item.isShortTerm) return false;
    if (filters.rentalDuration === "long" && item.isLongTerm === false) return false;
    if (filters.rentalDuration === "both" && (!item.isShortTerm || item.isLongTerm === false)) return false;
    // Legacy toggle
    if (!filters.rentalDuration && filters.isShortTerm && !item.isShortTerm) return false;
    // Price per night
    if (filters.minNightPrice !== undefined && (item.pricePerNight == null || item.pricePerNight < filters.minNightPrice)) return false;
    if (filters.maxNightPrice !== undefined && (item.pricePerNight == null || item.pricePerNight > filters.maxNightPrice)) return false;
    // Stay nights: minStay = user wants to stay at least X nights; hide if property minStayNights > X
    if (filters.minStay !== undefined && item.minStayNights != null && item.minStayNights > filters.minStay) return false;
    // maxStay = user wants to stay at most X nights; hide if property maxStayNights < X
    if (filters.maxStay !== undefined && item.maxStayNights != null && item.maxStayNights < filters.maxStay) return false;
    return true;
  });
}

export function paginateProperties(
  items: Property[],
  page: number,
  perPage = PER_PAGE,
): { items: Property[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}

export function formatPrice(
  price: number,
  currency: string,
  period: string | null,
): string {
  const formatted = price.toLocaleString("fr-FR");
  const curr = currency === "USD" ? "$" : currency;
  const per = period === "monthly" ? "/mois" : period === "yearly" ? "/an" : "";
  return `${formatted} ${curr}${per}`;
}

/** 1 234 → "1,2k", 1 200 000 → "1,2M" — compact display for engagement counters. */
export function formatCompactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",").replace(",0", "")}k`;
  return String(n);
}

export function formatListedAgo(days: number): string {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  }
  const months = Math.floor(days / 30);
  return `Il y a ${months} mois`;
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    apartment: "Appartement",
    villa: "Villa",
    townhouse: "Maison de ville",
    studio: "Studio",
    duplex: "Duplex",
    penthouse: "Penthouse",
    land: "Terrain",
    office: "Bureau",
    warehouse: "Entrepôt",
    retail: "Local commercial",
  };
  return labels[category] ?? category;
}
