import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchProperties, fetchPropertyById, type PropertyParams } from "@/services/properties";
import type { Property, PropertyDetail } from "@/features/properties/types/property";

type PropertiesQueryOptions = Omit<
  UseQueryOptions<Property[], Error>,
  "queryKey" | "queryFn"
>;

export function useProperties(
  params: PropertyParams = {},
  options?: PropertiesQueryOptions,
) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    ...options,
  });
}

export function useProperty(id: string) {
  return useQuery<PropertyDetail, Error>({
    queryKey: ["properties", id],
    queryFn: () => fetchPropertyById(id),
    enabled: !!id,
  });
}
