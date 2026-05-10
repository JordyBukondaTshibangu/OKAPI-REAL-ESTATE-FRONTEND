"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import AgencyCard from "@/features/agency/components/AgencyCard";
import { useAgenciesStore } from "@/store/useAgenciesStore";
import { useAgencies } from "@/hooks/useAgencies";
import { useDebounce } from "@/hooks/useDebounce";

const LIMIT = 12;

export default function AgencesPage() {
  const name = useAgenciesStore((s) => s.name);
  const language = useAgenciesStore((s) => s.language);
  const page = useAgenciesStore((s) => s.page);
  const setName = useAgenciesStore((s) => s.setName);
  const setLanguage = useAgenciesStore((s) => s.setLanguage);
  const setPage = useAgenciesStore((s) => s.setPage);
  const resetFilters = useAgenciesStore((s) => s.resetFilters);

  const debouncedName = useDebounce(name, 400);

  const { data, isLoading } = useAgencies({
    page,
    limit: LIMIT,
    name: debouncedName || undefined,
    language: language || undefined,
  });

  const agencies = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 0 };

  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    agencies.forEach((a) => a.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [agencies]);

  return (
    <div className="bg-background-alt">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 35%, rgba(212,175,55,0.5), transparent 35%), radial-gradient(circle at 75% 65%, rgba(30,99,181,0.5), transparent 40%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
            Agences partenaires
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Trouvez votre agence immobilière
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base">
            {meta.total} agences vérifiées à travers Kinshasa et la RDC, prêtes à vous
            accompagner sur l&apos;achat, la vente ou la location de votre bien.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="gold" asChild>
              <Link href="/agents">Trouver un agent</Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
              asChild
            >
              <Link href="#agences">Voir les agences</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { label: "Agences partenaires", value: meta.total },
            { label: "Agents actifs", value: agencies.reduce((s, a) => s + a.agentCount, 0) },
            {
              label: "Transactions réalisées",
              value: `${agencies.reduce((s, a) => s + a.closedDeals, 0).toLocaleString("fr-FR")}+`,
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une agence..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/40 text-sm"
            />
          </label>
          <AgencyLanguageSelect
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
          {(name || language) && (
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:underline self-center"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* Agency grid */}
      <section id="agences" className="max-w-6xl mx-auto px-6 py-10 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-foreground">Toutes les agences</h2>
          <p className="text-sm text-muted-foreground">{meta.total} agences</p>
        </div>

        {isLoading ? (
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
            {meta.totalPages > 1 && (
              <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Votre agence n&apos;est pas encore listée ?
        </h2>
        <p className="text-primary-foreground/80 text-sm mb-8 max-w-lg mx-auto">
          Rejoignez le réseau Okapi Real Estate et accédez à des milliers d&apos;acheteurs,
          vendeurs et locataires actifs chaque jour.
        </p>
        <Button variant="gold" asChild>
          <Link href="/contact">Inscrire mon agence</Link>
        </Button>
      </section>
    </div>
  );
}

function AgencyLanguageSelect({
  value,
  options,
  onChange,
}: {
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full sm:w-48">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="w-full h-11 px-3 rounded-lg border border-input bg-background flex items-center justify-between text-sm text-foreground/85 hover:border-primary/40 transition-colors"
      >
        <span className="truncate">{value ?? "Langue"}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-lg border border-border bg-white shadow-lg z-30 overflow-hidden">
          <button
            onClick={() => onChange(null)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
              !value ? "bg-accent text-primary font-semibold" : ""
            }`}
          >
            Toutes
          </button>
          {options.map((l) => (
            <button
              key={l}
              onClick={() => onChange(l)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                value === l ? "bg-accent text-primary font-semibold" : ""
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && (
              <span className="px-2 text-muted-foreground">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-white border-primary"
                  : "border-input hover:bg-accent"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
