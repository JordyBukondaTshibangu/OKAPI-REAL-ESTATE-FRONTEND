"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  MessageCircle,
  Share2,
  Home,
  TrendingUp,
  ArrowLeft,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";
import { useMounted } from "@/shared/hooks/useMounted";
import { useT } from "@/i18n/useT";

// ─── Types ────────────────────────────────────────────────────────────────────

type Property = {
  id: string;
  title: string;
  status: string;
  suburb?: string;
  city?: string;
  category?: string;
  listingType?: string;
  price?: number;
  currency?: string;
  viewCount?: number;
  whatsappClicks?: number;
  shareCount?: number;
};

type AgentProfile = {
  name: string;
  plan?: string;
  properties?: Property[];
};

type SortKey = "viewCount" | "whatsappClicks" | "shareCount";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function categoryLabel(cat?: string) {
  const map: Record<string, string> = {
    apartment: "Appartement",
    villa: "Villa",
    townhouse: "Maison de ville",
    land: "Terrain",
    penthouse: "Penthouse",
    office: "Bureau",
    warehouse: "Entrepôt",
    retail: "Commerce",
  };
  return map[cat ?? ""] ?? cat ?? "—";
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    PUBLISHED: { label: "Live", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    PENDING: { label: "En attente", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    DRAFT: { label: "Brouillon", cls: "bg-muted text-muted-foreground" },
    REJECTED: { label: "Rejeté", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    ARCHIVED: { label: "Archivé", cls: "bg-muted text-muted-foreground" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon,
  value,
  label,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col items-center text-center gap-1">
      <div className={`mb-1 ${accent ?? "text-primary"}`}>{icon}</div>
      <p className="text-3xl font-bold text-foreground">{fmt(value)}</p>
      <p className="text-sm font-medium text-foreground/80">{label}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Sort header ─────────────────────────────────────────────────────────────

function SortTh({
  col,
  label,
  active,
  dir,
  onSort,
}: {
  col: SortKey;
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onSort: (col: SortKey) => void;
}) {
  return (
    <th
      className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1 justify-end">
        {label}
        {active ? (
          dir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

// ─── Stat bar ─────────────────────────────────────────────────────────────────

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatistiquesPage() {
  const router = useRouter();
  const { token, logout } = useAgentSessionStore();
  const hydrated = useMounted();
  const t = useT().espaceAgent;
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/connexion-agent");
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!token) return;
    getMyAgentProfile(token)
      .then((data) => setProfile(data as AgentProfile))
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 401) {
          logout();
          router.replace("/connexion-agent");
        }
      })
      .finally(() => setLoading(false));
  }, [token, logout, router]);

  if (!hydrated || !token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const properties = profile.properties ?? [];

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalViews = properties.reduce((s, p) => s + (p.viewCount ?? 0), 0);
  const totalWhatsapp = properties.reduce((s, p) => s + (p.whatsappClicks ?? 0), 0);
  const totalShares = properties.reduce((s, p) => s + (p.shareCount ?? 0), 0);
  const activeListings = properties.filter((p) => p.status === "PUBLISHED").length;

  // ── Top performer ────────────────────────────────────────────────────────────
  const topPerformer = [...properties].sort(
    (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
  )[0];

  // ── Sorted listing table ──────────────────────────────────────────────────────
  const maxVal = Math.max(...properties.map((p) => p[sortKey] ?? 0), 1);
  const sorted = [...properties].sort((a, b) => {
    const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
    return sortDir === "desc" ? -diff : diff;
  });

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(col);
      setSortDir("desc");
    }
  }

  const conversionRate =
    totalViews > 0 ? ((totalWhatsapp / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-muted pb-16">
      {/* ── Header ── */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/espace-agent"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-semibold text-sm text-foreground">{t.statsPageTitle}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard
            icon={<Eye className="w-5 h-5" />}
            value={totalViews}
            label={t.statsTotalViews}
            sub={t.statsAllListings}
          />
          <KpiCard
            icon={<MessageCircle className="w-5 h-5" />}
            value={totalWhatsapp}
            label={t.statsTotalWhatsapp}
            sub={t.statsAllListings}
            accent="text-green-600"
          />
          <KpiCard
            icon={<Share2 className="w-5 h-5" />}
            value={totalShares}
            label={t.statsTotalShares}
            sub={t.statsAllListings}
            accent="text-blue-500"
          />
          <KpiCard
            icon={<Home className="w-5 h-5" />}
            value={activeListings}
            label={t.statsActiveListings}
            sub={t.statsAllListingsSub.replace("{total}", String(properties.length))}
          />
        </div>

        {/* ── Conversion + top performer row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Conversion rate */}
          <div className="bg-card rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t.statsConversionTitle}</span>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">{conversionRate}%</p>
            <p className="text-xs text-muted-foreground">{t.statsConversionDesc}</p>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{t.statsViews}</span>
                <span className="font-medium text-foreground">{fmt(totalViews)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.statsWhatsapp}</span>
                <span className="font-medium text-foreground">{fmt(totalWhatsapp)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.statsShares}</span>
                <span className="font-medium text-foreground">{fmt(totalShares)}</span>
              </div>
            </div>
          </div>

          {/* Top performer */}
          {topPerformer && (topPerformer.viewCount ?? 0) > 0 ? (
            <div className="bg-card rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-foreground">{t.statsTopTitle}</span>
              </div>
              <Link
                href={`/espace-agent/annonces/${topPerformer.id}/modifier`}
                className="block group"
              >
                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1 mb-1">
                  {topPerformer.title}
                </p>
              </Link>
              <div className="flex flex-wrap gap-2 mb-3">
                {statusBadge(topPerformer.status)}
                {topPerformer.category && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Tag className="w-3 h-3" /> {categoryLabel(topPerformer.category)}
                  </span>
                )}
                {topPerformer.city && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {topPerformer.suburb ?? topPerformer.city}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: <Eye className="w-3.5 h-3.5 mx-auto mb-0.5 text-primary" />, val: topPerformer.viewCount ?? 0, label: t.statsViews },
                  { icon: <MessageCircle className="w-3.5 h-3.5 mx-auto mb-0.5 text-green-600" />, val: topPerformer.whatsappClicks ?? 0, label: t.statsWhatsapp },
                  { icon: <Share2 className="w-3.5 h-3.5 mx-auto mb-0.5 text-blue-500" />, val: topPerformer.shareCount ?? 0, label: t.statsShares },
                ].map(({ icon, val, label }) => (
                  <div key={label} className="bg-muted rounded-lg p-2">
                    {icon}
                    <p className="text-base font-bold text-foreground">{fmt(val)}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col items-center justify-center text-center gap-2">
              <Eye className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">{t.statsNoData}</p>
              <p className="text-xs text-muted-foreground">{t.statsNoDataBody}</p>
              <Link
                href="/espace-agent/annonces/nouvelle"
                className="mt-1 text-xs font-semibold text-primary hover:underline"
              >
                {t.statsPublishCta}
              </Link>
            </div>
          )}
        </div>

        {/* ── Per-listing table ── */}
        {properties.length > 0 && (
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{t.statsDetailTitle}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t.statsDetailSub}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                      Annonce
                    </th>
                    <SortTh col="viewCount" label={t.statsViews} active={sortKey === "viewCount"} dir={sortDir} onSort={handleSort} />
                    <SortTh col="whatsappClicks" label={t.statsWhatsapp} active={sortKey === "whatsappClicks"} dir={sortDir} onSort={handleSort} />
                    <SortTh col="shareCount" label={t.statsShares} active={sortKey === "shareCount"} dir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => {
                    const views = p.viewCount ?? 0;
                    const wa = p.whatsappClicks ?? 0;
                    const shares = p.shareCount ?? 0;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/espace-agent/annonces/${p.id}/modifier`}
                            className="hover:text-primary transition-colors"
                          >
                            <p className="font-medium text-foreground text-xs line-clamp-1 mb-0.5">
                              {p.title}
                            </p>
                          </Link>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {statusBadge(p.status)}
                            {p.city && (
                              <span className="text-[10px] text-muted-foreground">
                                {p.suburb ? `${p.suburb}, ` : ""}{p.city}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <p className="font-semibold text-foreground">{fmt(views)}</p>
                          {sortKey === "viewCount" && (
                            <StatBar value={views} max={maxVal} color="bg-primary" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <p className="font-semibold text-foreground">{fmt(wa)}</p>
                          {sortKey === "whatsappClicks" && (
                            <StatBar value={wa} max={maxVal} color="bg-green-500" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <p className="font-semibold text-foreground">{fmt(shares)}</p>
                          {sortKey === "shareCount" && (
                            <StatBar value={shares} max={maxVal} color="bg-blue-500" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
