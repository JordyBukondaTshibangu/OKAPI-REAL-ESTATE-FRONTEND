"use client";

import type { Agent } from "@/features/agents/types/agent";
import PropertyCard from "@/features/properties/components/PropertyCard";
import type { Property } from "@/features/properties/types/property";
import { formatTotalValue } from "@/lib/agents";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  MapPin,
  Share2,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Note ${value}/5`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fill = i < full ? 1 : i === full ? partial : 0;
        return (
          <span key={i} className="relative w-3.5 h-3.5">
            <Star className="absolute inset-0 w-3.5 h-3.5 text-white/30" />
            <span
              style={{ width: `${fill * 100}%` }}
              className="absolute inset-y-0 left-0 overflow-hidden"
            >
              <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StarRatingDark({ value, max = 5 }: { value: number; max?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Note ${value}/5`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fill = i < full ? 1 : i === full ? partial : 0;
        return (
          <span key={i} className="relative w-3.5 h-3.5">
            <Star className="absolute inset-0 w-3.5 h-3.5 text-foreground/15" />
            <span
              style={{ width: `${fill * 100}%` }}
              className="absolute inset-y-0 left-0 overflow-hidden"
            >
              <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StatColumn({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs md:text-sm text-white/75 inline-flex items-center gap-1 justify-center">
        {label}
        {hint && <Info className="w-3.5 h-3.5 opacity-60" />}
      </p>
    </div>
  );
}

export default function AgentDetailClient({
  id,
  agent,
  agentProperties,
}: {
  id: string;
  agent: Agent;
  agentProperties: Property[];
}) {
  const [activeArea, setActiveArea] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [showAllRecord, setShowAllRecord] = useState(false);
  const [propertiesTab, setPropertiesTab] = useState<"sale" | "rent">("sale");

  const filteredProps = agentProperties.filter((p) =>
    propertiesTab === "sale"
      ? p.listingType !== "rent"
      : p.listingType === "rent",
  );
  const trackRecord = showAllRecord
    ? agent.trackRecord
    : agent.trackRecord.slice(0, 5);
  const activeAreaData = agent.areasOfExpertise[activeArea];

  return (
    <div className="bg-background-alt pb-20">
      {/* Top sub-nav */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux résultats
          </Link>
          <Breadcrumb agent={agent} />
          <button className="hidden md:inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary">
            <Share2 className="w-4 h-4" /> Partager le profil
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(212,175,55,0.45), transparent 35%), radial-gradient(circle at 85% 75%, rgba(30,99,181,0.55), transparent 45%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Profile card */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="ring-4 ring-secondary shadow-lg rounded-full">
                <AgentAvatar name={agent.name} photo={agent.photo} size={176} />
              </div>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-bold tracking-widest px-2 py-1 rounded-md">
                  <Trophy className="w-3 h-3" /> {agent.title}
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-white/80">
                  <Info className="w-3 h-3" />
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {agent.name}
              </h1>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="font-semibold">{agent.rating.toFixed(1)}</span>
                <StarRating value={agent.rating} />
                <span className="text-white/80">{agent.ratingsCount} avis</span>
              </div>
              <p className="mt-3 text-sm md:text-base text-white/85">
                {agent.nationality} · {agent.languages.join(", ")} · +
                {agent.yearsExperience} ans d&apos;expérience
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-sm text-white/85">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {agent.name.split(" ")[0]} répond habituellement en moins de{" "}
                  {agent.responseMinutes} min
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <Button className="h-11 gap-2 bg-white text-foreground hover:bg-white/90">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#25D366]"
                  >
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.305 1.262.483 1.694.61.712.227 1.36.195 1.871.121.571-.085 1.758-.719 2.006-1.413.255-.704.255-1.301.18-1.426-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.742.982.999-3.648-.235-.375a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="h-11 gap-2 border-white/40 text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <a href="#properties">
                    <Home className="w-4 h-4" /> Voir les biens
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Brokerage card */}
          <aside className="rounded-2xl bg-white/8 border border-white/15 backdrop-blur-sm p-5 text-center self-start">
            <p className="text-[10px] font-bold tracking-widest text-white/70 mb-3">
              AGENCE
            </p>
            <div
              className={`w-28 h-28 mx-auto rounded-md ${agent.agencyAccent} text-white flex items-center justify-center text-2xl font-bold tracking-tight shadow-md`}
            >
              {agent.agencyMonogram}
            </div>
            <p className="mt-3 text-base font-semibold text-white">
              {agent.agency}
            </p>
            <Link
              href="/a-propos"
              className="text-xs text-secondary hover:underline mt-1 inline-block"
            >
              À propos de l&apos;agence
            </Link>
          </aside>
        </div>

        {/* Stats bar */}
        <div className="relative bg-navy/60 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-5 divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="md:px-2 first:md:pl-0">
              <StatColumn
                value={String(agent.forSaleCount)}
                label="Biens à vendre"
              />
            </div>
            <div className="md:px-2">
              <StatColumn
                value={String(agent.forRentCount)}
                label="Biens à louer"
              />
            </div>
            <div className="md:px-2">
              <StatColumn
                value={String(agent.closedDeals)}
                label="Transactions conclues"
                hint="12 derniers mois"
              />
            </div>
            <div className="md:px-2 last:md:pr-0">
              <StatColumn
                value={formatTotalValue(agent.totalDealsValueUsd)}
                label="Valeur totale"
                hint="USD"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-12">
        {/* Track record */}
        <section className="bg-white rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-end justify-between mb-2">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Historique des transactions
            </h2>
            <p className="text-xs text-muted-foreground">12 derniers mois</p>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Transactions soumises par l&apos;agent à Okapi Real Estate.
          </p>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] bg-muted text-xs font-semibold text-foreground/85 px-4 py-3">
              <span>Localisation</span>
              <span>Type d&apos;opération</span>
              <span>Date</span>
              <span>Type de bien</span>
              <span>Chambres</span>
            </div>
            {trackRecord.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.6fr] gap-y-1 px-4 py-3 text-sm border-t border-border first:border-t-0"
              >
                <div className="md:flex md:flex-col">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {row.location}
                  </span>
                  <span className="font-medium text-foreground">
                    {row.building}
                  </span>
                </div>
                <span className="text-foreground/85">{row.dealType}</span>
                <span className="text-foreground/85">{row.date}</span>
                <span className="text-foreground/85">{row.propertyType}</span>
                <span className="text-foreground/85">{row.bedrooms}</span>
              </div>
            ))}
          </div>

          {agent.trackRecord.length > 5 && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAllRecord((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {showAllRecord ? "Réduire" : "Tout afficher"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showAllRecord ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </section>

        {/* Personal information */}
        <section className="bg-white rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-5">
            Informations personnelles
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-muted-foreground">Spécialisation</dt>
              <dd className="font-medium text-foreground">
                {agent.specialization}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-muted-foreground">Expérience depuis</dt>
              <dd className="font-medium text-foreground">
                {agent.experienceSince}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-muted-foreground">
                Licence d&apos;agent (BLN)
              </dt>
              <dd className="font-medium text-foreground">
                {agent.brokerLicense}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-muted-foreground">Agence</dt>
              <dd className="font-medium text-foreground">{agent.agency}</dd>
            </div>
          </dl>
        </section>

        {/* Areas of expertise */}
        <section className="bg-white rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Zones d&apos;expertise de {agent.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Découvrez les quartiers où {agent.name.split(" ")[0]} est
            spécialisé(e) et possède une connaissance approfondie du marché.
          </p>

          <div className="mt-5 border-b border-border flex flex-wrap gap-1 overflow-x-auto">
            {agent.areasOfExpertise.map((area, i) => (
              <button
                key={area.name}
                onClick={() => setActiveArea(i)}
                className={`relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  activeArea === i
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {area.name}
                {activeArea === i && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeAreaData && (
            <div className="mt-5 rounded-xl bg-accent/60 grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-hidden border border-accent">
              <div className="bg-gradient-to-br from-primary-light via-white to-accent flex items-center justify-center p-6">
                <NeighborhoodIllustration />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeAreaData.name}
                  </h3>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    En savoir plus
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <StarRatingDark value={activeAreaData.rating} />
                  <span className="text-muted-foreground">
                    {activeAreaData.ratings} avis
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mt-3">
                  {activeAreaData.description}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-5">
                  <AreaStat value={activeAreaData.forSale} label="à vendre" />
                  <AreaStat value={activeAreaData.forRent} label="à louer" />
                  <AreaStat
                    value={activeAreaData.closedDeals}
                    label="transactions"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* About me */}
        <section className="bg-white rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
            À propos de moi
          </h2>
          <p
            className={`text-sm leading-relaxed text-foreground/85 ${
              !bioExpanded ? "line-clamp-4" : ""
            }`}
          >
            {agent.bio}
          </p>
          <button
            onClick={() => setBioExpanded((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline border border-primary rounded-md px-3 py-1.5"
          >
            {bioExpanded ? "Réduire" : "Lire plus"}
          </button>
        </section>

        {/* My properties */}
        <section id="properties">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Biens de {agent.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filteredProps.length}
              </span>{" "}
              annonce{filteredProps.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setPropertiesTab("sale")}
              className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors border ${
                propertiesTab === "sale"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-border hover:border-primary/40"
              }`}
            >
              À vendre
            </button>
            <button
              onClick={() => setPropertiesTab("rent")}
              className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors border ${
                propertiesTab === "rent"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-border hover:border-primary/40"
              }`}
            >
              À louer
            </button>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              Tri :{" "}
              <span className="font-medium text-foreground">À la une</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>

          {filteredProps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
              Aucune annonce dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="space-y-5">
              {filteredProps.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function Breadcrumb({ agent }: { agent: Agent }) {
  return (
    <nav className="hidden md:flex items-center text-xs text-muted-foreground gap-1.5">
      <Link
        href="/"
        className="hover:text-primary inline-flex items-center gap-1"
      >
        Accueil
      </Link>
      <ChevronRight className="w-3 h-3 text-foreground/30" />
      <Link href="/agents" className="hover:text-primary">
        Trouver un agent
      </Link>
      <ChevronRight className="w-3 h-3 text-foreground/30" />
      <span className="hover:text-primary">{agent.agency}</span>
      <ChevronRight className="w-3 h-3 text-foreground/30" />
      <span className="text-foreground/85 truncate max-w-[160px]">
        {agent.name}
      </span>
    </nav>
  );
}

function AreaStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-white border border-border px-3 py-2 text-center">
      <p className="text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function NeighborhoodIllustration() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full max-w-[220px] h-auto"
      role="img"
      aria-label="Quartier"
    >
      <rect x="0" y="0" width="200" height="140" fill="transparent" />
      {/* Ground */}
      <rect x="0" y="100" width="200" height="40" fill="#F2F4F7" />
      <rect x="0" y="120" width="200" height="20" fill="#EAF2FB" />
      {/* Buildings */}
      <rect x="20" y="40" width="40" height="70" fill="#1E63B5" rx="2" />
      <rect x="70" y="55" width="35" height="55" fill="#0B1D3A" rx="2" />
      <rect x="115" y="30" width="55" height="80" fill="#1E63B5" rx="2" />
      {/* Windows */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="26" y={48 + i * 14} width="10" height="8" fill="#F4E4A6" />
          <rect x="44" y={48 + i * 14} width="10" height="8" fill="#F4E4A6" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={`b-${i}`}
          x="78"
          y={62 + i * 12}
          width="20"
          height="6"
          fill="#D4AF37"
          opacity="0.85"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={`c-${i}`}>
          <rect x="122" y={38 + i * 12} width="14" height="6" fill="#F4E4A6" />
          <rect x="148" y={38 + i * 12} width="14" height="6" fill="#F4E4A6" />
        </g>
      ))}
      {/* Plane */}
      <path
        d="M120 18 L150 22 L156 18 L150 14 L156 10 Z"
        fill="#D4AF37"
        opacity="0.8"
      />
      <circle cx="35" cy="20" r="6" fill="#fff" />
      <circle cx="50" cy="14" r="5" fill="#fff" />
      {/* Pin */}
      <g transform="translate(95 88)">
        <path d="M0 0 c-6 -8 -6 -16 0 -22 c6 6 6 14 0 22z" fill="#1E63B5" />
        <circle cx="0" cy="-15" r="3" fill="#fff" />
      </g>
      {/* Building base */}
      <rect x="0" y="108" width="200" height="2" fill="#1A1F2B" opacity="0.1" />
    </svg>
  );
}
