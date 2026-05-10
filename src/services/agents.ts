import type { Agent } from "@/features/agents/types/agent";

export type AgentParams = {
  page?: number;
  limit?: number;
  name?: string;
  language?: string;
  nationality?: string;
};

export type AgentsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAgents(
  params: AgentParams = {}
): Promise<{ data: Agent[]; meta: AgentsMeta }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.name) query.set("name", params.name);
  if (params.language) query.set("language", params.language);
  if (params.nationality) query.set("nationality", params.nationality);
  const res = await fetch(`/api/listings/agents?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function fetchAgentById(id: string): Promise<Agent> {
  const res = await fetch(`/api/listings/agents/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch agent ${id}`);
  return res.json();
}
