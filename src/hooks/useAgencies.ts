import { useQuery } from "@tanstack/react-query";
import { fetchAgencies, fetchAgencyById, type AgencyParams } from "@/services/agencies";

export function useAgencies(params: AgencyParams = {}) {
  return useQuery({
    queryKey: ["agencies", params],
    queryFn: () => fetchAgencies(params),
  });
}

export function useAgency(id: string) {
  return useQuery({
    queryKey: ["agencies", id],
    queryFn: () => fetchAgencyById(id),
    enabled: !!id,
  });
}
