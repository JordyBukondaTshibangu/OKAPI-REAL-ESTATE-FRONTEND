import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertiesByAgency } from "@/lib/api";
import { getAgencyById, getAgentsByAgency } from "@/lib/agencies";
import AgencyDetailClient from "./AgencyDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agency = await getAgencyById(id);
  if (!agency) return { title: "Agence introuvable" };
  return {
    title: `${agency.name} — Agence immobilière à Kinshasa — Okapi Real Estate`,
    description: agency.tagline,
  };
}

export default async function AgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agency = await getAgencyById(id);
  if (!agency) notFound();

  const [agencyAgents, agencyProperties] = await Promise.all([
    getAgentsByAgency(agency.id),
    getPropertiesByAgency(id),
  ]);

  return (
    <AgencyDetailClient
      agency={agency}
      agencyAgents={agencyAgents}
      agencyProperties={agencyProperties}
    />
  );
}
