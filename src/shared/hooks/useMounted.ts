import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during SSR and the initial hydration render, then `true`
 * once mounted on the client. Useful for deferring client-only UI (e.g. UI
 * that depends on auth or theme state hydrated from storage).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
