import { create } from "zustand";

export type AgentTransaction = "sale" | "rent" | "all";

type AgentsStore = {
  query: string;
  transaction: AgentTransaction;
  language: string | null;
  nationality: string | null;
  commune: string | null;
  propertyType: string | null;
  minRating: number | null;
  agentType: string | null;
  page: number;
  setQuery: (q: string) => void;
  setTransaction: (t: AgentTransaction) => void;
  setLanguage: (l: string | null) => void;
  setNationality: (n: string | null) => void;
  setCommune: (c: string | null) => void;
  setPropertyType: (p: string | null) => void;
  setMinRating: (r: number | null) => void;
  setAgentType: (t: string | null) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
};

export const useAgentsStore = create<AgentsStore>((set) => ({
  query: "",
  transaction: "all",
  language: null,
  nationality: null,
  commune: null,
  propertyType: null,
  minRating: null,
  agentType: null,
  page: 1,
  setQuery: (query) => set({ query, page: 1 }),
  setTransaction: (transaction) => set({ transaction, page: 1 }),
  setLanguage: (language) => set({ language, page: 1 }),
  setNationality: (nationality) => set({ nationality, page: 1 }),
  setCommune: (commune) => set({ commune, page: 1 }),
  setPropertyType: (propertyType) => set({ propertyType, page: 1 }),
  setMinRating: (minRating) => set({ minRating, page: 1 }),
  setAgentType: (agentType) => set({ agentType, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      query: "",
      transaction: "all",
      language: null,
      nationality: null,
      commune: null,
      propertyType: null,
      minRating: null,
      agentType: null,
      page: 1,
    }),
}));
