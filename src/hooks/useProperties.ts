import { useQuery } from "@tanstack/react-query";
import { fetchProperties, fetchPropertyById, type PropertyParams } from "@/services/properties";

export function useProperties(params: PropertyParams = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: () => fetchPropertyById(id),
    enabled: !!id,
  });
}
