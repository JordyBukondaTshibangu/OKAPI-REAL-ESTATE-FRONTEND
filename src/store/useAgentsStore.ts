import { create } from "zustand";

export type AgentTransaction = "sale" | "rent" | "all";

type AgentsStore = {
  query: string;
  transaction: AgentTransaction;
  language: string | null;
  nationality: string | null;
  page: number;
  setQuery: (q: string) => void;
  setTransaction: (t: AgentTransaction) => void;
  setLanguage: (l: string | null) => void;
  setNationality: (n: string | null) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
};

export const useAgentsStore = create<AgentsStore>((set) => ({
  query: "",
  transaction: "all",
  language: null,
  nationality: null,
  page: 1,
  setQuery: (query) => set({ query, page: 1 }),
  setTransaction: (transaction) => set({ transaction, page: 1 }),
  setLanguage: (language) => set({ language, page: 1 }),
  setNationality: (nationality) => set({ nationality, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({ query: "", transaction: "all", language: null, nationality: null, page: 1 }),
}));
