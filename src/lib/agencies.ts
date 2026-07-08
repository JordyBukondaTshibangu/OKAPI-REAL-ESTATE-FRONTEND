import type { Agency } from "@/features/agency/types/agency";
import type { Agent } from "@/features/agents/types/agent";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getAgencyById(id: string): Promise<Agency | null> {
  try {
    const res = await fetch(`${API_URL}/agencies/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAgentsByAgency(agencyId: string): Promise<Agent[]> {
  try {
    const res = await fetch(`${API_URL}/agents?agencyId=${agencyId}&limit=100`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = (json.data ?? json) as Record<string, unknown>[];
    return data.map((a) => {
      const agency = a.agency as { name?: string } | string | null;
      return {
        ...a,
        agency:
          typeof agency === "object" && agency !== null
            ? (agency.name ?? "")
            : (agency ?? ""),
      } as Agent;
    });
  } catch {
    return [];
  }
}
