import { create } from "zustand";

type AgenciesStore = {
  name: string;
  language: string | null;
  commune: string | null;
  propertyType: string | null;
  rentalFocus: string | null;
  minAgents: number | null;
  page: number;
  setName: (n: string) => void;
  setLanguage: (l: string | null) => void;
  setCommune: (c: string | null) => void;
  setPropertyType: (p: string | null) => void;
  setRentalFocus: (r: string | null) => void;
  setMinAgents: (n: number | null) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
};

export const useAgenciesStore = create<AgenciesStore>((set) => ({
  name: "",
  language: null,
  commune: null,
  propertyType: null,
  rentalFocus: null,
  minAgents: null,
  page: 1,
  setName: (name) => set({ name, page: 1 }),
  setLanguage: (language) => set({ language, page: 1 }),
  setCommune: (commune) => set({ commune, page: 1 }),
  setPropertyType: (propertyType) => set({ propertyType, page: 1 }),
  setRentalFocus: (rentalFocus) => set({ rentalFocus, page: 1 }),
  setMinAgents: (minAgents) => set({ minAgents, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      name: "",
      language: null,
      commune: null,
      propertyType: null,
      rentalFocus: null,
      minAgents: null,
      page: 1,
    }),
}));
