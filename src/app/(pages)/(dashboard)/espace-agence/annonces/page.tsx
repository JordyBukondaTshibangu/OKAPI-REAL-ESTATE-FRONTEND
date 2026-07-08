"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Eye,
  Pencil,
  PlusCircle,
  Trash2,
  Loader2,
  Home,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";

type Property = {
  id: string;
  title: string;
  status: string;
  listingType?: string;
  price?: number;
  currency?: string;
  suburb?: string;
  neighborhood?: string;
  city?: string;
  viewCount?: number;
  boostedUntil?: string | null;
  agent?: { id: string; name: string };
};

export default function AgenceAnnoncesPage() {
  const router = useRouter();
  const { token, agent: sessionAgent } = useAgentSessionStore();
  const tAll = useT();
  const t = tAll.espaceAgence;
  const tCommon = tAll.common;

  const STATUS: Record<string, { label: string; color: string }> = {
    open: {
      label: t.statusActive,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    published: {
      label: t.statusActive,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    active: {
      label: t.statusActive,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    draft: {
      label: t.statusDraft,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    pending: {
      label: t.statusPending,
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
    closed: {
      label: t.statusClosed,
      color: "text-muted-foreground bg-muted border-border",
    },
  };
  const [hydrated, setHydrated] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>("all"); // agentId or "all"
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !sessionAgent?.agencyId) {
      router.replace("/connexion-agent");
      return;
    }

    axios
      .get(
        `/api/listings/properties?agencyId=${sessionAgent.agencyId}&limit=100`,
      )
      .then((r) => {
        const data = r.data;
        setProperties(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [hydrated, token, sessionAgent, router]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm(t.deleteConfirm)) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/proxy/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((p) => p.filter((x) => x.id !== id));
    } catch {
      alert(t.deleteError);
    } finally {
      setDeleting(null);
    }
  }

  // Collect unique agents for filter tabs
  const agents = Array.from(
    new Map(
      properties.filter((p) => p.agent).map((p) => [p.agent!.id, p.agent!]),
    ).values(),
  );

  const displayed =
    filter === "all"
      ? properties
      : properties.filter((p) => p.agent?.id === filter);

  if (!hydrated || !token) return null;

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/espace-agence"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="w-4 h-4" /> {t.back}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm font-medium">{t.annoncesTitle}</span>
          </div>
          <Button size="sm" asChild>
            <Link href="/espace-agence/annonces/nouvelle">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t.newListing}
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="bg-card rounded-2xl shadow-sm flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium mb-1">{t.noAnnonces}</p>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
              {t.noAnnoncesBody}
            </p>
            <Button size="sm" asChild>
              <Link href="/espace-agence/annonces/nouvelle">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                {t.publishFirst}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-border flex items-center justify-between">
              <h1 className="font-semibold text-sm">
                {t.annoncesTitle} ({properties.length})
              </h1>
            </div>

            {/* Agent filter tabs */}
            {agents.length > 0 && (
              <div className="px-6 py-3 border-b border-border flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}
                >
                  {t.allAgents}
                </button>
                {agents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setFilter(a.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === a.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}

            <div className="divide-y divide-border">
              {displayed.map((p) => {
                const st = STATUS[p.status] ?? {
                  label: p.status,
                  color: "text-muted-foreground bg-muted border-border",
                };
                const location = [p.suburb ?? p.neighborhood, p.city]
                  .filter(Boolean)
                  .join(" · ");
                const isBoosted =
                  p.boostedUntil && new Date(p.boostedUntil) > new Date();

                return (
                  <div key={p.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-medium truncate">
                            {p.title}
                          </p>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${st.color}`}
                          >
                            {st.label}
                          </span>
                          {isBoosted && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium text-amber-700 bg-amber-50 border-amber-200 flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5" /> {t.statusBoosted}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          {location && <span>{location}</span>}
                          {p.agent && (
                            <span>
                              {t.by.toLowerCase()} {p.agent.name}
                            </span>
                          )}
                          {p.viewCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {p.viewCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        asChild
                      >
                        <Link href={`/espace-agence/annonces/${p.id}/modifier`}>
                          <Pencil className="w-3 h-3 mr-1" /> {t.editBtn}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        asChild
                      >
                        <Link href={`/annonces/${p.id}`} target="_blank">
                          <Eye className="w-3 h-3 mr-1" />{" "}
                          {t.viewAll.split(" ")[0]}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 mr-1" /> {tCommon.delete}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
