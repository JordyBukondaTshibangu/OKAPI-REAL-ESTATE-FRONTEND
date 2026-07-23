"use client";

import { useT } from "@/i18n/useT";
import type { Property } from "@/features/properties/types/property";
import { categoryLabel, formatListedAgo, formatPrice } from "@/lib/properties";
import { getR2ImageUrl } from "@/shared/utils/utils";
import { addFavourite, removeFavourite } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import { Button } from "@/shared/components/ui/button";
import PropertyImage from "@/shared/components/ui/PropertyImage";
import AreaIcon from "@/shared/components/ui/icons/AreaIcon";
import BathIcon from "@/shared/components/ui/icons/BathIcon";
import BedIcon from "@/shared/components/ui/icons/BedIcon";
import CategoryIcon from "@/shared/components/ui/icons/CategoryIcon";
import HeartIcon from "@/shared/components/ui/icons/HeartIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FreshnessIndicator from "./badges/FreshnessIndicator";
import NewBadge from "./badges/NewBadge";
import PremiumBadge from "./badges/PremiumBadge";
import VerifiedBadge from "./badges/VerifiedBadge";
import {
  CardPerformanceStrip,
  HotBadge,
  isHotProperty,
} from "./PerformancePulse";

export default function PropertyCard({ property, priority }: { property: Property; priority?: boolean }) {
  const t = useT();
  // const { iconType } = property;
  const { token, isAuthenticated } = useAuthStore();
  const { isAuthenticated: isAgentAuth } = useAgentSessionStore();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleToggleFavourite(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      router.push("/connexion");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await removeFavourite(token, property.id);
        setSaved(false);
      } else {
        await addFavourite(token, property.id);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  const detailHref = `/property/${property.id}`;
  const cover = getR2ImageUrl(property.gallery[0]);

  return (
    <article className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Image */}
        <div className="relative aspect-4/3 md:aspect-auto overflow-hidden bg-muted">
          <PropertyImage
            src={cover}
            alt={property.title}
            category={property.category}
            gradient={property.imageGradient}
            sizes="(max-width: 768px) 100vw, 280px"
            priority={priority}
          />

          {/* Click-through overlay */}
          <Link
            href={detailHref}
            aria-label={`Voir ${property.title}`}
            className="absolute inset-0 z-10"
          />

          {/* Verified + New + Hot + Boosted badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
            {property.isBoosted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
                ✨ En vedette
              </span>
            )}
            {property.verified && <VerifiedBadge />}
            {property.isNew && <NewBadge />}
            {isHotProperty(property.performance) && (
              <HotBadge label={t.cards.hotLabel} />
            )}
          </div>

          {/* Heart — hidden for agents */}
          {!isAgentAuth && (
            <button
              onClick={handleToggleFavourite}
              aria-label={saved ? t.cards.removeFavourite : t.cards.addFavourite}
              disabled={saving}
              className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white dark:bg-card/90 hover:bg-white dark:bg-card flex items-center justify-center transition-colors disabled:opacity-60 ${
                saved
                  ? "text-secondary"
                  : "text-foreground/70 hover:text-secondary"
              }`}
            >
              <HeartIcon className="w-4 h-4" filled={saved} />
            </button>
          )}

          {/* Photo count */}
          {property.gallery.length > 1 && (
            <div className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 bg-black/55 text-white text-xs px-2 py-1 rounded-md">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M21 19V7a2 2 0 0 0-2-2h-3.17l-1.84-2H10v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-9-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
              </svg>
              {property.gallery.length}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">
                {formatListedAgo(property.listedDaysAgo)}
              </p>
              <FreshnessIndicator updatedAt={property.updatedAt} />
            </div>
            <div className="flex items-center gap-3">
              <CardPerformanceStrip perf={property.performance} />
              {property.premium && <PremiumBadge />}
            </div>
          </div>

          <Link href={detailHref} className="block group">
            <p className="text-xl md:text-2xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {formatPrice(property.price, property.currency, property.period)}
            </p>
            <h3 className="text-sm md:text-base text-foreground/85 mb-4 line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-3 pb-3 border-b border-border">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <BedIcon className="w-4 h-4" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <BathIcon className="w-4 h-4" /> {property.bathrooms}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <AreaIcon className="w-4 h-4" /> {property.areaSqm} m²
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CategoryIcon className="w-4 h-4" />{" "}
              {categoryLabel(property.category)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-5">
            {property.neighborhood}, {property.suburb}, {property.city}
          </p>

          {/* Agent + actions */}
          <div className="mt-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-3">
              <AgentAvatar
                name={property.agent?.name ?? "—"}
                photo={property.agent?.photo}
                size={36}
              />
              <div className="leading-tight">
                <p className="text-[10px] font-semibold text-secondary tracking-widest">
                  {property.agent?.title}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {property.agent?.name ?? "—"}
                </p>
              </div>
            </div>
            <Button variant="default" size="sm" className="gap-1.5" asChild>
              <Link href={detailHref}>
                {t.cards.viewProperty}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 ml-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
