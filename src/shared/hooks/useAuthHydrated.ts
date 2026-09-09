import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/useAuthStore";

function subscribe(callback: () => void) {
  return useAuthStore.persist.onFinishHydration(callback);
}

function getSnapshot() {
  return useAuthStore.persist.hasHydrated();
}

function getServerSnapshot() {
  return false;
}

/**
 * Returns true once Zustand has finished reading auth state from localStorage.
 *
 * Zustand v5 persist rehydrates asynchronously, so the first render always
 * has isAuthenticated=false even when a token is stored. Gating auth guards
 * on this hook prevents spurious redirects to /connexion.
 *
 * On subsequent client-side navigations (store already hydrated), this
 * returns true immediately — no flicker.
 */
export function useAuthHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
