import { notFound } from "next/navigation";
import { getAgentBySlug, getAllProperties } from "@/lib/api";
import AgentDetailClient from "./AgentDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await getAgentBySlug(id);
  if (!a) return { title: "Agent introuvable — Okapi Real Estate" };
  return {
    title: `${a.name} — Agent immobilier — Okapi Real Estate`,
    description: `Découvrez ${a.name}, ${a.specialization} chez ${a.agency}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [agent, allProperties] = await Promise.all([
    getAgentBySlug(id),
    getAllProperties(),
  ]);
  if (!agent) notFound();

  const agentProperties = allProperties.filter(
    (p) => p.agent.name === agent.name
  );

  return <AgentDetailClient id={id} agent={agent} agentProperties={agentProperties} />;
}
