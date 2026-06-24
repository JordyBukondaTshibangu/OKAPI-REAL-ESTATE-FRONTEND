import type { Property, PropertyDetail } from "@/features/properties/types/property";
import type { Agent } from "@/features/agents/types/agent";

const API_URL = process.env.API_URL || "http://localhost:3000";

/** Single property — revalidate every 30 s (price/availability can change) */
export async function getPropertyById(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches at most `limit` properties in the same category for the
 * "recommended" strip on the detail page.
 * Replaces the old getAllProperties() call that downloaded the entire catalogue.
 */
export async function getRecommendedProperties(
  category: string,
  excludeId: string,
): Promise<Property[]> {
  try {
    const params = new URLSearchParams({ category, limit: "5" });
    const res = await fetch(`${API_URL}/properties?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const all: Property[] = Array.isArray(json) ? json : (json.data ?? []);
    return all.filter((p) => p.id !== excludeId).slice(0, 4);
  } catch {
    return [];
  }
}

/** Fetches lightweight stats for the Regions section — runs server-side only */
export type PropertyStats = {
  total: number;
  forSale: number;
  forRent: number;
  avgSalePrice: number;
  topSuburbs: [string, number][];
};

export async function getPropertyStats(): Promise<PropertyStats> {
  const empty: PropertyStats = {
    total: 0, forSale: 0, forRent: 0, avgSalePrice: 0, topSuburbs: [],
  };
  try {
    const res = await fetch(`${API_URL}/properties?limit=200`, {
      next: { revalidate: 300 }, // stats are fine at 5-min freshness
    });
    if (!res.ok) return empty;
    const json = await res.json();
    const properties: Property[] = Array.isArray(json) ? json : (json.data ?? []);

    const forSale = properties.filter((p) => p.listingType === "sale");
    const forRent = properties.filter((p) => p.listingType === "rent");
    const avgSalePrice =
      forSale.length > 0
        ? Math.round(forSale.reduce((s, p) => s + p.price, 0) / forSale.length)
        : 0;

    const suburbCounts: Record<string, number> = {};
    for (const p of properties) {
      const key = p.suburb || "Autre";
      suburbCounts[key] = (suburbCounts[key] || 0) + 1;
    }
    const topSuburbs = (Object.entries(suburbCounts) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return { total: properties.length, forSale: forSale.length, forRent: forRent.length, avgSalePrice, topSuburbs };
  } catch {
    return empty;
  }
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/properties?agentId=${agentId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getPropertiesByAgency(agencyId: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/properties?agencyId=${agencyId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getAgentBySlug(id: string): Promise<Agent | null> {
  try {
    const res = await fetch(`${API_URL}/agents/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const agencyObj = data.agency as { name?: string } | string | null;
    return {
      ...data,
      agency:
        typeof agencyObj === "object" && agencyObj !== null
          ? (agencyObj.name ?? "")
          : (agencyObj ?? ""),
    };
  } catch {
    return null;
  }
}
