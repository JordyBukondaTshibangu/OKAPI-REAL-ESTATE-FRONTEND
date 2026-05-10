import { create } from "zustand";

type AgenciesStore = {
  name: string;
  language: string | null;
  page: number;
  setName: (n: string) => void;
  setLanguage: (l: string | null) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
};

export const useAgenciesStore = create<AgenciesStore>((set) => ({
  name: "",
  language: null,
  page: 1,
  setName: (name) => set({ name, page: 1 }),
  setLanguage: (language) => set({ language, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ name: "", language: null, page: 1 }),
}));
