import type {
  Property,
  PropertyDetail,
  PropertyPerformance,
} from "@/features/properties/types/property";
import { getOrCreateSessionId } from "@/lib/session";

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
/** Builds tracking headers — always sends x-session-id for deduplication. */
function trackingHeaders(): Record<string, string> {
  const sessionId = getOrCreateSessionId();
  return sessionId ? { "x-session-id": sessionId } : {};
}

/**
 * Records a page view for a property. Deduplicates by browser session —
 * the same visitor can only increment the counter once.
 */
export async function recordPropertyView(
  id: string,
): Promise<PropertyPerformance | null> {
  try {
    const res = await fetch(`/api/listings/properties/${id}/view`, {
      method: "POST",
      headers: trackingHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Records a share for a property. Deduplicates by browser session.
 */
export async function recordPropertyShare(
  id: string,
): Promise<PropertyPerformance | null> {
  try {
    const res = await fetch(`/api/listings/properties/${id}/share`, {
      method: "POST",
      headers: trackingHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Records a WhatsApp button click. Deduplicates by browser session.
 */
export async function recordPropertyWhatsAppClick(
  id: string,
): Promise<PropertyPerformance | null> {
  try {
    const res = await fetch(`/api/listings/properties/${id}/whatsapp-click`, {
      method: "POST",
      headers: trackingHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
