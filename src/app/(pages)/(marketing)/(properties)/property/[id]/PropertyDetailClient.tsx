"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addFavourite, removeFavourite, createEnquiry } from "@/services/auth";
import { recordPropertyView, recordPropertyShare, recordPropertyWhatsAppClick } from "@/services/properties";
import { useAuthStore } from "@/store/useAuthStore";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import ShareButton from "@/shared/components/ui/ShareButton";
import { PerformancePanel } from "@/features/properties/components/PerformancePulse";
import {
  ArrowLeft, Bath, BedDouble, Building2, Calendar,
  ChevronLeft, ChevronRight, Flag, Heart, MapPin,
  Maximize2, Moon, Phone, Sparkles, ThumbsUp, ThumbsDown, X, Grid2x2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import PropertyImage from "@/shared/components/ui/PropertyImage";
import { formatPrice, formatListedAgo, categoryLabel } from "@/lib/properties";
import { getR2ImageUrl } from "@/shared/utils/utils";
import { Property, PropertyDetail, PropertyPerformance } from "@/features/properties/types/property";
import { useT } from "@/i18n/useT";

/* ─── helpers ───────────────────────────────────────────────────────────── */

function VerifiedChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-md">
      <Sparkles className="w-3 h-3" /> {label}
    </span>
  );
}
function PremiumChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-md">
      {label}
    </span>
  );
}

function GalleryImg({ src, alt, className = "", badge, onClick, photoCount, viewPhotosLabel, category, gradient }: {
  src: string; alt: string; className?: string; badge?: React.ReactNode;
  onClick?: () => void; photoCount?: number; viewPhotosLabel?: string;
  category?: string; gradient?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted ${className} ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <PropertyImage src={src} alt={alt} category={category} gradient={gradient} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px" />
      {badge}
      {typeof photoCount === "number" && (
        <button onClick={onClick} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
          <Grid2x2 className="w-3.5 h-3.5" />
          {(viewPhotosLabel ?? "Voir {n} photos").replace("{n}", String(photoCount))}
        </button>
      )}
    </div>
  );
}

function ImageSlider({ images, initialIndex, onClose }: { images: string[]; initialIndex: number; onClose: () => void; }) {
  const [current, setCurrent] = useState(initialIndex);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <span className="text-white/70 text-sm">{current + 1} / {images.length}</span>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center px-16 min-h-0">
        <button onClick={prev} className="absolute left-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
          <Image key={current} src={images[current]} alt={`Photo ${current + 1}`} fill className="object-contain" sizes="(max-width: 1024px) calc(100vw - 128px), 896px" priority />
        </div>
        <button onClick={next} className="absolute right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="shrink-0 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 justify-center">
          {images.map((src, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${i === current ? "ring-2 ring-secondary" : "opacity-50 hover:opacity-80"}`}>
              <Image src={src} alt={`Miniature ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className="text-primary">{icon}</span>{children}
    </span>
  );
}

function ActionChip({ icon, label, href, onClick, variant = "default" }: {
  icon: React.ReactNode; label: string; href?: string; onClick?: () => void; variant?: "default" | "primary";
}) {
  const Tag: "a" | "button" = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} type={href ? undefined : "button"}
      className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors border ${
        variant === "primary" ? "bg-accent text-accent-foreground border-accent hover:bg-primary-light" : "bg-muted text-foreground border-border hover:bg-muted/70"
      }`}>
      <span className="text-primary">{icon}</span>{label}
    </Tag>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">{children}</h2>;
}

function AmenityRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-foreground/85">
      <span className="w-7 h-7 rounded-md bg-accent text-primary flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label}
    </li>
  );
}

function AgentInitials({ name, profile }: { name: string; profile?: string }) {
  return <AgentAvatar name={name} photo={profile} size={48} />;
}

function AgentCard({ detail, t, id, onPerf }: {
  detail: PropertyDetail; t: ReturnType<typeof useT>; id: string; onPerf: (p: PropertyPerformance) => void;
}) {
  const dp = t.detail.property;
  return (
    <aside className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 lg:sticky lg:top-28">
      <div className="flex items-center gap-3 mb-4">
        <AgentInitials name={detail.agent?.name ?? "—"} profile={detail.agent?.photo} />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold text-secondary tracking-widest">{detail.agent?.title}</p>
          <p className="text-sm font-semibold text-foreground">{detail.agent?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{dp.responseTime}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Phone className="w-4 h-4" /> {dp.callBtn}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="gap-1.5 bg-[#25D366] hover:bg-[#1faa53] text-white"
          onClick={() => {
            const link = typeof window !== "undefined" ? window.location.href : "";
            const message = dp.whatsappMsg
              .replace("{link}", link)
              .replace("{ref}", detail.reference ?? "");
            window.open(`https://wa.me/971523787362?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
            recordPropertyWhatsAppClick(id).then((p) => { if (p) onPerf(p); });
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.305 1.262.483 1.694.61.712.227 1.36.195 1.871.121.571-.085 1.758-.719 2.006-1.413.255-.704.255-1.301.18-1.426-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.742.982.999-3.648-.235-.375a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
          </svg>
          WhatsApp
        </Button>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="text-secondary">★</span>
        <span className="font-semibold text-foreground">5.0</span>
        <span>{dp.reviewsCount.replace("{n}", "26")}</span>
      </div>
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-[10px] text-muted-foreground tracking-widest font-semibold mb-2">{dp.agencySection}</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-navy text-secondary flex items-center justify-center font-bold tracking-tight">{detail.agency?.monogram}</div>
          <div>
            <p className="text-sm font-semibold text-foreground">{detail.agency?.name ?? "—"}</p>
            <Link href="/a-propos" className="text-xs text-primary hover:underline">{dp.viewAgency}</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */

export default function PropertyDetailClient({ id, detail, recommended }: {
  id: string; detail: PropertyDetail; recommended: Property[];
}) {
  const t = useT();
  const dp = t.detail.property;
  const [activeImage, setActiveImage] = useState(0);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthStore();
  const { isAuthenticated: isAgentAuth } = useAgentSessionStore();
  const router = useRouter();
  const [perf, setPerf] = useState<PropertyPerformance>(
    detail.performance ?? { viewed: 0, shared: 0, saved: 0, whatsappClicks: 0 },
  );
  const gallery = detail.gallery
    .map(getR2ImageUrl)
    .filter((url): url is string => !!url);

  // Record a view once per browser session per property.
  useEffect(() => {
    const key = `okapi-viewed-${id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    recordPropertyView(id).then((p) => { if (p) setPerf(p); });
  }, [id]);

  function handleShared() {
    // Optimistic tick, then sync with the real counters.
    setPerf((p) => ({ ...p, shared: p.shared + 1 }));
    recordPropertyShare(id).then((p) => { if (p) setPerf(p); });
  }

  async function handleToggleFavourite() {
    if (!isAuthenticated || !token) { router.push("/connexion"); return; }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await removeFavourite(token, id);
        setSaved(false);
        setPerf((p) => ({ ...p, saved: Math.max(0, p.saved - 1) }));
      } else {
        await addFavourite(token, id);
        setSaved(true);
        setPerf((p) => ({ ...p, saved: p.saved + 1 }));
      }
    } finally { setSaving(false); }
  }

  async function handleEnquiry() {
    if (!isAuthenticated || !token) { router.push("/connexion"); return; }
    if (!enquiryMessage.trim() || enquirySending) return;
    setEnquirySending(true); setEnquiryError(null);
    try {
      await createEnquiry(token, { propertyId: id, message: enquiryMessage });
      setEnquirySubmitted(true); setEnquiryMessage("");
    } catch { setEnquiryError(dp.enquiryError); }
    finally { setEnquirySending(false); }
  }

  function openSlider(idx: number) { setSliderIndex(idx); setSliderOpen(true); }

  const hasAverages = detail.averagePriceArea != null && detail.averageSizeArea != null;
  const pricePct = hasAverages ? Math.round((detail.price / detail.averagePriceArea! - 1) * 100) : 0;
  const sizePct = hasAverages ? Math.round((detail.areaSqm / detail.averageSizeArea! - 1) * 100) : 0;
  const areaSqmRounded = Math.round(detail.areaSqm);
  const buildingActiveListingsCount = 3 + (areaSqmRounded % 5);

  return (
    <div className="bg-background-alt pb-20">
      {/* Top sub-nav */}
      <div className="bg-white dark:bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Row 1 — back + actions */}
          <div className="flex items-center justify-between gap-3 py-3">
            <Link href={listingHref(detail)} className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{dp.backToResults}</span>
            </Link>

            {/* Breadcrumb sits in the middle on desktop only */}
            <div className="hidden lg:block flex-1 min-w-0">
              <Breadcrumb detail={detail} t={t} />
            </div>

            <div className="flex items-center gap-0.5 text-sm shrink-0">
              {!isAgentAuth && (
                <button onClick={handleToggleFavourite} disabled={saving}
                  className={`inline-flex items-center gap-1.5 px-2.5 md:px-3 h-9 rounded-md hover:bg-muted transition-colors disabled:opacity-60 ${saved ? "text-secondary" : "text-foreground/80"}`}>
                  <Heart className={`w-4 h-4 shrink-0 ${saved ? "fill-current" : ""}`} />
                  <span className="hidden md:inline">{saved ? dp.saved : dp.saveBtn}</span>
                </button>
              )}
              <ShareButton title={detail.title} onShare={handleShared} iconOnly />
              <button className="inline-flex items-center gap-1.5 px-2.5 md:px-3 h-9 rounded-md hover:bg-muted text-foreground/80">
                <Flag className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{dp.reportBtn}</span>
              </button>
            </div>
          </div>

          {/* Row 2 — breadcrumb on tablet (lg hides this) */}
          <div className="lg:hidden pb-2">
            <Breadcrumb detail={detail} t={t} fullWidth />
          </div>
        </div>
      </div>

      {mapOpen && (
        <MapModal neighborhood={detail.neighborhood} suburb={detail.suburb} city={detail.city} onClose={() => setMapOpen(false)} t={t} />
      )}
      {sliderOpen && gallery.length > 0 && (
        <ImageSlider images={gallery} initialIndex={sliderIndex} onClose={() => setSliderOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Gallery images={gallery} title={detail.title} active={activeImage} onActive={setActiveImage}
          onOpenSlider={openSlider} verified={detail.verified} isPremium={detail.premium}
          verifiedLabel={dp.verified} premiumLabel={dp.premium} viewPhotosLabel={dp.viewPhotos}
          category={detail.category} gradient={detail.imageGradient} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8">
          <div className="space-y-10">
            {/* Headline */}
            <header>
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {formatPrice(detail.price, detail.currency, detail.period)}
              </p>
              <h1 className="text-base md:text-lg text-foreground/85 mt-2">{detail.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 pb-5 border-b border-border">
                {detail.bedrooms > 0 && (
                  <StatPill icon={<BedDouble className="w-4 h-4" />}>
                    {detail.bedrooms} {detail.bedrooms > 1 ? dp.bedrooms : dp.bedroom}
                  </StatPill>
                )}
                {detail.bathrooms > 0 && (
                  <StatPill icon={<Bath className="w-4 h-4" />}>{detail.bathrooms} {dp.bathroom}</StatPill>
                )}
                <StatPill icon={<Maximize2 className="w-4 h-4" />}>{areaSqmRounded} m²</StatPill>
                <StatPill icon={<Building2 className="w-4 h-4" />}>{categoryLabel(detail.category)}</StatPill>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <ActionChip variant="primary" icon={<MapPin className="w-4 h-4" />} label={dp.viewOnMap} onClick={() => setMapOpen(true)} />
                <ActionChip icon={<Sparkles className="w-4 h-4" />} label={dp.initialCosts} />
                <ActionChip icon={<ThumbsUp className="w-4 h-4" />} label={dp.rentOrBuy} />
              </div>
            </header>

            {/* Performance / social proof */}
            <PerformancePanel perf={perf} />

            {/* Description */}
            <section>
              <p className="text-sm text-muted-foreground mb-2">
                {categoryLabel(detail.category)} à{" "}
                {detail.listingType === "rent" ? dp.toRent : dp.toSell} dans{" "}
                {detail.neighborhood}, {detail.suburb}
              </p>
              <SectionHeading>{dp.descHeading}</SectionHeading>
              <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">{detail.description}</p>
              <p className="mt-4 text-sm text-foreground/85">
                <span className="inline-flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {dp.availableFrom} <strong className="text-foreground">{detail.availableFrom}</strong>
                </span>
              </p>
            </section>

            {/* Short-term rental info */}
            {detail.isShortTerm && (
              <section className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-4 h-4 text-primary" />
                  <SectionHeading>Location courte durée</SectionHeading>
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    Short-term
                  </span>
                  {detail.isLongTerm && (
                    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      Long-term aussi
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-white dark:bg-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {detail.pricePerNight != null && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Prix / nuit</span>
                      <span className="font-semibold text-foreground">{detail.pricePerNight.toLocaleString("fr-FR")} {detail.currency}</span>
                    </div>
                  )}
                  {detail.minStayNights != null && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Séjour minimum</span>
                      <span className="font-semibold text-foreground">{detail.minStayNights} nuit{detail.minStayNights > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {detail.maxStayNights != null && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Séjour maximum</span>
                      <span className="font-semibold text-foreground">{detail.maxStayNights} nuit{detail.maxStayNights > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
                {detail.shortTermNotes && (
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{detail.shortTermNotes}</p>
                )}
              </section>
            )}

            {/* Amenities */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>{dp.amenitiesHeading}</SectionHeading>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {detail.amenities.map((a) => <AmenityRow key={a} label={a} />)}
              </ul>
            </section>

            {/* Location */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>{dp.locationHeading}</SectionHeading>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-primary-light via-white to-accent">
                  <svg className="absolute inset-0 w-full h-full text-primary/30" viewBox="0 0 200 80" fill="none" preserveAspectRatio="none">
                    <path d="M0 40 Q40 10 80 40 T160 40 T240 40" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M0 60 L60 50 L120 65 L200 55" stroke="currentColor" strokeWidth="1" />
                    <path d="M30 0 L40 80 M120 0 L130 80" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{detail.neighborhood}</p>
                        <p className="text-xs text-muted-foreground">{detail.suburb}, {detail.city}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setMapOpen(true)}>{dp.viewOnMapBtn}</Button>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-primary text-white font-semibold">{dp.buildingTab}</span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-foreground/80 font-medium">{dp.neighborhoodTab}</span>
              </div>
              <div className="mt-4 rounded-xl border border-border p-5 bg-white dark:bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dp.aboutBuildingTitle.replace("{zone}", detail.zone ?? "")}</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Ce bâtiment offre des biens de {detail.bedrooms} à {detail.bedrooms + 3} chambres,
                      d&apos;une surface moyenne de {areaSqmRounded} - {areaSqmRounded + 800} m². Il compte actuellement {buildingActiveListingsCount} annonces actives.
                    </p>
                  </div>
                  <Link href="#" className="text-xs text-primary hover:underline whitespace-nowrap">{dp.learnMore}</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-lg bg-accent/60 px-3 py-2 text-xs">
                    <p className="text-muted-foreground">{dp.buildingActiveListings}</p>
                    <p className="text-sm font-semibold text-foreground">{buildingActiveListingsCount}</p>
                  </div>
                  <div className="rounded-lg bg-accent/60 px-3 py-2 text-xs">
                    <p className="text-muted-foreground">{dp.priceRange}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {Math.round(detail.price * 0.7).toLocaleString("fr-FR")} – {Math.round(detail.price * 1.4).toLocaleString("fr-FR")}{" "}
                      {detail.currency === "USD" ? "$" : detail.currency}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Prices & trends */}
            {hasAverages && (
              <section className="pt-2 border-t border-border">
                <SectionHeading>{dp.pricesTrendsHeading}</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TrendCard positive={pricePct < 0}
                    headline={pricePct >= 0
                      ? dp.costMorePct.replace("{n}", String(pricePct))
                      : dp.costLessPct.replace("{n}", String(Math.abs(pricePct)))}
                    detail={dp.avgPriceLabel.replace("{price}", `${Math.round(detail.averagePriceArea!).toLocaleString("fr-FR")} ${detail.currency === "USD" ? "$" : detail.currency}`)} />
                  <TrendCard positive={sizePct > 0}
                    headline={sizePct >= 0
                      ? dp.biggerPct.replace("{n}", String(sizePct))
                      : dp.smallerPct.replace("{n}", String(Math.abs(sizePct)))}
                    detail={dp.avgSizeLabel.replace("{size}", String(Math.round(detail.averageSizeArea!)))} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">{dp.dataNote.replace("{suburb}", detail.suburb)}</p>
              </section>
            )}

            {/* Presented by */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>{dp.presentedByHeading}</SectionHeading>
              <div className="rounded-xl border border-border bg-white dark:bg-card p-5">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <AgentInitials name={detail.agent?.name ?? "—"} profile={detail.agent?.photo} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{detail.agent?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{detail.agent?.title}</p>
                    <Link href="#" className="text-xs text-primary hover:underline mt-1 inline-block">{dp.agentPropertiesLink}</Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div><p className="text-foreground font-semibold">24</p><p className="text-muted-foreground">{dp.transLabel}</p></div>
                    <div><p className="text-foreground font-semibold">5 min</p><p className="text-muted-foreground">{dp.responseLabel}</p></div>
                    <div><p className="text-foreground font-semibold">1B</p><p className="text-muted-foreground">{dp.volumeLabel}</p></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Enquiry — hidden for agents (they don't send enquiries) */}
            {!isAgentAuth && <section className="pt-2 border-t border-border">
              <SectionHeading>{dp.enquiryHeading}</SectionHeading>
              {enquirySubmitted ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                  <p className="text-sm font-semibold text-green-700 mb-1">{dp.enquirySentTitle}</p>
                  <p className="text-xs text-green-600">{dp.enquirySentDesc}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white dark:bg-card p-5">
                  <p className="text-sm text-foreground/80 mb-4">{dp.enquiryIntro}</p>
                  <textarea
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder={dp.enquiryPlaceholder.replace("{title}", detail.title).replace("{ref}", detail.reference ?? "")}
                    rows={4}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-card mb-3"
                  />
                  {enquiryError && <p className="text-xs text-destructive mb-3">{enquiryError}</p>}
                  <Button onClick={handleEnquiry} disabled={enquirySending} className="w-full">
                    {enquirySending ? dp.sendingLabel : isAuthenticated ? dp.sendBtn : dp.loginBtn}
                  </Button>
                </div>
              )}
            </section>}

            {/* Property details */}
            <section className="pt-2 border-t border-border">
              <div className="rounded-xl border border-border bg-white dark:bg-card p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{dp.propertyDetailsHeading}</h3>
                  <DetailRow label={dp.typeLabel} value={categoryLabel(detail.category)} />
                  <DetailRow label={dp.surfaceLabel} value={`${areaSqmRounded} m² / ${Math.round(detail.areaSqm * 10.764)} ft²`} />
                  <DetailRow label={dp.bedroomsLabel} value={String(detail.bedrooms)} />
                  <DetailRow label={dp.bathroomsLabel} value={String(detail.bathrooms)} />
                  <DetailRow label={dp.availableLabel} value={detail.availableFrom} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{dp.regulatoryHeading}</h3>
                  <DetailRow label={dp.referenceLabel} value={detail.reference} />
                  <DetailRow label={dp.listedLabel} value={formatListedAgo(detail.listedDaysAgo)} />
                  <DetailRow label={dp.licenseLabel} value={detail.brokerLicense} />
                  <DetailRow label={dp.agencyLabel} value={detail.agency?.name} />
                  <DetailRow label={dp.zoneLabel} value={detail.zone} />
                  <DetailRow label={dp.permitLabel} value={detail.permitNumber} />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <AgentCard detail={detail} t={t} id={id} onPerf={setPerf} />
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">{dp.recommendedHeading}</h2>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full border border-border bg-white dark:bg-card text-foreground/70 hover:bg-muted" aria-label={dp.prevBtn}>
                  <ChevronLeft className="w-4 h-4 mx-auto" />
                </button>
                <button className="w-9 h-9 rounded-full border border-border bg-white dark:bg-card text-foreground/70 hover:bg-muted" aria-label={dp.nextBtn}>
                  <ChevronRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((p) => <RecommendedCard key={p.id} property={p} t={t} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ─── subcomponents ──────────────────────────────────────────────────────── */

function MapModal({ neighborhood, suburb, city, onClose, t }: {
  neighborhood: string; suburb: string; city: string; onClose: () => void; t: ReturnType<typeof useT>;
}) {
  const dp = t.detail.property;
  const query = encodeURIComponent(`${neighborhood}, ${suburb}, ${city}, République Démocratique du Congo`);
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-card rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">{neighborhood}</p>
            <p className="text-xs text-muted-foreground">{suburb}, {city}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full" style={{ height: "420px" }}>
          <iframe title="Localisation du bien" width="100%" height="100%" style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${query}&output=embed&z=15`} allowFullScreen />
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{t.common.approxLocation}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-medium">
            {t.common.openInMaps}
          </a>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({
  detail,
  t,
  fullWidth = false,
}: {
  detail: PropertyDetail;
  t: ReturnType<typeof useT>;
  fullWidth?: boolean;
}) {
  const dp = t.detail.property;
  const trail = [
    { label: dp.breadHome, href: "/" },
    { label: detail.listingType === "rent" ? dp.breadRent : dp.breadBuy, href: listingHref(detail) },
    { label: categoryLabel(detail.category) },
    { label: detail.suburb },
    { label: detail.title, truncate: true },
  ];
  return (
    <nav className={`flex items-center flex-wrap text-xs text-muted-foreground gap-x-1.5 gap-y-1 ${fullWidth ? "w-full" : "min-w-0"}`}>
      {trail.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 min-w-0">
          {i > 0 && <span className="text-foreground/30 shrink-0">/</span>}
          {c.href
            ? <Link href={c.href} className="hover:text-primary shrink-0">{c.label}</Link>
            : <span className={`${c.truncate ? "truncate max-w-[200px]" : ""} shrink-0`}>{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function listingHref(detail: PropertyDetail | Property): string {
  if (detail.listingType === "rent") return "/louer";
  if (detail.listingType === "sale") return "/acheter";
  return "/commercial";
}

function Gallery({ images, title, active, onActive, onOpenSlider, verified, isPremium, verifiedLabel, premiumLabel, viewPhotosLabel, category, gradient }: {
  images: string[]; title: string; active: number; onActive: (n: number) => void;
  onOpenSlider: (idx: number) => void; verified: boolean; isPremium: boolean;
  verifiedLabel: string; premiumLabel: string; viewPhotosLabel: string;
  category?: string; gradient?: string;
}) {
  const mainSrc = images[active] ?? images[0];
  const thumbs = images.slice(1, 3);
  if (!mainSrc) {
    return (
      <div className="relative aspect-[16/10] md:aspect-[16/11] rounded-xl overflow-hidden bg-muted">
        <PropertyImage src={null} alt={title} category={category} gradient={gradient} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
      <GalleryImg src={mainSrc} alt={title} className="aspect-[16/10] md:aspect-[16/11]"
        onClick={() => onOpenSlider(active)} photoCount={images.length} viewPhotosLabel={viewPhotosLabel}
        category={category} gradient={gradient}
        badge={
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {verified && <VerifiedChip label={verifiedLabel} />}
            {isPremium && <PremiumChip label={premiumLabel} />}
          </div>
        } />
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {thumbs.map((src, i) => (
          <GalleryImg key={i} src={src} alt={`${title} — photo ${i + 2}`}
            className={`aspect-[4/3] md:aspect-[16/11] ${active === i + 1 ? "ring-2 ring-primary" : ""}`}
            category={category} gradient={gradient}
            onClick={() => { onActive(i + 1); onOpenSlider(i + 1); }} />
        ))}
      </div>
    </div>
  );
}

function TrendCard({ positive, headline, detail }: { positive: boolean; headline: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-white dark:bg-card p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground leading-snug">{headline}</p>
        <p className="text-xs text-muted-foreground mt-1">{detail}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${positive ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-500"}`}>
        {positive ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value ?? "—"}</span>
    </div>
  );
}

function RecommendedCard({ property, t }: { property: Property; t: ReturnType<typeof useT> }) {
  const dp = t.detail.property;
  const coverSrc = getR2ImageUrl(property.gallery?.[0]);
  return (
    <Link href={`/property/${property.id}`} className="block bg-white dark:bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] bg-muted">
        <PropertyImage
          src={coverSrc}
          alt={property.title}
          category={property.category}
          gradient={property.imageGradient}
          sizes="280px"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <AgentInitials name={property.agent?.name ?? "—"} profile={property.agent?.photo} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-foreground mb-1">{property.agent?.name ?? "—"}</p>
        <p className="text-base font-bold text-foreground">{formatPrice(property.price, property.currency, property.period)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {property.bedrooms > 0 ? `${property.bedrooms} ${dp.bedroom} · ` : ""}
          {property.bathrooms} {dp.bathroom} · {property.areaSqm} m² · {categoryLabel(property.category)}
        </p>
        <p className="text-xs text-muted-foreground mt-1 truncate">{property.neighborhood}, {property.suburb}</p>
      </div>
    </Link>
  );
}
