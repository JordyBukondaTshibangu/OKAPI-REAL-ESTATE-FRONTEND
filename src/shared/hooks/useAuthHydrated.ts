import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Returns true once Zustand has finished reading auth state from localStorage.
 *
 * Zustand v5 persist rehydrates asynchronously, so the first render always
 * has isAuthenticated=false even when a token is stored. Gating auth guards
 * on this hook prevents spurious redirects to /connexion.
 *
 * On subsequent client-side navigations (store already hydrated), this
 * returns true immediately from the useState initializer — no flicker.
 */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    // Synchronously true if store was already hydrated (e.g. client-side nav)
    () => (typeof window !== "undefined" ? useAuthStore.persist.hasHydrated() : false)
  );

  useEffect(() => {
    if (hydrated) return;
    // Re-check: hydration may have completed between the render and this effect
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    // Still pending — subscribe to be notified when it finishes
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  return hydrated;
}
