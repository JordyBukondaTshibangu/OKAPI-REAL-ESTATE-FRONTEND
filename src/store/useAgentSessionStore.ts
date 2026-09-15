import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AgentSession = {
  id: string;
  name: string;
  email: string;
  verificationTier: "NON_VERIFIE" | "VERIFIE";
  emailVerified: boolean;
  agentType?: string | null;
  agencyId?: string | null;
};

interface AgentSessionState {
  token: string | null;
  agent: AgentSession | null;
  isAuthenticated: boolean;
  /** True once Zustand persist has finished rehydrating from localStorage. */
  _hasHydrated: boolean;
  setSession: (token: string, agent: AgentSession) => void;
  setAgent: (agent: AgentSession) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAgentSessionStore = create<AgentSessionState>()(
  persist(
    (set) => ({
      token: null,
      agent: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setSession: (token, agent) => set({ token, agent, isAuthenticated: true }),
      setAgent: (agent) => set({ agent }),
      logout: () => set({ token: null, agent: null, isAuthenticated: false }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "okapi-agent-session",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
