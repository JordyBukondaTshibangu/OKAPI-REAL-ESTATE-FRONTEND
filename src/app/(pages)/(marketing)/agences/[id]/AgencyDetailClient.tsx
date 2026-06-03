"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Users, TrendingUp, Award, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import PropertyCard from "@/features/properties/components/PropertyCard";
import type { Agency } from "@/features/agency/types/agency";
import type { Agent } from "@/features/agents/types/agent";
import type { Property } from "@/features/properties/types/property";
import { useT } from "@/i18n/useT";

export default function AgencyDetailClient({
  agency,
  agencyAgents,
  agencyProperties,
}: {
  agency: Agency;
  agencyAgents: Agent[];
  agencyProperties: Property[];
}) {
  const t = useT();
  const da = t.detail.agency;

  const stats = [
    { label: da.statAgentsLabel, value: agencyAgents.length, icon: Users },
    { label: da.statListingsLabel, value: agencyProperties.length, icon: TrendingUp },
    { label: da.statDealsLabel, value: agency.closedDeals, icon: Award },
    { label: da.statYearsLabel, value: new Date().getFullYear() - agency.founded, icon: CheckCircle },
  ];

  return (
    <div className="bg-background-alt">
      {/* Hero banner */}
      <section className={`${agency.accentClass} text-white py-16 px-6`}>
        <div className="max-w-6xl mx-auto">
          <Link href="/agences" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors">
            {da.backToAgencies}
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-card/15 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {agency.monogram}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-2">
                {da.partnerSince.replace("{year}", String(agency.founded))}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{agency.name}</h1>
              <p className="text-white/80 text-base italic">{agency.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ label, value, icon: Icon }) => (
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
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">{da.aboutHeading}</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{agency.description}</p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">{da.specializationsHeading}</h2>
            <div className="flex flex-wrap gap-2">
              {agency.specializations.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full bg-accent text-primary text-sm font-medium">{s}</span>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">{da.areasHeading}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agency.areasServed.map((area) => (
                <div key={area} className="flex items-center gap-2 text-sm text-foreground/85">
                  <MapPin className="w-4 h-4 text-primary shrink-0" /> {area}
                </div>
              ))}
            </div>
          </section>

          {agencyAgents.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {da.teamHeading.replace("{n}", String(agencyAgents.length))}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agencyAgents.map((agent) => (
                  <Link key={agent.id} href={`/agents/${agent.id}`}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                    <AgentAvatar name={agent.name} photo={agent.photo} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                      <p className="text-xs text-secondary font-semibold tracking-wider mt-0.5">{agent.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {agency.certifications.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">{da.certificationsHeading}</h2>
              <ul className="space-y-2">
                {agency.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-foreground/85">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT — Contact card */}
        <aside className="space-y-5">
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-6 lg:sticky lg:top-28">
            <h3 className="text-base font-semibold text-foreground mb-5">{da.contactAgencyHeading}</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">{da.addressLabel}</p><p className="text-sm font-medium text-foreground">{agency.address}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">{da.phoneLabel}</p><p className="text-sm font-medium text-foreground">{agency.phone}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">{da.emailLabel}</p><p className="text-sm font-medium text-primary">{agency.email}</p></div>
              </li>
              {agency.website && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0"><Globe className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">{da.websiteLabel}</p><p className="text-sm font-medium text-primary">{agency.website}</p></div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0"><Globe className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">{da.languagesLabel}</p><p className="text-sm font-medium text-foreground">{agency.languages.join(", ")}</p></div>
              </li>
            </ul>
            <div className="flex flex-col gap-2">
              <Button className="w-full bg-[#25D366] hover:bg-[#1faa53] text-white" asChild>
                <a href={`https://wa.me/${agency.phone.replace(/[\s+\-()]/g, "")}?text=${encodeURIComponent(da.whatsappMsg.replace("{name}", agency.name))}`}
                  target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.305 1.262.483 1.694.61.712.227 1.36.195 1.871.121.571-.085 1.758-.719 2.006-1.413.255-.704.255-1.301.18-1.426-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.742.982.999-3.648-.235-.375a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`tel:${agency.phone}`}><Phone className="w-4 h-4 mr-2" /> {da.callBtn}</a>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Agency properties */}
      {agencyProperties.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {da.listingsHeading.replace("{name}", agency.name)}
            </h2>
            <span className="text-sm text-muted-foreground">
              {agencyProperties.length} {agencyProperties.length > 1 ? da.properties : da.property}
            </span>
          </div>
          <div className="space-y-5">
            {agencyProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </section>
      )}
    </div>
  );
}
