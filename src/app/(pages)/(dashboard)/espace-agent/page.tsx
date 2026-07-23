"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  ChevronRight,
  Lock,
  Eye,
  Home,
  Star,
  PlusCircle,
  Settings,
  BarChart2,
  Pencil,
  Clock,
  Zap,
  ExternalLink,
  Building2,
  Briefcase,
  Warehouse,
  ShoppingBag,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";
import { useT } from "@/i18n/useT";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentProperty = {
  id: string;
  title: string;
  status: string;
  suburb?: string;
  neighborhood?: string;
  city?: string;
  viewCount?: number;
  price?: number;
  currency?: string;
  listingType?: string;
  category?: string;
  boostedUntil?: string | null;
  gallery?: string[];
};

type AgentProfile = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  agentType?: string;
  verificationTier: "NON_VERIFIE" | "VERIFIE";
  emailVerified: boolean;
  bio?: string;
  communes?: string[];
  propertyTypes?: string[];
  rentalFocus?: string;
  yearsExperienceLabel?: string;
  photo?: string;
  photoUrl?: string;
  plan?: string;
  freeListingCap?: number;
  graceEndsAt?: string;
  properties?: AgentProperty[];
};

type T = ReturnType<typeof useT>["espaceAgent"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatGracePeriod(
  graceEndsAt: string,
  t: T,
): {
  label: string;
  daysLeft: number;
  expired: boolean;
  endingSoon: boolean;
} {
  const end = new Date(graceEndsAt);
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  const expired = daysLeft === 0;
  const endingSoon = daysLeft > 0 && daysLeft <= 30;

  if (expired)
    return {
      label: t.gracePeriodExpired,
      daysLeft: 0,
      expired: true,
      endingSoon: false,
    };

  const months = Math.floor(daysLeft / 30);
  const days = daysLeft % 30;
  const parts: string[] = [];
  if (months > 0) parts.push(`${months} mois`);
  if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);

  return {
    label: parts.join(" et "),
    daysLeft,
    expired: false,
    endingSoon,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Property thumbnail ───────────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  apartment:  { Icon: Building2,   bg: "bg-blue-50",    color: "text-blue-400"    },
  studio:     { Icon: Building2,   bg: "bg-blue-50",    color: "text-blue-400"    },
  duplex:     { Icon: Building2,   bg: "bg-indigo-50",  color: "text-indigo-400"  },
  penthouse:  { Icon: Building2,   bg: "bg-violet-50",  color: "text-violet-400"  },
  villa:      { Icon: Home,        bg: "bg-emerald-50", color: "text-emerald-400" },
  townhouse:  { Icon: Home,        bg: "bg-teal-50",    color: "text-teal-400"    },
  house:      { Icon: Home,        bg: "bg-green-50",   color: "text-green-400"   },
  land:       { Icon: TreePine,    bg: "bg-lime-50",    color: "text-lime-500"    },
  terrain:    { Icon: TreePine,    bg: "bg-lime-50",    color: "text-lime-500"    },
  office:     { Icon: Briefcase,   bg: "bg-amber-50",   color: "text-amber-400"   },
  warehouse:  { Icon: Warehouse,   bg: "bg-orange-50",  color: "text-orange-400"  },
  retail:     { Icon: ShoppingBag, bg: "bg-rose-50",    color: "text-rose-400"    },
  store:      { Icon: ShoppingBag, bg: "bg-rose-50",    color: "text-rose-400"    },
  commercial: { Icon: ShoppingBag, bg: "bg-pink-50",    color: "text-pink-400"    },
};

function PropertyThumb({ src, category, title }: { src?: string; category?: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const key = (category ?? "").toLowerCase();
  const { Icon, bg, color } = CATEGORY_ICON[key] ?? { Icon: Home, bg: "bg-muted", color: "text-muted-foreground/40" };

  if (!src || failed) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className="w-full h-full object-cover" onError={() => setFailed(true)} />
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileSection({
  profile,
  initials,
  t,
}: {
  profile: AgentProfile;
  initials: string;
  t: T;
}) {
  const isVerified = profile.verificationTier === "VERIFIE";
  const rawPhoto = profile.photo || profile.photoUrl || "";
  const avatarSrc =
    rawPhoto.startsWith("https://") && rawPhoto.length > 30 ? rawPhoto : null;
  const visibleCommunes = (profile.communes ?? []).slice(0, 3);
  const extraCommunes = Math.max(0, (profile.communes?.length ?? 0) - 3);

  const agentTypeLabels: Record<string, string> = {
    COMMISSIONNAIRE: t.typeIndependent,
    AGENT: t.typeAgent,
    AGENCY_OWNER: t.typeAgencyOwner,
    OTHER: t.typeOther,
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm p-5">
      {/* Top: avatar + name + badge */}
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={profile.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg border-2 border-border">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold leading-tight truncate">
            {profile.name}
          </h1>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 mt-1">
              <CheckCircle className="w-3 h-3" /> {t.verifiedBadge}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 mt-1">
              <Clock className="w-3 h-3" /> {t.pendingBadge}
            </span>
          )}
          {profile.agentType && (
            <p className="text-xs text-muted-foreground mt-1">
              {agentTypeLabels[profile.agentType] ?? profile.agentType}
            </p>
          )}
        </div>
      </div>

      {/* Communes */}
      {visibleCommunes.length > 0 && (
        <div className="flex items-start gap-1.5 mt-3 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
          <span className="leading-snug">
            {visibleCommunes.join(", ")}
            {extraCommunes > 0 && (
              <span className="ml-1 text-primary font-medium">
                +{extraCommunes}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Contact */}
      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {profile.email && (
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
        )}
        {profile.phoneNumber && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{profile.phoneNumber}</span>
          </div>
        )}
        {profile.whatsappNumber && (
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3 h-3 flex-shrink-0 text-green-600" />
            <span>{profile.whatsappNumber}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          asChild
        >
          <Link href="/espace-agent/profil">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            {t.editProfile}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          asChild
        >
          <Link href={`/agents/${profile.id}`} target="_blank">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            {t.viewPublicProfile}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function GracePeriodBar({ profile, t }: { profile: AgentProfile; t: T }) {
  const cap = profile.freeListingCap ?? 10;
  const activeCount = profile.properties?.length ?? 0;
  const pct = Math.min(100, Math.round((activeCount / cap) * 100));
  const isPro = profile.plan === "PRO" || profile.plan === "AGENCY";

  if (isPro) {
    return (
      <div className="bg-card rounded-2xl shadow-sm p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{t.kpiProLabel}</p>
          <p className="text-xs text-muted-foreground">{t.kpiProSubtitle}</p>
        </div>
      </div>
    );
  }

  if (!profile.graceEndsAt) return null;

  const grace = formatGracePeriod(profile.graceEndsAt, t);

  return (
    <div
      className={`bg-card rounded-2xl shadow-sm p-5 border ${
        grace.expired
          ? "border-destructive/30"
          : grace.endingSoon
            ? "border-amber-300"
            : "border-emerald-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
              grace.expired
                ? "bg-destructive"
                : grace.endingSoon
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          />
          <div>
            <p
              className={`text-sm font-semibold ${
                grace.expired
                  ? "text-destructive"
                  : grace.endingSoon
                    ? "text-amber-700"
                    : "text-emerald-700"
              }`}
            >
              {grace.expired
                ? t.gracePeriodExpired
                : grace.endingSoon
                  ? t.gracePeriodEndingSoon.replace(
                      "{days}",
                      String(grace.daysLeft),
                    )
                  : t.gracePeriodActive}
            </p>
            {!grace.expired && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {grace.label}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs"
          asChild
        >
          <Link href="/plans">{t.proCta}</Link>
        </Button>
      </div>

      {/* Progress bar — listings used */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.kpiListings}</span>
          <span className="font-medium text-foreground">
            {activeCount} / {cap}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 80
                ? "bg-destructive"
                : pct >= 60
                  ? "bg-amber-500"
                  : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {profile.graceEndsAt && (
          <p className="text-xs text-muted-foreground">
            {t.expiresOn}{" "}
            <span className="font-medium text-foreground">
              {formatDate(profile.graceEndsAt)}
            </span>
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        {t.gracePeriodUpgrade}
      </p>
    </div>
  );
}

// Replaces the old multi-banner NotificationStrip with a single checklist card.
function TodoCard({ profile, t }: { profile: AgentProfile; t: T }) {
  const isPending = profile.verificationTier === "NON_VERIFIE";
  const profileIncomplete =
    !profile.bio && (!profile.communes || profile.communes.length === 0);
  const hasListings = (profile.properties?.length ?? 0) > 0;

  const items: {
    text: string;
    ctaLabel: string;
    ctaHref: string;
    warn?: boolean;
  }[] = [];

  if (profileIncomplete) {
    items.push({
      text: t.todoCompleteProfile,
      ctaLabel: t.notifIncompleteLink,
      ctaHref: "/espace-agent/profil",
    });
  }

  if (!hasListings) {
    items.push({
      text: t.todoCreateListing,
      ctaLabel: t.todoCreateListingCta,
      ctaHref: "/espace-agent/annonces/nouvelle",
    });
  }

  if (profile.graceEndsAt) {
    const daysLeft = Math.floor(
      (new Date(profile.graceEndsAt).getTime() - Date.now()) / 86400000,
    );
    if (daysLeft > 0 && daysLeft <= 30) {
      items.push({
        text: t.notifGraceEnding.replace("{days}", String(daysLeft)),
        ctaLabel: t.notifGraceEndingCta,
        ctaHref: "/plans",
        warn: true,
      });
    }
  }

  // Nothing to show at all
  if (items.length === 0 && !isPending) return null;

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="px-4 py-3 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
          {t.todoCardTitle}
        </p>
      </div>

      <div className="divide-y divide-border">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 ${item.warn ? "bg-amber-50/60 dark:bg-amber-950/20" : ""}`}
          >
            {/* Checkbox visual */}
            <div className="w-4 h-4 rounded border border-muted-foreground/30 flex-shrink-0" />
            <span
              className={`flex-1 text-sm ${item.warn ? "text-amber-800 dark:text-amber-300" : "text-foreground"}`}
            >
              {item.text}
            </span>
            <Link
              href={item.ctaHref}
              className="text-xs text-primary font-semibold hover:underline whitespace-nowrap shrink-0"
            >
              {item.ctaLabel} →
            </Link>
          </div>
        ))}

        {/* Pending status row — always shown while account is pending */}
        {isPending && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {t.todoPendingStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PendingPrompt({ t }: { t: T }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <User className="w-6 h-6 text-primary" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">
        {t.pendingPromptTitle}
      </p>
      <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto leading-relaxed">
        {t.pendingPromptBody}
      </p>
      <Button size="sm" asChild>
        <Link href="/espace-agent/profil">{t.pendingPromptCta}</Link>
      </Button>
    </div>
  );
}

function KpiCards({ profile, t }: { profile: AgentProfile; t: T }) {
  const isPro = profile.plan === "PRO" || profile.plan === "AGENCY";
  const activeListings = profile.properties?.length ?? 0;
  const totalViews =
    profile.properties?.reduce((s, p) => s + (p.viewCount ?? 0), 0) ?? 0;
  const communes = profile.communes ?? [];

  const cards = [
    {
      icon: <Home className="w-4 h-4" />,
      value: activeListings,
      label: t.kpiListings,
      sub: activeListings === 0 ? t.kpiSubFirst : null,
      locked: false,
    },
    {
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      value: 0,
      label: t.kpiWhatsapp,
      sub: t.kpiThisMonth,
      locked: false,
    },
    {
      icon: <Eye className="w-4 h-4" />,
      value: totalViews,
      label: t.kpiViews,
      sub: t.kpiThisMonth,
      locked: !isPro,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      value: communes.length > 0 ? null : "—",
      listValue: communes.slice(0, 2),
      overflow: communes.length > 2 ? communes.length - 2 : 0,
      label: t.kpiCommunes,
      locked: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card rounded-xl shadow-sm p-4 text-center relative"
        >
          {card.locked && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5">
                <Lock className="w-2.5 h-2.5" /> {t.kpiPro}
              </span>
            </div>
          )}
          <div className="flex justify-center mb-1.5 text-primary">
            {card.icon}
          </div>
          {card.locked ? (
            <p className="text-xl font-semibold text-muted-foreground/40">—</p>
          ) : card.listValue && card.listValue.length > 0 ? (
            <div className="space-y-0.5">
              {card.listValue.map((v) => (
                <p key={v} className="text-sm font-medium leading-tight">
                  {v}
                </p>
              ))}
              {card.overflow > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{card.overflow}
                </p>
              )}
            </div>
          ) : (
            <p
              className={`text-2xl font-semibold ${card.locked ? "text-muted-foreground/40" : ""}`}
            >
              {card.value ?? "—"}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          {card.sub && !card.listValue && card.value === 0 && (
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ActionSection({ t }: { t: T }) {
  const actions = [
    {
      icon: <Home className="w-4 h-4" />,
      label: t.manageListings,
      href: "/espace-agent/annonces",
      locked: false,
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: t.boostListing,
      href: "/espace-agent/boosts",
      locked: false,
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t.editProfileAction,
      href: "/espace-agent/profil",
      locked: false,
    },
    {
      icon: <ExternalLink className="w-4 h-4" />,
      label: t.viewPublicPage,
      href: "#",
      locked: false,
      external: true,
    },
    {
      icon: <BarChart2 className="w-4 h-4" />,
      label: t.statsAction,
      href: "/plans",
      locked: true,
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: t.contactOkapi,
      href: "/contact",
      locked: false,
    },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-border">
        <h2 className="font-semibold text-sm">{t.actionsTitle}</h2>
      </div>

      {/* Primary CTA */}
      <div className="px-4 py-4 border-b border-border">
        <Button
          size="sm"
          className="w-full justify-start gap-2 text-xs whitespace-nowrap"
          asChild
        >
          <Link href="/espace-agent/annonces/nouvelle">
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            {t.publishListing}
          </Link>
        </Button>
      </div>

      {/* Secondary actions */}
      {actions.map((a) => (
        <Link
          key={a.label}
          href={a.locked ? "/plans" : a.href}
          className="flex items-center gap-3 px-6 py-3.5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
        >
          <span
            className={a.locked ? "text-muted-foreground/40" : "text-primary"}
          >
            {a.icon}
          </span>
          <span
            className={`flex-1 text-sm ${a.locked ? "text-muted-foreground/60" : ""}`}
          >
            {a.label}
          </span>
          {a.locked ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              <Lock className="w-2.5 h-2.5" /> {t.kpiPro}
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </Link>
      ))}
    </div>
  );
}

function ListingsSection({
  properties,
  t,
}: {
  properties?: AgentProperty[];
  t: T;
}) {
  const recent = (properties ?? []).slice(0, 5);

  const statusLabel: Record<string, { label: string; color: string }> = {
    open: {
      label: t.statusActive,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    published: {
      label: t.statusActive,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    active: {
      label: t.statusActive,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    draft: {
      label: t.statusDraft,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    pending: {
      label: t.statusPending,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    closed: {
      label: t.statusClosed,
      color: "text-muted-foreground bg-muted border-border",
    },
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm">{t.listingsTitle}</h2>
        {recent.length > 0 && (
          <Link
            href="/espace-agent/annonces"
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            {t.viewAll} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">{t.noListings}</p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
            {t.noListingsBody}
          </p>
          <Button size="sm" asChild>
            <Link href="/espace-agent/annonces/nouvelle">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t.publishFirstListing}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {recent.map((p) => {
            const st = statusLabel[p.status] ?? {
              label: p.status,
              color: "text-muted-foreground bg-muted border-border",
            };
            const location = [p.suburb ?? p.neighborhood, p.city]
              .filter(Boolean)
              .join(" · ");
            const thumb = p.gallery?.[0];
            return (
              <div key={p.id} className="px-4 py-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border">
                    <PropertyThumb src={thumb} category={p.category} title={p.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-medium cursor-help ${st.color}`}
                        title={
                          p.status === "pending"
                            ? "En cours de vérification — visible sous 24h"
                            : undefined
                        }
                      >
                        {st.label}
                      </span>
                    </div>
                    {location && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {location}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {p.viewCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {p.viewCount} {t.views}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pl-[68px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    asChild
                  >
                    <Link href={`/espace-agent/annonces/${p.id}/modifier`}>
                      <Pencil className="w-3 h-3 mr-1" /> {t.editBtn}
                    </Link>
                  </Button>
                  <Link
                    href={`/espace-agent/boosts?propertyId=${p.id}&title=${encodeURIComponent(p.title ?? "")}`}
                    className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm shadow-amber-200 hover:shadow-amber-300 hover:from-amber-500 hover:to-orange-500 transition-all duration-200"
                  >
                    <Zap className="w-3 h-3 fill-white" /> {t.boostBtn}
                  </Link>
                  {p.status === "draft" && (
                    <Button size="sm" className="text-xs h-7 px-2.5" asChild>
                      <Link href={`/espace-agent/annonces/${p.id}/publier`}>
                        {t.publishBtn}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EspaceAgentPage() {
  const router = useRouter();
  const {
    token,
    agent: sessionAgent,
    logout: _logout,
  } = useAgentSessionStore();
  const t = useT().espaceAgent;
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hydrated = useMounted();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/connexion-agent");
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!token) return;
    getMyAgentProfile(token)
      .then(setProfile)
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 401) {
          _logout();
          router.replace("/connexion-agent");
        }
      })
      .finally(() => setLoading(false));
  }, [token, _logout, router]);

  if (!hydrated || !token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const agent = profile ?? (sessionAgent as AgentProfile | null);
  if (!agent) return null;

  const initials = agent.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-muted overflow-x-hidden">
      <main className="w-full max-w-[1400px] mx-auto px-4 py-6">
        {/* ── Mobile: single column ── */}
        <div className="flex flex-col gap-5 md:hidden">
          <ProfileSection profile={agent} initials={initials} t={t} />
          <GracePeriodBar profile={agent} t={t} />
          <TodoCard profile={agent} t={t} />
          {agent.verificationTier === "NON_VERIFIE" ? (
            <PendingPrompt t={t} />
          ) : (
            <KpiCards profile={agent} t={t} />
          )}
          <ActionSection t={t} />
          <ListingsSection properties={agent.properties} t={t} />
        </div>

        {/* ── Tablet + Desktop: multi-column grid ── */}
        {/* md: 2-col [sidebar | main]   lg: 3-col [sidebar | main | actions] */}
        <div className="hidden md:grid md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr_260px] gap-5 items-start">
          {/* LEFT sidebar */}
          <div className="flex flex-col gap-4 min-w-0">
            <ProfileSection profile={agent} initials={initials} t={t} />
            <GracePeriodBar profile={agent} t={t} />
            <TodoCard profile={agent} t={t} />
          </div>

          {/* CENTER column */}
          <div className="flex flex-col gap-4 min-w-0">
            {agent.verificationTier === "NON_VERIFIE" ? (
              <PendingPrompt t={t} />
            ) : (
              <KpiCards profile={agent} t={t} />
            )}
            <ListingsSection properties={agent.properties} t={t} />
            {/* ActionSection moves here on tablet (< lg) */}
            <div className="lg:hidden">
              <ActionSection t={t} />
            </div>
          </div>

          {/* RIGHT sidebar — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 min-w-0">
            <ActionSection t={t} />
          </div>
        </div>
      </main>
    </div>
  );
}
