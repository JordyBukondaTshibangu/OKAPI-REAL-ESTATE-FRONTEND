"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle,
  Globe,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import PropertyCard from "@/features/properties/components/PropertyCard";
import type { Agency } from "@/features/agency/types/agency";
import type { Agent } from "@/features/agents/types/agent";
import type { Property } from "@/features/properties/types/property";
import { useT } from "@/i18n/useT";

const RENTAL_FOCUS_LABELS: Record<string, string> = {
  LONG_TERM:  "Location longue durée",
  SHORT_TERM: "Location courte durée",
  BOTH:       "Vente & Location",
};

function getMonogram(agency: Agency): string {
  if (agency.monogram) return agency.monogram;
  return agency.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:border-[#C9A227]/40 hover:shadow-md transition-all duration-200"
    >
      <AgentAvatar name={agent.name} photo={agent.photo} size={48} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-[#C9A227] transition-colors">
          {agent.name}
        </p>
        {agent.specialization && (
          <p className="text-xs text-muted-foreground truncate">{agent.specialization}</p>
        )}
        {agent.title && (
          <p className="text-[11px] font-bold tracking-wider text-[#C9A227] uppercase mt-0.5">
            {agent.title}
          </p>
        )}
      </div>
      <ArrowLeft className="size-3.5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

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

  const monogram = getMonogram(agency);
  const yearsActive = agency.founded ? new Date().getFullYear() - agency.founded : null;

  const whatsappNumber = (agency.whatsapp ?? agency.phone).replace(/[\s+\-()]/g, "");
  const whatsappMsg = encodeURIComponent(
    `Bonjour ${agency.name}, je vous contacte via Okapi Real Estate.`
  );

  const stats = [
    {
      label: "Agents",
      value: agencyAgents.length || agency.agentCount || 0,
      icon: Users,
      color: "text-[#1B4FD8]",
      bg: "bg-[#1B4FD8]/10",
    },
    {
      label: "Annonces actives",
      value: agencyProperties.length || agency.listingCount || 0,
      icon: Briefcase,
      color: "text-[#C9A227]",
      bg: "bg-[#C9A227]/10",
    },
    {
      label: "Transactions",
      value: agency.closedDeals ?? 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    ...(yearsActive !== null
      ? [{ label: "Ans d'expérience", value: yearsActive, icon: Award, color: "text-purple-600", bg: "bg-purple-500/10" }]
      : []),
  ];

  return (
    <div className="bg-[#F2F4F7] dark:bg-[#0B1D3A] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0B1D3A] text-white overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-[#1B4FD8]/15 blur-3xl" />
          <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-[#C9A227]/5 blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-20">
          {/* Back link */}
          <Link
            href="/agences"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-10 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Toutes les agences
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Logo / Monogram */}
            <div className="shrink-0 w-24 h-24 rounded-2xl bg-[#C9A227] flex items-center justify-center shadow-2xl overflow-hidden">
              {agency.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-[#0B1D3A] tracking-tight">
                  {monogram}
                </span>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{agency.name}</h1>
                {agency.founded && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
                    Est. {agency.founded}
                  </span>
                )}
                {agency.rccmNumber && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                    <ShieldCheck className="size-3" />
                    RCCM vérifié
                  </span>
                )}
              </div>

              {agency.tagline && (
                <p className="text-[#C9A227]/90 text-base font-medium italic mb-4">
                  &ldquo;{agency.tagline}&rdquo;
                </p>
              )}

              {/* Contact chips */}
              <div className="flex flex-wrap gap-4">
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                    <Mail className="size-3.5 shrink-0" /> {agency.email}
                  </a>
                )}
                {agency.phone && (
                  <a href={`tel:${agency.phone}`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                    <Phone className="size-3.5 shrink-0" /> {agency.phone}
                  </a>
                )}
                {agency.website && (
                  <a href={agency.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                    <Globe className="size-3.5 shrink-0" />
                    {agency.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — overlaps bottom of hero. Rendered as a sibling after
          the hero section (instead of inside it) and pulled up with a
          negative margin rather than a transform, so it isn't clipped by
          the hero's overflow-hidden (used to contain its background blurs)
          and doesn't need a compensating spacer below. */}
      <div className="relative max-w-6xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-border p-6">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
                <Icon className={`size-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

        {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
        <div className="space-y-10">

          {/* About */}
          {agency.description && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <BadgeCheck className="size-5 text-[#C9A227]" /> À propos
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">{agency.description}</p>
            </section>
          )}

          {/* Activity */}
          {((agency.communes?.length ?? 0) > 0 ||
            (agency.propertyTypes?.length ?? 0) > 0 ||
            agency.rentalFocus) && (
            <section className="border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-[#1B4FD8]" /> Activité & Marché
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {agency.rentalFocus && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Focus</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B4FD8]/10 text-[#1B4FD8] text-sm font-semibold border border-[#1B4FD8]/20">
                      {RENTAL_FOCUS_LABELS[agency.rentalFocus] ?? agency.rentalFocus}
                    </span>
                  </div>
                )}
                {(agency.communes?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Communes couvertes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {agency.communes!.map((c) => (
                        <span key={c} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-background border border-border text-xs font-medium text-foreground">
                          <MapPin className="size-3 text-muted-foreground" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(agency.propertyTypes?.length ?? 0) > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Types de biens</p>
                    <div className="flex flex-wrap gap-1.5">
                      {agency.propertyTypes!.map((t) => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 text-xs font-semibold">
                          <Home className="size-3" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Specializations */}
          {(agency.specializations?.length ?? 0) > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="size-5 text-[#C9A227]" />
                {da.specializationsHeading}
              </h2>
              <div className="flex flex-wrap gap-2">
                {agency.specializations!.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 text-sm font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Areas served */}
          {(agency.areasServed?.length ?? 0) > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-[#1B4FD8]" />
                {da.areasHeading}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {agency.areasServed!.map((area) => (
                  <div key={area} className="flex items-center gap-2 text-sm text-foreground/85 p-2.5 rounded-xl bg-background border border-border">
                    <MapPin className="size-3.5 text-[#1B4FD8] shrink-0" /> {area}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Team */}
          {agencyAgents.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="size-5 text-[#1B4FD8]" />
                {da.teamHeading.replace("{n}", String(agencyAgents.length))}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agencyAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {(agency.certifications?.length ?? 0) > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-emerald-600" />
                {da.certificationsHeading}
              </h2>
              <ul className="space-y-2.5">
                {agency.certifications!.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-foreground/85 p-3 rounded-xl bg-background border border-border">
                    <CheckCircle className="size-4 text-emerald-500 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ── RIGHT COLUMN — Contact sidebar ────────────────────────── */}
        <aside>
          <div className="lg:sticky lg:top-28 space-y-4">

            {/* Contact card */}
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-[#0B1D3A] px-6 py-4">
                <h3 className="text-base font-bold text-white">{da.contactAgencyHeading}</h3>
              </div>

              <div className="p-6 space-y-4">
                {[
                  agency.address  && { icon: MapPin,         label: da.addressLabel,  value: agency.address,  href: undefined },
                  agency.phone    && { icon: Phone,          label: da.phoneLabel,    value: agency.phone,    href: `tel:${agency.phone}` },
                  agency.email    && { icon: Mail,           label: da.emailLabel,    value: agency.email,    href: `mailto:${agency.email}` },
                  agency.website  && { icon: Globe,          label: da.websiteLabel,  value: agency.website.replace(/^https?:\/\//, ""), href: agency.website },
                  (agency.languages?.length ?? 0) > 0 && { icon: Globe, label: da.languagesLabel, value: agency.languages!.join(", "), href: undefined },
                  agency.rccmNumber && { icon: ShieldCheck,  label: "RCCM",           value: agency.rccmNumber, href: undefined },
                ].filter(Boolean).map((item) => {
                  const { icon: Icon, label, value, href } = item as {
                    icon: React.ElementType; label: string; value: string; href?: string;
                  };
                  const content = (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0B1D3A]/8 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-4 text-[#1B4FD8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground mb-0.5 font-medium uppercase tracking-wide">{label}</p>
                        <p className={`text-sm font-semibold text-foreground break-all ${href ? "text-[#1B4FD8] hover:underline" : ""}`}>{value}</p>
                      </div>
                    </div>
                  );
                  return href ? (
                    <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={label}>{content}</div>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div className="px-6 pb-6 flex flex-col gap-3">
                <Button className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl h-11" asChild>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="w-full rounded-xl h-11 font-semibold" asChild>
                  <a href={`tel:${agency.phone}`}>
                    <Phone className="size-4 mr-2" />
                    {da.callBtn}
                  </a>
                </Button>
              </div>
            </div>

            {/* RCCM verification badge */}
            {agency.rccmNumber && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="size-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Agence vérifiée</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">Enregistrée au RCCM de Kinshasa</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Listings ─────────────────────────────────────────────────── */}
      {agencyProperties.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="border-t border-border pt-10 mb-8 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Home className="size-5 text-[#1B4FD8]" />
              {da.listingsHeading.replace("{name}", agency.name)}
            </h2>
            <span className="text-sm text-muted-foreground font-medium">
              {agencyProperties.length} {agencyProperties.length > 1 ? da.properties : da.property}
            </span>
          </div>
          <div className="space-y-5">
            {agencyProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
