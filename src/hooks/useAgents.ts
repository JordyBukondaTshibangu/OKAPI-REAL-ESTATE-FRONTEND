import { useQuery } from "@tanstack/react-query";
import { fetchAgents, fetchAgentById, type AgentParams } from "@/services/agents";

export function useAgents(params: AgentParams = {}) {
  return useQuery({
    queryKey: ["agents", params],
    queryFn: () => fetchAgents(params),
  });
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: ["agents", id],
    queryFn: () => fetchAgentById(id),
    enabled: !!id,
  });
}
