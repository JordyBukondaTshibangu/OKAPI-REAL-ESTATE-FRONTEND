import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Temporary store that keeps the agent JWT alive during the signup flow.
 *  Cleared once the agent reaches /devenir-agent/en-attente. */
interface AgentSignupState {
  token: string | null;
  agentName: string | null;
  agentEmail: string | null;
  agentPhone: string | null;   // pre-fills WhatsApp field in Step 2
  setSignup: (token: string, name: string, email: string, phone: string) => void;
  clear: () => void;
}

export const useAgentSignupStore = create<AgentSignupState>()(
  persist(
    (set) => ({
      token: null,
      agentName: null,
      agentEmail: null,
      agentPhone: null,
      setSignup: (token, agentName, agentEmail, agentPhone) =>
        set({ token, agentName, agentEmail, agentPhone }),
      clear: () => set({ token: null, agentName: null, agentEmail: null, agentPhone: null }),
    }),
    { name: "okapi-agent-signup" },
  ),
);
