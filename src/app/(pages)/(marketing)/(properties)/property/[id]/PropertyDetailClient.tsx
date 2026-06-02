"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addFavourite, removeFavourite, createEnquiry } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import ShareButton from "@/shared/components/ui/ShareButton";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flag,
  Heart,
  MapPin,
  Maximize2,
  Phone,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  X,
  Grid2x2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import AgentAvatar from "@/shared/components/ui/AgentAvatar";
import {
  formatPrice,
  formatListedAgo,
  categoryLabel,

} from "@/lib/properties";
import { Property, PropertyDetail } from "@/features/properties/types/property";

/* ----------------------- small presentational helpers ---------------------- */

function VerifiedChip() {
  return (
    <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-md">
      <Sparkles className="w-3 h-3" /> Vérifié
    </span>
  );
}

function PremiumChip() {
  return (
    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-md">
      Premium
    </span>
  );
}

function GalleryImg({
  src,
  alt,
  className = "",
  badge,
  onClick,
  photoCount,
}: {
  src: string;
  alt: string;
  className?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  photoCount?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-muted ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      {badge}
      {typeof photoCount === "number" && (
        <button
          onClick={onClick}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <Grid2x2 className="w-3.5 h-3.5" />
          Voir {photoCount} photos
        </button>
      )}
    </div>
  );
}

function ImageSlider({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <span className="text-white/70 text-sm">{current + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center px-16 min-h-0">
        <button
          onClick={prev}
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
          <Image
            key={current}
            src={images[current]}
            alt={`Photo ${current + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        <button
          onClick={next}
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="shrink-0 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 justify-center">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                i === current ? "ring-2 ring-secondary" : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt={`Miniature ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}

function ActionChip({
  icon,
  label,
  href,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "primary";
}) {
  const Tag: "a" | "button" = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors border ${
        variant === "primary"
          ? "bg-accent text-accent-foreground border-accent hover:bg-primary-light"
          : "bg-muted text-foreground border-border hover:bg-muted/70"
      }`}
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Tag>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
      {children}
    </h2>
  );
}

function AmenityRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-foreground/85">
      <span className="w-7 h-7 rounded-md bg-accent text-primary flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
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

function AgentCard({ detail }: { detail: PropertyDetail }) {
  return (
    <aside className="bg-white rounded-2xl border border-border shadow-sm p-5 lg:sticky lg:top-28">
      <div className="flex items-center gap-3 mb-4">
        <AgentInitials name={detail.agent.name} profile={detail.agent.photo} />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold text-secondary tracking-widest">
            {detail.agent.title}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {detail.agent.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Réponse en moins de 5 min
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Phone className="w-4 h-4" /> Appeler
        </Button>
        <Button variant="default" size="sm" className="gap-1.5 bg-[#25D366] hover:bg-[#1faa53] text-white" asChild>
          <a
            href={`https://wa.me/${detail.agency.phone.replace(/[\s+\-()]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par ce bien sur Okapi Real Estate : ${detail.title} (réf. ${detail.reference}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.305 1.262.483 1.694.61.712.227 1.36.195 1.871.121.571-.085 1.758-.719 2.006-1.413.255-.704.255-1.301.18-1.426-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.742.982.999-3.648-.235-.375a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
            </svg>
            WhatsApp
          </a>
        </Button>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="text-secondary">★</span>
        <span className="font-semibold text-foreground">5.0</span>
        <span>· 26 avis</span>
      </div>

      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-[10px] text-muted-foreground tracking-widest font-semibold mb-2">
          AGENCE
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-navy text-secondary flex items-center justify-center font-bold tracking-tight">
            {detail.agency.monogram}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{detail.agency.name}</p>
            <Link
              href="/a-propos"
              className="text-xs text-primary hover:underline"
            >
              Voir l&apos;agence
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* --------------------------------- main ---------------------------------- */

export default function PropertyDetailClient({
  id,
  detail,
  recommended,
}: {
  id: string;
  detail: PropertyDetail;
  recommended: Property[];
}) {
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
  const router = useRouter();

  async function handleToggleFavourite() {
    if (!isAuthenticated || !token) {
      router.push("/connexion");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await removeFavourite(token, id);
        setSaved(false);
      } else {
        await addFavourite(token, id);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleEnquiry() {
    if (!isAuthenticated || !token) {
      router.push("/connexion");
      return;
    }
    if (!enquiryMessage.trim() || enquirySending) return;
    setEnquirySending(true);
    setEnquiryError(null);
    try {
      await createEnquiry(token, { propertyId: id, message: enquiryMessage });
      setEnquirySubmitted(true);
      setEnquiryMessage("");
    } catch {
      setEnquiryError("Impossible d'envoyer votre demande. Veuillez réessayer.");
    } finally {
      setEnquirySending(false);
    }
  }

  function openSlider(idx: number) {
    setSliderIndex(idx);
    setSliderOpen(true);
  }

  const hasAverages = detail.averagePriceArea != null && detail.averageSizeArea != null;
  const pricePct = hasAverages ? Math.round((detail.price / detail.averagePriceArea! - 1) * 100) : 0;
  const sizePct = hasAverages ? Math.round((detail.areaSqm / detail.averageSizeArea! - 1) * 100) : 0;

  return (
    <div className="bg-background-alt pb-20">
      {/* Top sub-nav */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href={listingHref(detail)}
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux résultats
          </Link>
          <Breadcrumb detail={detail} />
          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={handleToggleFavourite}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-md hover:bg-muted transition-colors disabled:opacity-60 ${
                saved ? "text-secondary" : "text-foreground/80"
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Sauvegardé" : "Sauvegarder"}
            </button>
            <ShareButton title={detail.title} />
            <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md hover:bg-muted text-foreground/80">
              <Flag className="w-4 h-4" /> Signaler
            </button>
          </div>
        </div>
      </div>

      {mapOpen && (
        <MapModal
          neighborhood={detail.neighborhood}
          suburb={detail.suburb}
          city={detail.city}
          onClose={() => setMapOpen(false)}
        />
      )}
      {sliderOpen && detail.gallery.length > 0 && (
        <ImageSlider
          images={detail.gallery}
          initialIndex={sliderIndex}
          onClose={() => setSliderOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 pt-6">
        {/* Gallery */}
        <Gallery
          images={detail.gallery}
          title={detail.title}
          active={activeImage}
          onActive={setActiveImage}
          onOpenSlider={openSlider}
          verified={detail.verified}
          isPremium={detail.premium}
        />

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8">
          {/* LEFT */}
          <div className="space-y-10">
            {/* Headline */}
            <header>
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {formatPrice(detail.price, detail.currency, detail.period)}
              </p>
              <h1 className="text-base md:text-lg text-foreground/85 mt-2">
                {detail.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 pb-5 border-b border-border">
                {detail.bedrooms > 0 && (
                  <StatPill icon={<BedDouble className="w-4 h-4" />}>
                    {detail.bedrooms} chambre{detail.bedrooms > 1 ? "s" : ""}
                  </StatPill>
                )}
                {detail.bathrooms > 0 && (
                  <StatPill icon={<Bath className="w-4 h-4" />}>
                    {detail.bathrooms} sdb
                  </StatPill>
                )}
                <StatPill icon={<Maximize2 className="w-4 h-4" />}>
                  {detail.areaSqm} m²
                </StatPill>
                <StatPill icon={<Building2 className="w-4 h-4" />}>
                  {categoryLabel(detail.category)}
                </StatPill>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <ActionChip
                  variant="primary"
                  icon={<MapPin className="w-4 h-4" />}
                  label="Voir sur la carte"
                  onClick={() => setMapOpen(true)}
                />
                <ActionChip
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Frais initiaux"
                />
                <ActionChip
                  icon={<ThumbsUp className="w-4 h-4" />}
                  label="Louer ou acheter ?"
                />
              </div>
            </header>

            {/* Description */}
            <section>
              <p className="text-sm text-muted-foreground mb-2">
                {categoryLabel(detail.category)} à{" "}
                {detail.listingType === "rent" ? "louer" : "vendre"} dans{" "}
                {detail.neighborhood}, {detail.suburb}
              </p>
              <SectionHeading>Description</SectionHeading>
              <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                {detail.description}
              </p>

              <p className="mt-4 text-sm text-foreground/85">
                <span className="inline-flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Disponible à partir du{" "}
                  <strong className="text-foreground">{detail.availableFrom}</strong>
                </span>
              </p>
            </section>

            {/* Amenities */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>Équipements</SectionHeading>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {detail.amenities.map((a) => (
                  <AmenityRow key={a} label={a} />
                ))}
              </ul>
            </section>

            {/* Location */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>Localisation</SectionHeading>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-primary-light via-white to-accent">
                  {/* Faux map texture */}
                  <svg
                    className="absolute inset-0 w-full h-full text-primary/30"
                    viewBox="0 0 200 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 40 Q40 10 80 40 T160 40 T240 40"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M0 60 L60 50 L120 65 L200 55"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M30 0 L40 80 M120 0 L130 80"
                      stroke="currentColor"
                      strokeWidth="0.8"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {detail.neighborhood}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {detail.suburb}, {detail.city}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setMapOpen(true)}>
                      Voir sur la carte
                    </Button>
                  </div>
                </div>
              </div>

              {/* Building tabs */}
              <div className="mt-5 flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-primary text-white font-semibold">
                  Bâtiment
                </span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-foreground/80 font-medium">
                  Quartier
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-border p-5 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      À propos du bâtiment {detail.zone}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Ce bâtiment offre des biens de {detail.bedrooms} à{" "}
                      {detail.bedrooms + 3} chambres, d&apos;une surface moyenne de{" "}
                      {detail.areaSqm} - {detail.areaSqm + 800} m². Il compte{" "}
                      actuellement {3 + (detail.areaSqm % 5)} annonces actives.
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    En savoir plus →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-lg bg-accent/60 px-3 py-2 text-xs">
                    <p className="text-muted-foreground">Annonces actives</p>
                    <p className="text-sm font-semibold text-foreground">
                      {3 + (detail.areaSqm % 5)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/60 px-3 py-2 text-xs">
                    <p className="text-muted-foreground">Fourchette de prix</p>
                    <p className="text-sm font-semibold text-foreground">
                      {Math.round(detail.price * 0.7).toLocaleString("fr-FR")} -{" "}
                      {Math.round(detail.price * 1.4).toLocaleString("fr-FR")}{" "}
                      {detail.currency === "USD" ? "$" : detail.currency}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Prices & trends */}
            {hasAverages && (
              <section className="pt-2 border-t border-border">
                <SectionHeading>Prix &amp; tendances</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TrendCard
                    positive={pricePct < 0}
                    headline={
                      pricePct >= 0
                        ? `Ce bien coûte ${pricePct}% de plus que la moyenne`
                        : `Ce bien coûte ${Math.abs(pricePct)}% de moins que la moyenne`
                    }
                    detail={`Prix moyen ${detail.averagePriceArea!.toLocaleString("fr-FR")} ${
                      detail.currency === "USD" ? "$" : detail.currency
                    }`}
                  />
                  <TrendCard
                    positive={sizePct > 0}
                    headline={
                      sizePct >= 0
                        ? `Ce bien est ${sizePct}% plus grand que la moyenne`
                        : `Ce bien est ${Math.abs(sizePct)}% plus petit que la moyenne`
                    }
                    detail={`Surface moyenne ${detail.averageSizeArea} m²`}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Données basées sur la moyenne des annonces récentes de Okapi Real
                  Estate à {detail.suburb}.
                </p>
              </section>
            )}

            {/* Provided by */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>Présenté par</SectionHeading>
              <div className="rounded-xl border border-border bg-white p-5">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <AgentInitials name={detail.agent.name} profile={detail.agent.photo} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {detail.agent.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {detail.agent.title}
                    </p>
                    <Link
                      href="#"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      Voir les biens de l&apos;agent (45)
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <p className="text-foreground font-semibold">24</p>
                      <p className="text-muted-foreground">Transactions</p>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">5 min</p>
                      <p className="text-muted-foreground">Réponse</p>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">1B</p>
                      <p className="text-muted-foreground">Volume</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Enquiry / Demande */}
            <section className="pt-2 border-t border-border">
              <SectionHeading>Envoyer une demande</SectionHeading>
              {enquirySubmitted ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                  <p className="text-sm font-semibold text-green-700 mb-1">Demande envoyée !</p>
                  <p className="text-xs text-green-600">
                    L&apos;agent vous contactera dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white p-5">
                  <p className="text-sm text-foreground/80 mb-4">
                    Intéressé(e) par ce bien ? Envoyez une demande directement à l&apos;agent.
                  </p>
                  <textarea
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder={`Bonjour, je suis intéressé(e) par votre bien "${detail.title}" (réf. ${detail.reference}). Pourriez-vous me donner plus d'informations ?`}
                    rows={4}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white mb-3"
                  />
                  {enquiryError && (
                    <p className="text-xs text-destructive mb-3">{enquiryError}</p>
                  )}
                  <Button
                    onClick={handleEnquiry}
                    disabled={enquirySending}
                    className="w-full"
                  >
                    {enquirySending
                      ? "Envoi en cours…"
                      : isAuthenticated
                      ? "Envoyer ma demande"
                      : "Connectez-vous pour envoyer une demande"}
                  </Button>
                </div>
              )}
            </section>

            {/* Property details + Regulatory */}
            <section className="pt-2 border-t border-border">
              <div className="rounded-xl border border-border bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Détails du bien
                  </h3>
                  <DetailRow label="Type" value={categoryLabel(detail.category)} />
                  <DetailRow
                    label="Surface"
                    value={`${detail.areaSqm} m² / ${Math.round(
                      detail.areaSqm * 10.764
                    )} ft²`}
                  />
                  <DetailRow label="Chambres" value={String(detail.bedrooms)} />
                  <DetailRow label="Salles de bain" value={String(detail.bathrooms)} />
                  <DetailRow label="Disponible le" value={detail.availableFrom} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Information réglementaire
                  </h3>
                  <DetailRow label="Référence" value={detail.reference} />
                  <DetailRow label="Listé" value={formatListedAgo(detail.listedDaysAgo)} />
                  <DetailRow label="Licence agence" value={detail.brokerLicense} />
                  <DetailRow label="Agence" value={detail.agency.name} />
                  <DetailRow label="Zone" value={detail.zone} />
                  <DetailRow label="Permis" value={detail.permitNumber} />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <AgentCard detail={detail} />
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">
                Recommandé pour vous
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="w-9 h-9 rounded-full border border-border bg-white text-foreground/70 hover:bg-muted"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  className="w-9 h-9 rounded-full border border-border bg-white text-foreground/70 hover:bg-muted"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((p) => (
                <RecommendedCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function MapModal({
  neighborhood,
  suburb,
  city,
  onClose,
}: {
  neighborhood: string;
  suburb: string;
  city: string;
  onClose: () => void;
}) {
  const query = encodeURIComponent(
    `${neighborhood}, ${suburb}, ${city}, République Démocratique du Congo`
  );
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">{neighborhood}</p>
            <p className="text-xs text-muted-foreground">
              {suburb}, {city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full" style={{ height: "420px" }}>
          <iframe
            title="Localisation du bien"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${query}&output=embed&z=15`}
            allowFullScreen
          />
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            La localisation affichée est approximative.
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-medium"
          >
            Ouvrir dans Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ detail }: { detail: PropertyDetail }) {
  const trail = [
    { label: "Accueil", href: "/" },
    { label: detail.listingType === "rent" ? "Louer" : "Acheter", href: listingHref(detail) },
    { label: categoryLabel(detail.category) },
    { label: detail.suburb },
    { label: detail.title, truncate: true },
  ];
  return (
    <nav className="hidden md:flex items-center text-xs text-muted-foreground gap-1.5 max-w-[40%] truncate">
      {trail.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-foreground/30">/</span>}
          {c.href ? (
            <Link href={c.href} className="hover:text-primary">
              {c.label}
            </Link>
          ) : (
            <span className={c.truncate ? "truncate max-w-[180px]" : ""}>
              {c.label}
            </span>
          )}
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

function Gallery({
  images,
  title,
  active,
  onActive,
  onOpenSlider,
  verified,
  isPremium,
}: {
  images: string[];
  title: string;
  active: number;
  onActive: (n: number) => void;
  onOpenSlider: (idx: number) => void;
  verified: boolean;
  isPremium: boolean;
}) {
  const mainSrc = images[active] ?? images[0];
  const thumbs = images.slice(1, 3);

  if (!mainSrc) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
      <GalleryImg
        src={mainSrc}
        alt={title}
        className="aspect-[16/10] md:aspect-[16/11]"
        onClick={() => onOpenSlider(active)}
        photoCount={images.length}
        badge={
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {verified && <VerifiedChip />}
            {isPremium && <PremiumChip />}
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {thumbs.map((src, i) => (
          <GalleryImg
            key={i}
            src={src}
            alt={`${title} — photo ${i + 2}`}
            className={`aspect-[4/3] md:aspect-[16/11] ${active === i + 1 ? "ring-2 ring-primary" : ""}`}
            onClick={() => { onActive(i + 1); onOpenSlider(i + 1); }}
          />
        ))}
      </div>
    </div>
  );
}

function TrendCard({
  positive,
  headline,
  detail,
}: {
  positive: boolean;
  headline: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground leading-snug">
          {headline}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{detail}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          positive ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-500"
        }`}
      >
        {positive ? (
          <ThumbsUp className="w-4 h-4" />
        ) : (
          <ThumbsDown className="w-4 h-4" />
        )}
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

function RecommendedCard({ property }: { property: Property }) {
  const coverSrc = property.gallery?.[0];
  return (
    <Link
      href={`/property/${property.id}`}
      className="block bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {coverSrc ? (
          <Image src={coverSrc} alt={property.title} fill className="object-cover" sizes="280px" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${property.imageGradient} flex items-center justify-center text-white/35`}>
            <Building2 className="w-1/3 h-1/3" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <AgentInitials name={property.agent.name} profile={property.agent.photo} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-foreground mb-1">
          {property.agent.name}
        </p>
        <p className="text-base font-bold text-foreground">
          {formatPrice(property.price, property.currency, property.period)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {property.bedrooms > 0 ? `${property.bedrooms} ch · ` : ""}
          {property.bathrooms} sdb · {property.areaSqm} m² ·{" "}
          {categoryLabel(property.category)}
        </p>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {property.neighborhood}, {property.suburb}
        </p>
      </div>
    </Link>
  );
}
