"use client";

import { useEffect, useState, useCallback } from "react";
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
  SendHorizontal,
  EyeOff,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { useT } from "@/i18n/useT";

type ListingStatus = "DRAFT" | "PENDING" | "LIVE" | "HIDDEN" | "REJECTED" | "EXPIRED";

type Property = {
  id: string;
  title: string;
  subtitle?: string;
  status: ListingStatus;
  listingType?: string;
  category?: string;
  price?: number;
  currency?: string;
  suburb?: string;
  neighborhood?: string;
  city?: string;
  viewCount?: number;
  boostedUntil?: string | null;
  rejectionReason?: string;
  createdAt?: string;
};

type Tab = "ALL" | "LIVE" | "PENDING" | "DRAFT" | "HIDDEN";

function formatPrice(price?: number, currency?: string) {
  if (!price) return null;
  return (
    new Intl.NumberFormat("fr-CD").format(price) + " " + (currency ?? "USD")
  );
}

export default function MesAnnoncesPage() {
  const router = useRouter();
  const { token, agent } = useAgentSessionStore();
  const tAll = useT();
  const t = tAll.espaceAgent;

  const STATUS: Record<string, { label: string; color: string }> = {
    LIVE: {
      label: t.statusLive,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    DRAFT: {
      label: t.statusDraft,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    PENDING: {
      label: t.statusPending,
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
    HIDDEN: {
      label: t.statusHidden,
      color: "text-muted-foreground bg-muted border-border",
    },
    REJECTED: {
      label: t.statusRejected,
      color: "text-destructive bg-destructive/10 border-destructive/30",
    },
    EXPIRED: {
      label: t.statusExpired,
      color: "text-muted-foreground bg-muted border-border",
    },
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "ALL", label: t.tabAll },
    { key: "LIVE", label: t.tabLive },
    { key: "PENDING", label: t.tabPending },
    { key: "DRAFT", label: t.tabDraft },
    { key: "HIDDEN", label: t.tabHidden },
  ];

  const hydrated = useMounted();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");

  const fetchListings = useCallback(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/api/proxy/properties/mine/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        const data = r.data;
        setProperties(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !agent) {
      router.replace("/connexion-agent");
      return;
    }
    fetchListings();
  }, [hydrated, token, agent, router, fetchListings]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm(t.deleteConfirm)) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/proxy/properties/mine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((p) => p.filter((x) => x.id !== id));
    } catch {
      alert(t.deleteError);
    } finally {
      setDeleting(null);
    }
  }

  async function handlePublish(id: string) {
    if (!token) return;
    setActioning(id);
    try {
      await axios.post(
        `/api/proxy/properties/mine/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
    } catch {
      alert(t.errPublish);
    } finally {
      setActioning(null);
    }
  }

  async function handleUnpublish(id: string) {
    if (!token) return;
    setActioning(id);
    try {
      await axios.post(
        `/api/proxy/properties/mine/${id}/unpublish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
    } catch {
      alert(t.errPublish);
    } finally {
      setActioning(null);
    }
  }

  const filtered =
    activeTab === "ALL"
      ? properties
      : properties.filter((p) => p.status === activeTab);

  const pendingCount = properties.filter((p) => p.status === "PENDING").length;

  if (!hydrated || !token) return null;

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/espace-agent"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="w-4 h-4" /> {t.back}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm font-medium">{t.annoncesTitle}</span>
          </div>
          <Button size="sm" asChild>
            <Link href="/espace-agent/annonces/nouvelle">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t.newListing}
            </Link>
          </Button>
        </div>

        {/* Pending info banner */}
        {pendingCount > 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm text-blue-800">
            <Clock className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              <strong>{pendingCount}</strong> annonce{pendingCount > 1 ? "s" : ""} en cours de vérification.
            </span>
          </div>
        )}

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
              <Link href="/espace-agent/annonces/nouvelle">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                {t.publishFirst}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            {/* Status tabs */}
            <div className="px-4 pt-4 border-b border-border">
              <div className="flex items-center gap-1 overflow-x-auto">
                {TABS.map(({ key, label }) => {
                  const count =
                    key === "ALL"
                      ? properties.length
                      : properties.filter((p) => p.status === key).length;
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium border-b-2 transition -mb-px ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                      {count > 0 && (
                        <span
                          className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                Aucune annonce dans cette catégorie.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((p) => {
                  const st = STATUS[p.status] ?? {
                    label: p.status,
                    color: "text-muted-foreground bg-muted border-border",
                  };
                  const location = [p.suburb ?? p.neighborhood, p.city]
                    .filter(Boolean)
                    .join(" · ");
                  const price = formatPrice(p.price, p.currency);
                  const isBoosted =
                    p.boostedUntil && new Date(p.boostedUntil) > new Date();
                  const isActioning = actioning === p.id;
                  const isDeleting = deleting === p.id;

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
                            {price && (
                              <span className="font-medium text-foreground">
                                {price}
                              </span>
                            )}
                            {p.viewCount !== undefined && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {p.viewCount}{" "}
                                {t.views}
                              </span>
                            )}
                          </div>

                          {/* Rejected reason */}
                          {p.status === "REJECTED" && p.rejectionReason && (
                            <div className="mt-2 flex items-start gap-1.5 text-xs text-destructive bg-destructive/5 rounded-lg px-2.5 py-1.5">
                              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                              <span>{p.rejectionReason}</span>
                            </div>
                          )}

                          {/* Pending note */}
                          {p.status === "PENDING" && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{t.pendingNote}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Context-aware action buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {/* Edit — all statuses except PENDING */}
                        {p.status !== "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 px-2.5"
                            asChild
                          >
                            <Link
                              href={`/espace-agent/annonces/${p.id}/modifier`}
                            >
                              <Pencil className="w-3 h-3 mr-1" /> {t.editBtn}
                            </Link>
                          </Button>
                        )}

                        {/* LIVE: view publicly + unpublish */}
                        {p.status === "LIVE" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5"
                              asChild
                            >
                              <Link href={`/annonces/${p.id}`} target="_blank">
                                <Eye className="w-3 h-3 mr-1" /> Voir
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5 text-muted-foreground hover:text-foreground"
                              onClick={() => handleUnpublish(p.id)}
                              disabled={isActioning}
                            >
                              {isActioning ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />{" "}
                                  {t.unpublishBtn}
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {/* DRAFT or REJECTED: submit for review + delete */}
                        {(p.status === "DRAFT" || p.status === "REJECTED") && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handlePublish(p.id)}
                              disabled={isActioning}
                            >
                              {isActioning ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <SendHorizontal className="w-3 h-3 mr-1" />
                                  {p.status === "REJECTED"
                                    ? t.republishBtn
                                    : t.submitBtn}
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(p.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3 mr-1" />{" "}
                                  {t.deleteBtn}
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {/* HIDDEN: resubmit + delete */}
                        {p.status === "HIDDEN" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handlePublish(p.id)}
                              disabled={isActioning}
                            >
                              {isActioning ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <SendHorizontal className="w-3 h-3 mr-1" />{" "}
                                  {t.republishBtn}
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(p.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3 mr-1" />{" "}
                                  {t.deleteBtn}
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {/* EXPIRED: resubmit */}
                        {p.status === "EXPIRED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handlePublish(p.id)}
                            disabled={isActioning}
                          >
                            {isActioning ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <SendHorizontal className="w-3 h-3 mr-1" />{" "}
                                {t.republishBtn}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
