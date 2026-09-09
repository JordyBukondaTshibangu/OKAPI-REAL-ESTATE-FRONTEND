import type { Agency } from "@/features/agency/types/agency";

export type AgencyParams = {
  page?: number;
  limit?: number;
  name?: string;
  language?: string;
  commune?: string;
  propertyType?: string;
  rentalFocus?: string;
  minAgents?: number;
};

export type AgencyMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchAgencies(
  params: AgencyParams = {}
): Promise<{ data: Agency[]; meta: AgencyMeta }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.name) query.set("name", params.name);
  if (params.language) query.set("language", params.language);
  if (params.commune) query.set("commune", params.commune);
  if (params.propertyType) query.set("propertyType", params.propertyType);
  if (params.rentalFocus) query.set("rentalFocus", params.rentalFocus);
  if (params.minAgents != null) query.set("minAgents", String(params.minAgents));
  const res = await fetch(`/api/listings/agencies?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch agencies");
  return res.json();
}

export async function fetchAgencyById(id: string): Promise<Agency> {
  const res = await fetch(`/api/listings/agencies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch agency ${id}`);
  return res.json();
}
