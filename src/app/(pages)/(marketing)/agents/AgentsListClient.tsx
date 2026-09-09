"use client";

import { useT } from "@/i18n/useT";
import AgencyCard from "@/features/agency/components/AgencyCard";
import AgentCard from "@/features/agents/components/AgentCard";
import AgentPagination from "@/features/agents/components/AgentPagination";
import SuperAgentIllustration from "@/features/agents/components/SuperAgentIllustration";
import { useAgencies } from "@/hooks/useAgencies";
import { useAgents } from "@/hooks/useAgents";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/shared/components/ui/button";
import { useAgenciesStore } from "@/store/useAgenciesStore";
import { useAgentsStore } from "@/store/useAgentsStore";
import {
  ChevronDown,
  Search,
  Sparkles,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { KINSHASA_COMMUNES } from "@/constants/kinshasa";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LIMIT = 12;

const TITLE_RANK: Record<string, number> = {
  SUPERAGENT: 0,
  "AGENT EXCLUSIF": 1,
  AGENT: 2,
};

export default function AgentsListClient() {
  const t = useT();
  const [tab, setTab] = useState<"agents" | "agencies">("agents");
  const [sortBy, setSortBy] = useState<"pertinence" | "title">("pertinence");
  const [sortOpen, setSortOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const titleFilter = searchParams.get("title");

  const TRANSACTIONS: { label: string; value: "all" | "sale" | "rent" }[] = [
    { label: t.agentsPage.transactionAll, value: "all" },
    { label: t.agentsPage.transactionSale, value: "sale" },
    { label: t.agentsPage.transactionRent, value: "rent" },
  ];

  function handleSuperAgentFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("title", "SUPERAGENT");
    router.push(`?${params.toString()}`);
    setTimeout(() => {
      document.getElementById("agents-grid")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function clearTitleFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("title");
    router.push(`?${params.toString()}`);
  }

  // ── Agent store ──
  const agentQuery = useAgentsStore((s) => s.query);
  const agentTransaction = useAgentsStore((s) => s.transaction);
  const agentLanguage = useAgentsStore((s) => s.language);
  const agentCommune = useAgentsStore((s) => s.commune);
  const agentPropertyType = useAgentsStore((s) => s.propertyType);
  const agentMinRating = useAgentsStore((s) => s.minRating);
  const agentTypeFilter = useAgentsStore((s) => s.agentType);
  const agentPage = useAgentsStore((s) => s.page);
  const setQuery = useAgentsStore((s) => s.setQuery);
  const setTransaction = useAgentsStore((s) => s.setTransaction);
  const setLanguage = useAgentsStore((s) => s.setLanguage);
  const setCommune = useAgentsStore((s) => s.setCommune);
  const setPropertyType = useAgentsStore((s) => s.setPropertyType);
  const setMinRating = useAgentsStore((s) => s.setMinRating);
  const setAgentTypeFilter = useAgentsStore((s) => s.setAgentType);
  const setAgentPage = useAgentsStore((s) => s.setPage);
  const resetAgentFilters = useAgentsStore((s) => s.resetFilters);

  // ── Agency store ──
  const agencyName = useAgenciesStore((s) => s.name);
  const agencyLanguage = useAgenciesStore((s) => s.language);
  const agencyCommune = useAgenciesStore((s) => s.commune);
  const agencyPropertyType = useAgenciesStore((s) => s.propertyType);
  const agencyRentalFocus = useAgenciesStore((s) => s.rentalFocus);
  const agencyMinAgents = useAgenciesStore((s) => s.minAgents);
  const agencyPage = useAgenciesStore((s) => s.page);
  const setAgencyName = useAgenciesStore((s) => s.setName);
  const setAgencyLanguage = useAgenciesStore((s) => s.setLanguage);
  const setAgencyCommune = useAgenciesStore((s) => s.setCommune);
  const setAgencyPropertyType = useAgenciesStore((s) => s.setPropertyType);
  const setAgencyRentalFocus = useAgenciesStore((s) => s.setRentalFocus);
  const setAgencyMinAgents = useAgenciesStore((s) => s.setMinAgents);
  const setAgencyPage = useAgenciesStore((s) => s.setPage);
  const resetAgencyFilters = useAgenciesStore((s) => s.resetFilters);

  const debouncedAgentQuery = useDebounce(agentQuery, 400);
  const debouncedAgencyName = useDebounce(agencyName, 400);

  // ── TanStack Query ──
  const { data: agentsData, isLoading: agentLoading } = useAgents({
    page: agentPage,
    limit: LIMIT,
    name: debouncedAgentQuery || undefined,
    language: agentLanguage || undefined,
    commune: agentCommune || undefined,
    propertyType: agentPropertyType || undefined,
    minRating: agentMinRating ?? undefined,
    agentType: agentTypeFilter || undefined,
  });

  const { data: agenciesData, isLoading: agencyLoading } = useAgencies({
    page: agencyPage,
    limit: LIMIT,
    name: debouncedAgencyName || undefined,
    language: agencyLanguage || undefined,
    commune: agencyCommune || undefined,
    propertyType: agencyPropertyType || undefined,
    rentalFocus: agencyRentalFocus || undefined,
    minAgents: agencyMinAgents ?? undefined,
  });

  const agents = useMemo(() => agentsData?.data ?? [], [agentsData]);
  const agentMeta = agentsData?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 0 };
  const agencies = useMemo(() => agenciesData?.data ?? [], [agenciesData]);
  const agencyMeta = agenciesData?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 0 };

  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => a.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [agents]);

  const agencyLanguageOptions = useMemo(() => {
    const set = new Set<string>();
    agencies.forEach((a) => a.languages?.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [agencies]);

  const displayedAgents = useMemo(() => {
    let result = [...agents];
    if (titleFilter) result = result.filter((a) => a.title === titleFilter);
    if (sortBy === "title") {
      result = result.sort(
        (a, b) => (TITLE_RANK[a.title] ?? 99) - (TITLE_RANK[b.title] ?? 99),
      );
    }
    return result;
  }, [agents, titleFilter, sortBy]);

  const hasAgentFilters =
    !!agentQuery || !!agentLanguage || agentTransaction !== "all" ||
    !!agentCommune || !!agentPropertyType || agentMinRating != null || !!agentTypeFilter;

  const hasAgencyFilters = !!agencyName || !!agencyLanguage || !!agencyCommune || !!agencyPropertyType || !!agencyRentalFocus || agencyMinAgents != null;

  return (
    <div className="bg-background-alt">
      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(212,175,55,0.45), transparent 35%), radial-gradient(circle at 80% 70%, rgba(30,99,181,0.5), transparent 40%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t.agentsPage.heroHeading}
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            {t.agentsPage.heroSubtitle}
          </p>
        </div>
      </section>

      {/* SuperAgent promo */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="rounded-2xl bg-accent border border-primary/10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-secondary font-semibold text-xs tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" /> {t.agentsPage.superAgentBadge}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t.agentsPage.superAgentHeading}
            </h2>
            <p className="text-sm text-foreground/80 mt-2 max-w-xl">
              {t.agentsPage.superAgentSubtitle}
            </p>
            <Button variant="outlineGold" className="mt-4" onClick={handleSuperAgentFilter}>
              {t.agentsPage.findSuperAgent}
            </Button>
          </div>
          <SuperAgentIllustration />
        </div>
      </section>

      {/* Main listing section — sidebar + grid layout */}
      <section className="bg-background-alt pb-16 px-6 mt-8" id="agents-grid">
        <div className="max-w-7xl mx-auto">

          {/* Sticky tab chips */}
          <div className="sticky top-28 z-20 bg-background-alt py-3 mb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Tabs as chips */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab("agents")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 h-8 text-sm font-medium transition-colors ${
                    tab === "agents"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-foreground/70 hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {t.agentsPage.tabAgents}
                  {agentMeta.total > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-foreground/40" />
                      <span className="text-foreground/70">{agentMeta.total}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setTab("agencies")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 h-8 text-sm font-medium transition-colors ${
                    tab === "agencies"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-foreground/70 hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {t.agentsPage.tabAgencies}
                  {agencyMeta.total > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-foreground/40" />
                      <span className="text-foreground/70">{agencyMeta.total}</span>
                    </>
                  )}
                </button>

                {/* Title filter active chip */}
                {titleFilter && (
                  <span className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {titleFilter}
                    <button onClick={clearTitleFilter} className="hover:text-destructive ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort dropdown (agents tab only) */}
              {tab === "agents" && (
                <div className="relative">
                  <button
                    onClick={() => setSortOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary"
                  >
                    {t.agentsPage.sortBy}{" "}
                    <span className="font-medium">
                      {sortBy === "title" ? t.agentsPage.sortByTitle : t.agentsPage.sortRelevance}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-card rounded-xl border border-border shadow-lg z-30">
                      {(["pertinence", "title"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSortBy(opt); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent ${sortBy === opt ? "bg-accent text-primary font-semibold" : ""}`}
                        >
                          {opt === "title" ? t.agentsPage.sortByTitle : t.agentsPage.sortRelevance}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Flex row: sidebar + cards */}
          <div className="flex items-start gap-6">

            {/* Filter sidebar — animated like PropertyListingPage */}
            <aside
              aria-label="Filtres"
              className="hidden lg:block shrink-0 self-start"
              style={{
                position: "sticky",
                top: "10rem",
                width: 300,
                minWidth: 300,
                maxHeight: "calc(100vh - 10rem)",
              }}
            >
              <div style={{ width: 300, height: "100%", maxHeight: "calc(100vh - 10rem)" }}>
                {tab === "agents" ? (
                  <AgentFilterPanel
                    query={agentQuery}
                    onQueryChange={setQuery}
                    language={agentLanguage}
                    onLanguageChange={setLanguage}
                    languageOptions={languageOptions}
                    commune={agentCommune}
                    onCommuneChange={setCommune}
                    propertyType={agentPropertyType}
                    onPropertyTypeChange={setPropertyType}
                    minRating={agentMinRating}
                    onMinRatingChange={setMinRating}
                    agentType={agentTypeFilter}
                    onAgentTypeChange={setAgentTypeFilter}
                    hasFilters={hasAgentFilters}
                    onReset={resetAgentFilters}
                    t={t}
                  />
                ) : (
                  <AgencyFilterPanel
                    name={agencyName}
                    onNameChange={setAgencyName}
                    language={agencyLanguage}
                    onLanguageChange={setAgencyLanguage}
                    languageOptions={agencyLanguageOptions}
                    commune={agencyCommune}
                    onCommuneChange={setAgencyCommune}
                    propertyType={agencyPropertyType}
                    onPropertyTypeChange={setAgencyPropertyType}
                    rentalFocus={agencyRentalFocus}
                    onRentalFocusChange={setAgencyRentalFocus}
                    minAgents={agencyMinAgents}
                    onMinAgentsChange={setAgencyMinAgents}
                    hasFilters={hasAgencyFilters}
                    onReset={resetAgencyFilters}
                    t={t}
                  />
                )}
              </div>
            </aside>

            {/* Cards */}
            <div className="flex-1 min-w-0 pt-2">
              {tab === "agents" ? (
                agentLoading ? (
                  <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-10 text-center text-muted-foreground">
                    {t.agentsPage.loadingAgents}
                  </div>
                ) : displayedAgents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-10 text-center text-muted-foreground">
                    {t.agentsPage.noAgents}
                  </div>
                ) : (
                  <>
                    <div
                      className="grid gap-4 pb-8 grid-cols-1 sm:grid-cols-2"
                    >
                      {displayedAgents.map((a) => (
                        <AgentCard key={a.id} agent={a} />
                      ))}
                    </div>
                    {agentMeta.totalPages > 1 && (
                      <AgentPagination
                        page={agentMeta.page}
                        totalPages={agentMeta.totalPages}
                        onPageChange={setAgentPage}
                      />
                    )}
                  </>
                )
              ) : agencyLoading ? (
                <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-10 text-center text-muted-foreground">
                  {t.agentsPage.loadingAgencies}
                </div>
              ) : agencies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-white dark:bg-card p-10 text-center text-muted-foreground">
                  {t.agentsPage.noAgencies}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 pb-8 grid-cols-1 sm:grid-cols-2">
                    {agencies.map((agency) => (
                      <AgencyCard key={agency.id} agency={agency} />
                    ))}
                  </div>
                  {agencyMeta.totalPages > 1 && (
                    <AgentPagination
                      page={agencyMeta.page}
                      totalPages={agencyMeta.totalPages}
                      onPageChange={setAgencyPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const RATING_OPTIONS = [
  { label: "4.5+ ★", value: 4.5 },
  { label: "4+ ★", value: 4 },
  { label: "3+ ★", value: 3 },
];

/* ── Agent filter sidebar panel ─────────────────────────────────────── */
function AgentFilterPanel({
  query,
  onQueryChange,
  language,
  onLanguageChange,
  languageOptions,
  commune,
  onCommuneChange,
  propertyType,
  onPropertyTypeChange,
  minRating,
  onMinRatingChange,
  agentType,
  onAgentTypeChange,
  hasFilters,
  onReset,
  t,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  language: string | null;
  onLanguageChange: (v: string | null) => void;
  languageOptions: string[];
  commune: string | null;
  onCommuneChange: (v: string | null) => void;
  propertyType: string | null;
  onPropertyTypeChange: (v: string | null) => void;
  minRating: number | null;
  onMinRatingChange: (v: number | null) => void;
  agentType: string | null;
  onAgentTypeChange: (v: string | null) => void;
  hasFilters: boolean;
  onReset: () => void;
  t: ReturnType<typeof useT>;
}) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 10rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-primary">Filtres</h2>
          {hasFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-primary rounded-full px-2 py-0.5 hover:bg-primary/80 transition-colors"
            >
              {t.agentsPage.filterClearBtn}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

        {/* Search */}
        <section>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.agentsPage.agentSearchPlaceholder}
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-sm"
            />
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Commune */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterCommune}</h3>
          <select
            value={commune ?? ""}
            onChange={(e) => onCommuneChange(e.target.value || null)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          >
            <option value="">{t.agentsPage.filterAllCommunes}</option>
            {KINSHASA_COMMUNES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </section>

        <div className="border-t border-border" />

        {/* Property type */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterPropertyType}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t.agentsPage.propTypeApartments, value: "Appartements" },
              { label: t.agentsPage.propTypeVillas, value: "Villas" },
              { label: t.agentsPage.propTypeStudios, value: "Studios" },
              { label: t.agentsPage.propTypeLand, value: "Terrains" },
              { label: t.agentsPage.propTypeOffices, value: "Bureaux" },
              { label: t.agentsPage.propTypeWarehouses, value: "Entrepôts" },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => onPropertyTypeChange(propertyType === o.value ? null : o.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  propertyType === o.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Note minimale */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterRating}</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMinRatingChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                minRating == null ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground/80"
              }`}
            >
              {t.agentsPage.filterAllRatings}
            </button>
            {RATING_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => onMinRatingChange(r.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                  minRating === r.value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground/80"
                }`}
              >
                <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Langue */}
        {languageOptions.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterLanguage}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onLanguageChange(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  !language ? "bg-primary text-white border-primary" : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {t.agentsPage.filterAll}
              </button>
              {languageOptions.map((l) => (
                <button
                  key={l}
                  onClick={() => onLanguageChange(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    language === l ? "bg-primary text-white border-primary" : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/* ── Agency filter sidebar panel ────────────────────────────────────── */
function AgencyFilterPanel({
  name,
  onNameChange,
  language,
  onLanguageChange,
  languageOptions,
  commune,
  onCommuneChange,
  propertyType,
  onPropertyTypeChange,
  rentalFocus,
  onRentalFocusChange,
  minAgents,
  onMinAgentsChange,
  hasFilters,
  onReset,
  t,
}: {
  name: string;
  onNameChange: (v: string) => void;
  language: string | null;
  onLanguageChange: (v: string | null) => void;
  languageOptions: string[];
  commune: string | null;
  onCommuneChange: (v: string | null) => void;
  propertyType: string | null;
  onPropertyTypeChange: (v: string | null) => void;
  rentalFocus: string | null;
  onRentalFocusChange: (v: string | null) => void;
  minAgents: number | null;
  onMinAgentsChange: (v: number | null) => void;
  hasFilters: boolean;
  onReset: () => void;
  t: ReturnType<typeof useT>;
}) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 10rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-primary">Filtres</h2>
          {hasFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-semibold text-white bg-primary rounded-full px-2 py-0.5 hover:bg-primary/80 transition-colors"
            >
              {t.agentsPage.filterClearBtn}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

        {/* Search */}
        <section>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t.agentsPage.agencySearchPlaceholder}
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-sm"
            />
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Commune */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterCommune}</h3>
          <select
            value={commune ?? ""}
            onChange={(e) => onCommuneChange(e.target.value || null)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          >
            <option value="">{t.agentsPage.filterAllCommunes}</option>
            {KINSHASA_COMMUNES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </section>

        <div className="border-t border-border" />

        {/* Property type */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterPropertyType}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t.agentsPage.propTypeApartments, value: "Appartements" },
              { label: t.agentsPage.propTypeVillas, value: "Villas" },
              { label: t.agentsPage.propTypeStudios, value: "Studios" },
              { label: t.agentsPage.propTypeLand, value: "Terrains" },
              { label: t.agentsPage.propTypeOffices, value: "Bureaux" },
              { label: t.agentsPage.propTypeWarehouses, value: "Entrepôts" },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => onPropertyTypeChange(propertyType === o.value ? null : o.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  propertyType === o.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Spécialisation */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterSpecialization}</h3>
          <div className="flex flex-col gap-1">
            {[
              { label: t.agentsPage.rentalFocusAll, value: null },
              { label: t.agentsPage.rentalFocusLong, value: "LONG_TERM" },
              { label: t.agentsPage.rentalFocusShort, value: "SHORT_TERM" },
              { label: t.agentsPage.rentalFocusBoth, value: "BOTH" },
            ].map((r) => (
              <button
                key={r.value ?? "all"}
                onClick={() => onRentalFocusChange(r.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  rentalFocus === r.value
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted text-foreground/80"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Taille d'équipe */}
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterTeamSize}</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMinAgentsChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                minAgents == null ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground/80"
              }`}
            >
              {t.agentsPage.filterAllSizes}
            </button>
            {[
              { label: t.agentsPage.minAgents2, value: 2 },
              { label: t.agentsPage.minAgents5, value: 5 },
              { label: t.agentsPage.minAgents10, value: 10 },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => onMinAgentsChange(o.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  minAgents === o.value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground/80"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        {/* Langue */}
        {languageOptions.length > 0 && (
          <>
            <div className="border-t border-border" />
            <section>
              <h3 className="text-sm font-bold text-foreground mb-2">{t.agentsPage.filterLanguage}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLanguageChange(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    !language ? "bg-primary text-white border-primary" : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {t.agentsPage.filterAll}
                </button>
                {languageOptions.map((l) => (
                  <button
                    key={l}
                    onClick={() => onLanguageChange(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      language === l ? "bg-primary text-white border-primary" : "bg-white dark:bg-card text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
