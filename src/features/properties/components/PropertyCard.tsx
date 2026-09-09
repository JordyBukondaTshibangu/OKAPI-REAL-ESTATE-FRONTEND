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
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FreshnessIndicator from "./badges/FreshnessIndicator";
import NewBadge from "./badges/NewBadge";
import PremiumBadge from "./badges/PremiumBadge";
import VerifiedBadge from "./badges/VerifiedBadge";
import {
  CardPerformanceStrip,
  HotBadge,
  isHotProperty,
} from "./PerformancePulse";

/* ── Carousel ──────────────────────────────────────────────────────────────── */
function CardCarousel({
  images,
  alt,
  category,
  gradient,
  sizes,
  priority,
  children,
}: {
  images: string[];
  alt: string;
  category: Property["category"];
  gradient?: string;
  sizes: string;
  priority?: boolean;
  /** Overlays: badges, heart, etc. */
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % total);
  }, [total]);

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Images — slide via transform */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / total}%` }}>
            <PropertyImage
              src={src}
              alt={`${alt} ${i + 1}`}
              category={category}
              gradient={gradient}
              sizes={sizes}
              priority={priority && i === 0}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next arrows — visible on hover when multiple images */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot indicators (≤6 photos) or counter (>6) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
            {total <= 6 ? (
              images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
                  aria-label={`Photo ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === index
                      ? "bg-white w-4 h-1.5"
                      : "bg-white/50 w-1.5 h-1.5 hover:bg-white/80"
                  }`}
                />
              ))
            ) : (
              <span className="bg-black/55 text-white text-[10px] px-2 py-0.5 rounded-md">
                {index + 1} / {total}
              </span>
            )}
          </div>
        </>
      )}

      {/* Slot for badges, heart, etc. */}
      {children}
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  variant?: "list" | "grid";
}

export default function PropertyCard({ property, priority, variant = "list" }: PropertyCardProps) {
  const t = useT();
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

  /* ── GRID VARIANT ─────────────────────────────────────────────── */
  if (variant === "grid") {
    return (
      <article className="isolate bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
        {/* Photo — dominant, with carousel */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted shrink-0">
          <CardCarousel
            images={property.gallery.map(getR2ImageUrl).filter(Boolean) as string[]}
            alt={property.title}
            category={property.category}
            gradient={property.imageGradient}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          >
            <Link href={detailHref} aria-label={`Voir ${property.title}`} className="absolute inset-0 z-10" />

            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
              {property.verified && <VerifiedBadge />}
              {property.isNew && <NewBadge />}
              {isHotProperty(property.performance) && <HotBadge label={t.cards.hotLabel} />}
            </div>

            {/* Heart */}
            {!isAgentAuth && (
              <button
                onClick={handleToggleFavourite}
                aria-label={saved ? t.cards.removeFavourite : t.cards.addFavourite}
                disabled={saving}
                className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-60 ${
                  saved
                    ? "bg-secondary text-white scale-105"
                    : "bg-white/95 dark:bg-card/95 text-foreground/60 hover:text-secondary hover:scale-110"
                }`}
              >
                <HeartIcon className="w-4.5 h-4.5" filled={saved} />
              </button>
            )}

            {/* Performance strip */}
            <div className="absolute bottom-10 left-3 z-20">
              <CardPerformanceStrip perf={property.performance} variant="overlay" />
            </div>
          </CardCarousel>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-1">
            <Link href={detailHref} className="group">
              <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {formatPrice(property.price, property.currency, property.period)}
              </p>
              <h3 className="text-sm text-foreground/80 mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-1 mb-3">
            {property.suburb}
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <BedIcon className="w-3.5 h-3.5" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <BathIcon className="w-3.5 h-3.5" /> {property.bathrooms}
              </span>
            )}
            {property.areaSqm > 0 && (
              <span className="inline-flex items-center gap-1">
                <AreaIcon className="w-3.5 h-3.5" /> {property.areaSqm} m²
              </span>
            )}
            <span className="inline-flex items-center gap-1 ml-auto">
              <CategoryIcon className="w-3.5 h-3.5" /> {categoryLabel(property.category)}
            </span>
          </div>

          {/* Agent + "Voir →" */}
          <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border">
            <AgentAvatar name={property.agent?.name ?? "—"} photo={property.agent?.photo} size={28} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-secondary tracking-wide truncate">{property.agent?.title}</p>
              <p className="text-xs font-medium text-foreground truncate">{property.agent?.name ?? "—"}</p>
            </div>
            {property.premium && <PremiumBadge />}
            <Link
              href={detailHref}
              className="shrink-0 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Voir
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  /* ── LIST VARIANT (default) ────────────────────────────────────── */
  return (
    <article className="isolate bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Image — with carousel */}
        <div className="relative aspect-4/3 md:aspect-auto overflow-hidden bg-muted">
          <CardCarousel
            images={property.gallery.map(getR2ImageUrl).filter(Boolean) as string[]}
            alt={property.title}
            category={property.category}
            gradient={property.imageGradient}
            sizes="(max-width: 768px) 100vw, 280px"
            priority={priority}
          >
            <Link href={detailHref} aria-label={`Voir ${property.title}`} className="absolute inset-0 z-10" />

            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
              {property.isBoosted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
                  ✨ En vedette
                </span>
              )}
              {property.verified && <VerifiedBadge />}
              {property.isNew && <NewBadge />}
              {isHotProperty(property.performance) && <HotBadge label={t.cards.hotLabel} />}
            </div>

            {!isAgentAuth && (
              <button
                onClick={handleToggleFavourite}
                aria-label={saved ? t.cards.removeFavourite : t.cards.addFavourite}
                disabled={saving}
                className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-60 ${
                  saved
                    ? "bg-secondary text-white scale-105"
                    : "bg-white dark:bg-card/95 text-foreground/60 hover:text-secondary hover:scale-110"
                }`}
              >
                <HeartIcon className="w-5 h-5" filled={saved} />
              </button>
            )}
          </CardCarousel>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">{formatListedAgo(property.listedDaysAgo)}</p>
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
            {property.areaSqm > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <AreaIcon className="w-4 h-4" /> {property.areaSqm} m²
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CategoryIcon className="w-4 h-4" /> {categoryLabel(property.category)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-5">
            {property.neighborhood ? `${property.neighborhood}, ` : ""}{property.suburb}
          </p>

          <div className="mt-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-3">
              <AgentAvatar name={property.agent?.name ?? "—"} photo={property.agent?.photo} size={36} />
              <div className="leading-tight">
                <p className="text-[10px] font-semibold text-secondary tracking-widest">{property.agent?.title}</p>
                <p className="text-sm font-medium text-foreground">{property.agent?.name ?? "—"}</p>
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
