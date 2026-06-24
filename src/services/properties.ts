import type {
  Property,
  PropertyDetail,
  PropertyPerformance,
} from "@/features/properties/types/property";

export type PropertyParams = {
  listingType?: string;
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  agentId?: string;
  agencyId?: string;
};

export async function fetchProperties(params: PropertyParams = {}): Promise<Property[]> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  const res = await fetch(`/api/listings/properties?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

export async function fetchPropertyById(id: string): Promise<PropertyDetail> {
  const res = await fetch(`/api/listings/properties/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch property ${id}`);
  return res.json();
}

/**
 * Records a page view for a property. Fire-and-forget friendly:
 * returns the fresh performance counters, or null on failure.
 */
export async function recordPropertyView(
  id: string,
): Promise<PropertyPerformance | null> {
  try {
    const res = await fetch(`/api/listings/properties/${id}/view`, {
      method: "POST",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Records a share for a property. Returns the fresh performance
 * counters, or null on failure.
 */
export async function recordPropertyShare(
  id: string,
): Promise<PropertyPerformance | null> {
  try {
    const res = await fetch(`/api/listings/properties/${id}/share`, {
      method: "POST",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
