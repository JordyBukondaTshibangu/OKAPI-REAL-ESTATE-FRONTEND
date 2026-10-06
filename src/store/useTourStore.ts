"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TourStep {
  id: string;
  tooltipPosition: "above" | "below";
}

/**
 * Tour steps — id must match the `data-tour-id` attribute on the DOM element.
 * Text comes from i18n so the tour is fully translated.
 */
export const TOUR_STEPS: TourStep[] = [
  { id: "hero-search", tooltipPosition: "below" },
  { id: "hero-filters", tooltipPosition: "below" },
  { id: "header-user", tooltipPosition: "below" },
];

interface TourState {
  // ── Persisted ─────────────────────────────────────────────────────────────
  hasSeenTour: boolean;

  // ── In-memory (ephemeral per session) ─────────────────────────────────────
  isActive: boolean;
  currentStep: number;

  // ── Actions ───────────────────────────────────────────────────────────────
  startTour: () => void;
  nextStep: () => void;
  skipTour: () => void;
  resetTour: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      // Persisted
      hasSeenTour: false,

      // In-memory
      isActive: false,
      currentStep: 0,

      startTour: () => set({ isActive: true, currentStep: 0 }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < TOUR_STEPS.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          set({ isActive: false, hasSeenTour: true });
        }
      },

      skipTour: () => set({ isActive: false, hasSeenTour: true }),

      // Resets hasSeenTour so the tour can be replayed from the profile page
      resetTour: () =>
        set({ hasSeenTour: false, isActive: false, currentStep: 0 }),
    }),
    {
      name: "okapi-tour-web",
      storage: createJSONStorage(() => {
        // SSR guard — localStorage is only available in the browser
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      // Only persist hasSeenTour — in-memory state is ephemeral
      partialize: (s) => ({ hasSeenTour: s.hasSeenTour }),
    },
  ),
);
