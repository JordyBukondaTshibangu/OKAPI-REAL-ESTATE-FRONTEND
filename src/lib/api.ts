import type { Property, PropertyDetail } from "@/features/properties/types/property";
import type { Agent } from "@/features/agents/types/agent";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPropertyById(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAllProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/properties`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/properties?agentId=${agentId}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getPropertiesByAgency(agencyId: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/properties?agencyId=${agencyId}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function getAgentBySlug(id: string): Promise<Agent | null> {
  try {
    const res = await fetch(`${API_URL}/agents/${id}`, { cache: "no-store" });
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
