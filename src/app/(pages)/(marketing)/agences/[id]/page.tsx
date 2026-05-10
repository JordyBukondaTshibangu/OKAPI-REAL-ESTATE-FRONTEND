import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import { getAgencyById, getAgentsByAgency } from "@/lib/agencies";
import { Button } from "@/shared/components/ui/button";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";

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

  const agencyAgents = await getAgentsByAgency(agency.name);

  return (
    <div className="bg-background-alt">
      {/* Hero banner */}
      <section className={`${agency.accentClass} text-white py-16 px-6`}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/agences"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            ← Toutes les agences
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-white/15 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {agency.monogram}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-2">
                Agence partenaire · Depuis {agency.founded}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                {agency.name}
              </h1>
              <p className="text-white/80 text-base italic">{agency.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Agents", value: agency.agentCount, icon: Users },
            { label: "Annonces actives", value: agency.listingCount, icon: TrendingUp },
            { label: "Transactions", value: agency.closedDeals, icon: Award },
            {
              label: "Ans d'expérience",
              value: new Date().getFullYear() - agency.founded,
              icon: CheckCircle,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* LEFT */}
        <div className="space-y-10">
          {/* About */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">À propos</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{agency.description}</p>
          </section>

          {/* Specializations */}
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Spécialisations</h2>
            <div className="flex flex-wrap gap-2">
              {agency.specializations.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-accent text-primary text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Areas */}
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Zones d&apos;expertise</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agency.areasServed.map((area) => (
                <div key={area} className="flex items-center gap-2 text-sm text-foreground/85">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {area}
                </div>
              ))}
            </div>
          </section>

          {/* Agents */}
          {agencyAgents.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                L&apos;équipe ({agencyAgents.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agencyAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <AgentAvatar name={agent.name} photo={agent.photo} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                      <p className="text-xs text-secondary font-semibold tracking-wider mt-0.5">
                        {agent.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {agency.certifications.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Certifications</h2>
              <ul className="space-y-2">
                {agency.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-foreground/85">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT — Contact card */}
        <aside className="space-y-5">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:sticky lg:top-28">
            <h3 className="text-base font-semibold text-foreground mb-5">
              Contacter l&apos;agence
            </h3>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Adresse</p>
                  <p className="text-sm font-medium text-foreground">{agency.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Téléphone</p>
                  <p className="text-sm font-medium text-foreground">{agency.phone}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">E-mail</p>
                  <p className="text-sm font-medium text-primary">{agency.email}</p>
                </div>
              </li>
              {agency.website && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Site web</p>
                    <p className="text-sm font-medium text-primary">{agency.website}</p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Langues</p>
                  <p className="text-sm font-medium text-foreground">
                    {agency.languages.join(", ")}
                  </p>
                </div>
              </li>
            </ul>

            <div className="flex flex-col gap-2">
              <Button className="w-full">Envoyer un message</Button>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" /> Appeler
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
