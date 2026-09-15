"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavourites, addFavourite, removeFavourite } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Returns a Set of property IDs the current user has saved.
 * The result is cached and shared across all components — no duplicate fetches.
 */
export function useFavouriteIds(): Set<string> {
  const { token, isAuthenticated } = useAuthStore();
  const { data } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 60 * 1000,
  });
  return new Set((data ?? []).map((f) => f.property.id));
}

/**
 * Toggle a property in/out of favourites.
 * Optimistically updates the cached Set and falls back on error.
 */
export function useToggleFavourite() {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  return async function toggle(propertyId: string, currentlySaved: boolean): Promise<boolean> {
    if (!isAuthenticated || !token) return false;

    // Optimistic update
    queryClient.setQueryData<{ property: { id: string } }[]>(["favourites"], (prev = []) => {
      if (currentlySaved) {
        return prev.filter((f) => f.property.id !== propertyId);
      } else {
        return [...prev, { property: { id: propertyId } } as { property: { id: string } }];
      }
    });

    try {
      if (currentlySaved) {
        await removeFavourite(token, propertyId);
      } else {
        await addFavourite(token, propertyId);
      }
      // Refetch to sync real data (handles 409 etc.)
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      return !currentlySaved;
    } catch {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      return currentlySaved;
    }
  };
}
