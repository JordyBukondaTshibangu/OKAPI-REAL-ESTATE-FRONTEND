import { notFound } from "next/navigation";
import { getAgentBySlug, getPropertiesByAgent } from "@/lib/api";
import AgentDetailClient from "./AgentDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await getAgentBySlug(id);
  if (!a) return { title: "Agent introuvable — Okapi Real Estate" };
  const canonicalUrl = `https://okapi-real-estate.com/agents/${id}`;
  return {
    title: `${a.name} — Agent immobilier à Kinshasa | Okapi Real Estate`,
    description: `Découvrez ${a.name}, agent immobilier spécialisé ${a.specialization ? `en ${a.specialization}` : ""} chez ${a.agency ?? "Okapi Real Estate"} à Kinshasa. Consultez ses annonces et prenez contact.`,
    openGraph: {
      title: `${a.name} — Agent immobilier à Kinshasa`,
      description: `Agent immobilier certifié à Kinshasa${a.agency ? ` chez ${a.agency}` : ""}. Consultez ses annonces sur Okapi Real Estate.`,
      url: canonicalUrl,
      ...(a.photo ? { images: [{ url: a.photo, width: 400, height: 400, alt: a.name }] } : {}),
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [agent, agentProperties] = await Promise.all([
    getAgentBySlug(id),
    getPropertiesByAgent(id),
  ]);
  if (!agent) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: agent.name,
    jobTitle: "Agent immobilier",
    url: `https://okapi-real-estate.com/agents/${id}`,
    ...(agent.photo ? { image: agent.photo } : {}),
    worksFor: agent.agency ? { "@type": "Organization", name: agent.agency } : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Kinshasa", addressCountry: "CD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentDetailClient id={id} agent={agent} agentProperties={agentProperties} />
    </>
  );
}
