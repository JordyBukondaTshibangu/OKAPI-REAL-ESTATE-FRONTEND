import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "fr" | "en" | "ln";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "fr",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "okapi-locale" },
  ),
);
