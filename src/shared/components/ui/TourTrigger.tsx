"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useTourStore } from "@/store/useTourStore";

/**
 * Invisible client component mounted in the root layout.
 * Automatically starts the onboarding tour for first-time logged-in users.
 *
 * Behaviour:
 * - Fires once when `isAuthenticated` becomes true and `hasSeenTour` is false.
 * - Navigates to `/` first if not already there (tour targets the hero).
 * - Waits 1 s for the page to render before starting.
 * - Does NOT depend on `isActive` in its deps array (intentional — prevents
 *   re-triggering when `startTour()` flips `isActive` to true).
 */
export default function TourTrigger() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { hasSeenTour, startTour } = useTourStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || hasSeenTour) return;

    // If we're not on the home page, navigate there first.
    // The effect will re-run once pathname changes to "/".
    if (pathname !== "/") {
      router.push("/");
      return;
    }

    const timer = setTimeout(startTour, 1000);
    return () => clearTimeout(timer);

    // isActive intentionally excluded to avoid re-triggering after startTour()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, hasSeenTour, pathname]);

  return null;
}
