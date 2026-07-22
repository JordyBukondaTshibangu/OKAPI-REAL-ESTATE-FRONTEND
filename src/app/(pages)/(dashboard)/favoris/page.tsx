"use client";

import { useEffect, useState, useMemo } from "react";
import { Heart, MapPin, Trash2, Bell, BellRing } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import PropertyImage from "@/shared/components/ui/PropertyImage";
import UserSidebarLayout from "@/features/user/components/UserSidebarLayout";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getFavourites,
  removeFavourite,
  getAlerts,
  createAlertFromFavourite,
  type Favourite,
  type Alert,
} from "@/services/auth";
import { getR2ImageUrl } from "@/shared/utils/utils";
import { useT } from "@/i18n/useT";

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  LIVE:     { label: "En ligne",    className: "bg-green-500/90 text-white" },
  PENDING:  { label: "En attente",  className: "bg-amber-500/90 text-white" },
  EXPIRED:  { label: "Expiré",      className: "bg-red-500/90 text-white" },
  HIDDEN:   { label: "Masqué",      className: "bg-gray-500/90 text-white" },
  DRAFT:    { label: "Brouillon",   className: "bg-gray-500/90 text-white" },
  REJECTED: { label: "Refusé",      className: "bg-red-500/90 text-white" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(
  price: number,
  listingType: string | null,
  period?: string | null
) {
  const n = price.toLocaleString("en-US");
  if (listingType === "rent") {
    return period === "nightly" ? `$${n} / nuit` : `$${n} / mois`;
  }
  return `$${n}`;
}

function hasMatchingAlert(fav: Favourite, alerts: Alert[]): boolean {
  const prop = fav.property;
  const propListingType =
    prop.listingType === "sale" ? "for-sale"
    : prop.listingType === "rent" ? "for-rent"
    : null;

  return alerts.some((alert) => {
    const sameSuburb =
      !alert.suburb ||
      alert.suburb.toLowerCase() === (prop.suburb ?? "").toLowerCase();
    const sameCategory = !alert.category || alert.category === prop.category;
    const sameType =
      !alert.listingType || alert.listingType === propListingType;
    return sameSuburb && sameCategory && sameType;
  });
}

type SortKey = "recent" | "price_asc" | "price_desc";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FavouritesPage() {
  const { token } = useAuthStore();
  const t = useT();

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [creatingAlertFor, setCreatingAlertFor] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!token) return;
    Promise.all([getFavourites(token), getAlerts(token)])
      .then(([favs, alts]) => {
        setFavourites(favs);
        setAlerts(alts);
      })
      .catch(() => setError(t.dashboard.errLoadFavorites))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleRemove(propertyId: string) {
    if (!token) return;
    try {
      await removeFavourite(token, propertyId);
      setFavourites((prev) => prev.filter((f) => f.property.id !== propertyId));
    } catch {
      setError(t.dashboard.errRemoveFavorite);
    }
  }

  async function handleCreateAlert(propertyId: string) {
    if (!token) return;
    setCreatingAlertFor((prev) => new Set(prev).add(propertyId));
    try {
      const { alert } = await createAlertFromFavourite(token, propertyId);
      setAlerts((prev) => [...prev.filter((a) => a.id !== alert.id), alert]);
    } catch {
      // silently ignore — user can try from /alertes page
    } finally {
      setCreatingAlertFor((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  }

  const sorted = useMemo(
    () =>
      [...favourites].sort((a, b) => {
        if (sort === "price_asc") return a.property.price - b.property.price;
        if (sort === "price_desc") return b.property.price - a.property.price;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
    [favourites, sort]
  );

  return (
    <UserSidebarLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">{t.dashboard.favoritesTitle}</h1>
            {favourites.length > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {favourites.length}{" "}
                {favourites.length > 1
                  ? t.dashboard.propertiesSaved
                  : t.dashboard.propertySaved}
              </p>
            )}
          </div>
          {favourites.length > 1 && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="recent">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="bg-card rounded-2xl p-12 text-center text-muted-foreground text-sm">
            {t.dashboard.loading}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-card rounded-2xl p-8 text-center text-destructive text-sm">
            {error}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && favourites.length === 0 && (
          <div className="bg-card rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold mb-2">
              {t.dashboard.noFavoritesTitle}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t.dashboard.noFavoritesBody}
            </p>
            <Button asChild>
              <Link href="/acheter">{t.dashboard.exploreProperties}</Link>
            </Button>
          </div>
        )}

        {/* ── Cards grid ── */}
        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sorted.map((fav) => {
              const p = fav.property;
              const cover = getR2ImageUrl(p.gallery[0]);
              const statusCfg = STATUS_CONFIG[p.status ?? ""] ?? null;
              const activeAlert = hasMatchingAlert(fav, alerts);
              const isCreating = creatingAlertFor.has(p.id);
              const location =
                [p.suburb, p.city].filter(Boolean).join(", ") || p.location;
              const price = formatPrice(p.price, p.listingType, p.period);

              return (
                <div
                  key={fav.id}
                  className="bg-card rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-muted">
                    <PropertyImage
                      src={cover}
                      alt={p.title}
                      category={p.type}
                      sizes="450px"
                    />
                    {statusCfg && (
                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
                    )}
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-card/90 flex items-center justify-center text-destructive hover:bg-white dark:hover:bg-card transition-colors shadow-sm"
                      title={t.dashboard.removeFromFavorites}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <Link
                      href={`/property/${p.id}`}
                      className="text-sm font-semibold hover:text-primary line-clamp-1 transition-colors"
                    >
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                    <p className="text-primary font-semibold text-sm mt-2">
                      {price}
                    </p>

                    {/* Alert row */}
                    <div className="mt-3 pt-3 border-t border-border">
                      {activeAlert ? (
                        <Link
                          href="/alertes"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
                        >
                          <BellRing className="w-3.5 h-3.5 shrink-0" />
                          Alerte active
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCreateAlert(p.id)}
                          disabled={isCreating}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                        >
                          <Bell
                            className={`w-3.5 h-3.5 shrink-0 ${isCreating ? "animate-pulse" : ""}`}
                          />
                          {isCreating
                            ? "Création…"
                            : p.suburb
                            ? `Créer une alerte pour ${p.suburb}`
                            : "Créer une alerte"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserSidebarLayout>
  );
}
