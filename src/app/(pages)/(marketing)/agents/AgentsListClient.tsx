"use client";

import AgencyCard from "@/features/agency/components/AgencyCard";
import AgentCard from "@/features/agents/components/AgentCard";
import AgentPagination from "@/features/agents/components/AgentPagination";
import AgentSelect from "@/features/agents/components/AgentSelect";
import SuperAgentIllustration from "@/features/agents/components/SuperAgentIllustration";
import { useAgencies } from "@/hooks/useAgencies";
import { useAgents } from "@/hooks/useAgents";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/shared/components/ui/button";
import { useAgenciesStore } from "@/store/useAgenciesStore";
import { useAgentsStore } from "@/store/useAgentsStore";
import { ChevronDown, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const TRANSACTIONS: { label: string; value: "all" | "sale" | "rent" }[] = [
  { label: "Vente résidentielle", value: "sale" },
  { label: "Location résidentielle", value: "rent" },
  { label: "Tous", value: "all" },
];

const LIMIT = 12;

export default function AgentsListClient() {
  const [tab, setTab] = useState<"agents" | "agencies">("agents");

  // ── Agent store ──
  const agentQuery = useAgentsStore((s) => s.query);
  const agentTransaction = useAgentsStore((s) => s.transaction);
  const agentLanguage = useAgentsStore((s) => s.language);
  const agentNationality = useAgentsStore((s) => s.nationality);
  const agentPage = useAgentsStore((s) => s.page);
  const setQuery = useAgentsStore((s) => s.setQuery);
  const setTransaction = useAgentsStore((s) => s.setTransaction);
  const setLanguage = useAgentsStore((s) => s.setLanguage);
  const setNationality = useAgentsStore((s) => s.setNationality);
  const setAgentPage = useAgentsStore((s) => s.setPage);
  const resetAgentFilters = useAgentsStore((s) => s.resetFilters);

  // ── Agency store ──
  const agencyName = useAgenciesStore((s) => s.name);
  const agencyLanguage = useAgenciesStore((s) => s.language);
  const agencyPage = useAgenciesStore((s) => s.page);
  const setAgencyName = useAgenciesStore((s) => s.setName);
  const setAgencyLanguage = useAgenciesStore((s) => s.setLanguage);
  const setAgencyPage = useAgenciesStore((s) => s.setPage);
  const resetAgencyFilters = useAgenciesStore((s) => s.resetFilters);

  // Debounce text inputs before triggering queries
  const debouncedAgentQuery = useDebounce(agentQuery, 400);
  const debouncedAgencyName = useDebounce(agencyName, 400);

  // ── TanStack Query ──
  const { data: agentsData, isLoading: agentLoading } = useAgents({
    page: agentPage,
    limit: LIMIT,
    name: debouncedAgentQuery || undefined,
    language: agentLanguage || undefined,
    nationality: agentNationality || undefined,
  });

  const { data: agenciesData, isLoading: agencyLoading } = useAgencies({
    page: agencyPage,
    limit: LIMIT,
    name: debouncedAgencyName || undefined,
    language: agencyLanguage || undefined,
  });

  const agents = agentsData?.data ?? [];
  const agentMeta = agentsData?.meta ?? {
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 0,
  };
  const agencies = agenciesData?.data ?? [];
  const agencyMeta = agenciesData?.meta ?? {
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 0,
  };

  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => a.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [agents]);

  const nationalityOptions = useMemo(() => {
    return Array.from(new Set(agents.map((a) => a.nationality))).sort();
  }, [agents]);

  const agencyLanguageOptions = useMemo(() => {
    const set = new Set<string>();
    agencies.forEach((a) => a.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [agencies]);

  const hasAgentFilters =
    !!agentQuery ||
    !!agentLanguage ||
    !!agentNationality ||
    agentTransaction !== "all";

  const hasAgencyFilters = !!agencyName || !!agencyLanguage;

  return (
    <div className="bg-background-alt">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(212,175,55,0.45), transparent 35%), radial-gradient(circle at 80% 70%, rgba(30,99,181,0.5), transparent 40%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-32 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Trouvez votre agent pour trouver votre bien
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Des agents vérifiés à travers Kinshasa, prêts à vous accompagner sur
            l&apos;achat, la vente ou la location de votre prochain bien.
          </p>
        </div>

        {/* Search panel */}
        <div className="relative max-w-6xl mx-auto px-6 -mb-12 -translate-y-12">
          <div className="bg-white text-foreground rounded-2xl shadow-lg p-5 md:p-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setTab("agents")}
                className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                  tab === "agents"
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground/80 hover:bg-muted/70"
                }`}
              >
                Agents
              </button>
              <button
                onClick={() => setTab("agencies")}
                className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                  tab === "agencies"
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground/80 hover:bg-muted/70"
                }`}
              >
                Agences
              </button>
            </div>

            {tab === "agents" ? (
              <>
                {/* Agent search row */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                  <label className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Saisissez un quartier ou un nom d'agent"
                      value={agentQuery}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full h-11 pl-9 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/40 text-sm"
                    />
                  </label>
                  <Button
                    variant="default"
                    className="h-11 px-6 rounded-lg gap-2"
                  >
                    <Search className="w-4 h-4" /> Rechercher
                  </Button>
                </div>

                {/* Agent filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  <AgentSelect
                    label={
                      TRANSACTIONS.find((t) => t.value === agentTransaction)
                        ?.label ?? "Transaction"
                    }
                  >
                    {TRANSACTIONS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTransaction(t.value)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                          agentTransaction === t.value
                            ? "bg-accent text-primary font-semibold"
                            : ""
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </AgentSelect>

                  <AgentSelect label={agentLanguage ?? "Langue"}>
                    <button
                      onClick={() => setLanguage(null)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                        !agentLanguage
                          ? "bg-accent text-primary font-semibold"
                          : ""
                      }`}
                    >
                      Toutes
                    </button>
                    {languageOptions.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                          agentLanguage === l
                            ? "bg-accent text-primary font-semibold"
                            : ""
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </AgentSelect>

                  <AgentSelect label={agentNationality ?? "Nationalité"}>
                    <button
                      onClick={() => setNationality(null)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                        !agentNationality
                          ? "bg-accent text-primary font-semibold"
                          : ""
                      }`}
                    >
                      Toutes
                    </button>
                    {nationalityOptions.map((n) => (
                      <button
                        key={n}
                        onClick={() => setNationality(n)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                          agentNationality === n
                            ? "bg-accent text-primary font-semibold"
                            : ""
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </AgentSelect>
                </div>

                {hasAgentFilters && (
                  <div className="mt-3 flex justify-end">
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={resetAgentFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Agency search row */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                  <label className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher une agence..."
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full h-11 pl-9 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/40 text-sm"
                    />
                  </label>
                  <Button
                    variant="default"
                    className="h-11 px-6 rounded-lg gap-2"
                  >
                    <Search className="w-4 h-4" /> Rechercher
                  </Button>
                </div>

                {/* Agency filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <AgentSelect label={agencyLanguage ?? "Langue"}>
                    <button
                      onClick={() => setAgencyLanguage(null)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                        !agencyLanguage
                          ? "bg-accent text-primary font-semibold"
                          : ""
                      }`}
                    >
                      Toutes
                    </button>
                    {agencyLanguageOptions.map((l) => (
                      <button
                        key={l}
                        onClick={() => setAgencyLanguage(l)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                          agencyLanguage === l
                            ? "bg-accent text-primary font-semibold"
                            : ""
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </AgentSelect>
                </div>

                {hasAgencyFilters && (
                  <div className="mt-3 flex justify-end">
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={resetAgencyFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* SuperAgent promo */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <div className="rounded-2xl bg-accent border border-primary/10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-secondary font-semibold text-xs tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" /> Programme SuperAgent
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Trouvez votre SuperAgent
            </h2>
            <p className="text-sm text-foreground/80 mt-2 max-w-xl">
              Les agents les plus réactifs, vérifiés et notés par leurs clients
              sur Okapi Real Estate. Une réponse en moyenne en moins de 5
              minutes.
            </p>
            <Button variant="outlineGold" className="mt-4">
              En savoir plus
            </Button>
          </div>
          <SuperAgentIllustration />
        </div>
      </section>

      {/* Agent / Agency grid */}
      <section className="max-w-6xl mx-auto px-6 mt-10 pb-20">
        {tab === "agents" ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {agentMeta.total}
                </span>{" "}
                agent{agentMeta.total > 1 ? "s" : ""} trouvé
                {agentMeta.total > 1 ? "s" : ""}
              </p>
              <button className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary">
                Trier par : <span className="font-medium">Pertinence</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {agentLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                Chargement des agents...
              </div>
            ) : agents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                Aucun agent ne correspond à votre recherche.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {agents.map((a) => (
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
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {agencyMeta.total}
                </span>{" "}
                agence{agencyMeta.total > 1 ? "s" : ""} partenaire
                {agencyMeta.total > 1 ? "s" : ""}
              </p>
            </div>

            {agencyLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                Chargement des agences...
              </div>
            ) : agencies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                Aucune agence ne correspond à votre recherche.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          </>
        )}
      </section>
    </div>
  );
}
