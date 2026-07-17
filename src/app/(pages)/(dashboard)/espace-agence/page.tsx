"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Globe,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Lock,
  Eye,
  Home,
  Star,
  PlusCircle,
  Settings,
  BarChart2,
  Pencil,
  Zap,
  ExternalLink,
  Users,
  Copy,
  MoreVertical,
  Clock,
  Shield,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";
import { useT } from "@/i18n/useT";

// ─── Types ────────────────────────────────────────────────────────────────────

type Agency = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  communes: string[];
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rccmNumber?: string;
  gracePeriodEndsAt?: string;
  freeListingCap: number;
  listingCount: number;
  agentCount: number;
  founded?: number;
  description?: string;
};

type TeamAgent = {
  id: string;
  name: string;
  email?: string;
  verificationTier: "NON_VERIFIE" | "VERIFIE";
  communes?: string[];
  photoUrl?: string;
  properties?: { id: string }[];
};

type AgencyProperty = {
  id: string;
  title: string;
  status: string;
  suburb?: string;
  neighborhood?: string;
  city?: string;
  viewCount?: number;
  listingType?: string;
  agent?: { id: string; name: string };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatGracePeriod(graceEndsAt: string): {
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
      label: "Période gratuite expirée",
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
    label: `Période gratuite active — ${parts.join(" et ")} restants`,
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

function agencyInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgencyHeader({
  agency,
  t,
}: {
  agency: Agency;
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const isVerified = agency.verificationStatus === "APPROVED";
  const hasRccm = !!agency.rccmNumber;
  const initials = agencyInitials(agency.name);
  const visibleCommunes = (agency.communes ?? []).slice(0, 3);
  const extraCommunes = Math.max(0, (agency.communes?.length ?? 0) - 3);

  return (
    <div className="bg-card rounded-2xl shadow-sm p-5">
      {/* Top: logo + name + badge */}
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          {agency.logoUrl?.startsWith("https://") &&
          agency.logoUrl.length > 30 ? (
            <Image
              src={agency.logoUrl}
              alt={agency.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl object-cover border-2 border-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-border">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold leading-tight truncate">
            {agency.name}
          </h1>
          {isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 font-medium mt-1">
              <Shield className="w-3 h-3" /> {t.verifiedBadge}
            </span>
          )}
          {hasRccm && (
            <div
              className={`mt-1.5 inline-flex items-center gap-1 text-[11px] rounded-lg px-2 py-0.5 border font-medium ${
                isVerified
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <CheckCircle className="w-3 h-3 flex-shrink-0" />
              {isVerified ? t.rccmVerified : t.rccmPending}
            </div>
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

      {/* Contact details */}
      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {agency.email && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{agency.email}</span>
          </div>
        )}
        {agency.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{agency.phone}</span>
          </div>
        )}
        {agency.whatsapp && (
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3 h-3 flex-shrink-0 text-green-600" />
            <span>{agency.whatsapp}</span>
          </div>
        )}
        {agency.website && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {agency.website.replace(/^https?:\/\//, "")}
            </span>
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
          <Link href="/espace-agence/profil">
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
          <Link href={`/agences/${agency.id}`} target="_blank">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            {t.viewPublicProfile}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function GracePeriodBar({
  agency,
  t,
}: {
  agency: Agency;
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  if (!agency.gracePeriodEndsAt) return null;

  const grace = formatGracePeriod(agency.gracePeriodEndsAt);
  const cap = agency.freeListingCap ?? 10;
  const activeCount = agency.listingCount ?? 0;
  const agentCount = agency.agentCount ?? 0;
  const pct = Math.min(100, Math.round((activeCount / cap) * 100));

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
                : grace.label}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs"
          asChild
        >
          <Link href="/plans">{t.planAgence}</Link>
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {/* Listings progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.listingsProgress}</span>
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
        </div>

        {/* Agents count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.agentsActive}</span>
          <span className="font-medium text-foreground">
            {agentCount} / {t.unlimited}
          </span>
        </div>

        {/* Expiry */}
        {!grace.expired && (
          <p className="text-xs text-muted-foreground">
            {t.expiresOn}{" "}
            <span className="font-medium text-foreground">
              {formatDate(agency.gracePeriodEndsAt)}
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

function NotificationStrip({
  agency,
  teamAgents,
  t,
}: {
  agency: Agency;
  teamAgents: TeamAgent[];
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const notices: {
    type: "warn" | "info" | "alert";
    text: string;
    cta?: { label: string; href: string };
  }[] = [];

  // RCCM not uploaded
  if (!agency.rccmNumber) {
    notices.push({
      type: "warn",
      text: t.notifRccm,
      cta: { label: t.notifRccmCta, href: "/espace-agence/profil#rccm" },
    });
  }

  // Agents pending verification
  const pendingAgents = teamAgents.filter(
    (a) => a.verificationTier === "NON_VERIFIE",
  );
  pendingAgents.forEach((a) => {
    notices.push({
      type: "info",
      text: t.notifAgentPending.replace("{name}", a.name),
    });
  });

  // Approaching listing cap
  const cap = agency.freeListingCap ?? 10;
  const count = agency.listingCount ?? 0;
  if (count >= cap - 1 && count < cap) {
    notices.push({
      type: "alert",
      text: t.notifListingCap
        .replace("{count}", String(count))
        .replace("{cap}", String(cap)),
      cta: { label: t.notifListingCapCta, href: "/plans" },
    });
  }

  // Grace period ending
  if (agency.gracePeriodEndsAt) {
    const daysLeft = Math.floor(
      (new Date(agency.gracePeriodEndsAt).getTime() - Date.now()) / 86400000,
    );
    if (daysLeft > 0 && daysLeft <= 30) {
      notices.push({
        type: "info",
        text: t.notifGraceEnding.replace("{days}", String(daysLeft)),
        cta: { label: t.notifGraceEndingCta, href: "/plans" },
      });
    }
  }

  if (notices.length === 0) return null;

  return (
    <div className="space-y-2">
      {notices.map((n, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
            n.type === "alert"
              ? "bg-red-50 border-red-200 text-red-800"
              : n.type === "warn"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="flex-1">{n.text}</p>
          {n.cta && (
            <Link
              href={n.cta.href}
              className="underline underline-offset-2 whitespace-nowrap font-medium"
            >
              {n.cta.label} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function KpiCards({
  agency,
  teamAgents,
  t,
}: {
  agency: Agency;
  teamAgents: TeamAgent[];
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const cards = [
    {
      icon: <Home className="w-4 h-4" />,
      value: agency.listingCount ?? 0,
      label: t.kpiListings,
      locked: false,
    },
    {
      icon: <Users className="w-4 h-4" />,
      value: teamAgents.length,
      label: t.kpiAgents,
      locked: false,
    },
    {
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      value: 0,
      sub: t.kpiThisMonth,
      label: t.kpiWhatsapp,
      locked: false,
    },
    {
      icon: <Eye className="w-4 h-4" />,
      value: 0,
      sub: t.kpiThisMonth,
      label: t.kpiViews,
      locked: true,
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
          <p
            className={`text-2xl font-semibold ${card.locked ? "text-muted-foreground/40" : ""}`}
          >
            {card.locked ? "—" : card.value.toLocaleString("fr-FR")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          {card.sub && !card.locked && (
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TeamSection({
  agency,
  teamAgents,
  onCopyInviteLink,
  t,
}: {
  agency: Agency;
  teamAgents: TeamAgent[];
  onCopyInviteLink: () => void;
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  const agencySlug = agency.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const inviteLink = `okapi.cd/rejoindre/${agencySlug}`;

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          {t.teamTitle}
        </h2>
        <Button size="sm" className="text-xs gap-1.5" asChild>
          <Link href="/espace-agence/agents/ajouter">
            <UserPlus className="w-3.5 h-3.5" />
            {t.addAgent}
          </Link>
        </Button>
      </div>

      {teamAgents.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">{t.noTeam}</p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto leading-relaxed">
            {t.noTeamBody}
          </p>
          <Button size="sm" asChild>
            <Link href="/espace-agence/agents/ajouter">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              {t.addFirstAgent}
            </Link>
          </Button>

          {/* Invite link */}
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {t.invitePrompt}
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <span className="text-xs font-mono flex-1 text-left truncate">
                {inviteLink}
              </span>
              <button
                type="button"
                onClick={onCopyInviteLink}
                className="flex-shrink-0 text-primary hover:text-primary/80"
                title={t.copyLink}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="divide-y divide-border" ref={menuRef}>
            {teamAgents.map((agent) => {
              const isVerified = agent.verificationTier === "VERIFIE";
              const initials = agent.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const listingCount = agent.properties?.length ?? 0;

              return (
                <div key={agent.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {agent.photoUrl?.startsWith("https://") &&
                      agent.photoUrl.length > 30 ? (
                        <Image
                          src={agent.photoUrl}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold border border-border">
                          {agent.name
                            .split(" ")
                            .map((w: string) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{agent.name}</p>
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5">
                            <CheckCircle className="w-2.5 h-2.5" />{" "}
                            {t.agentVerified}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5">
                            <Clock className="w-2.5 h-2.5" /> {t.agentPending}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {listingCount} annonce{listingCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {agent.communes && agent.communes.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          📍 {agent.communes.join(" · ")}
                        </p>
                      )}
                    </div>

                    {/* ⋮ menu */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === agent.id ? null : agent.id,
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === agent.id && (
                        <div className="absolute right-0 top-8 z-20 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                          {[
                            {
                              icon: <Eye className="w-3.5 h-3.5" />,
                              label: t.menuViewProfile,
                              href: `/agents/${agent.id}`,
                            },
                            {
                              icon: <Pencil className="w-3.5 h-3.5" />,
                              label: t.menuEdit,
                              href: `/espace-agence/agents/${agent.id}/modifier`,
                            },
                            {
                              icon: <Copy className="w-3.5 h-3.5" />,
                              label: t.menuCopyLink,
                              action: () => {
                                navigator.clipboard.writeText(
                                  `okapi.cd/agents/${agent.id}`,
                                );
                                setOpenMenuId(null);
                              },
                            },
                            {
                              icon: (
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              ),
                              label: t.menuReport,
                              href: `/contact?agent=${agent.id}`,
                            },
                            {
                              icon: (
                                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                              ),
                              label: t.menuRemove,
                              href: `/espace-agence/agents/${agent.id}/retirer`,
                              danger: true,
                            },
                          ].map((item, idx) =>
                            item.action ? (
                              <button
                                key={idx}
                                type="button"
                                onClick={item.action}
                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-muted text-left"
                              >
                                <span className="text-muted-foreground">
                                  {item.icon}
                                </span>
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                key={idx}
                                href={item.href!}
                                onClick={() => setOpenMenuId(null)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted ${item.danger ? "text-destructive" : ""}`}
                              >
                                <span
                                  className={
                                    item.danger
                                      ? "text-destructive"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {item.icon}
                                </span>
                                {item.label}
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-2 mt-3 ml-[52px]">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2.5"
                      asChild
                    >
                      <Link href={`/agents/${agent.id}`}>{t.viewListings}</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Invite link strip */}
          <div className="px-6 py-4 border-t border-border bg-muted/40">
            <p className="text-xs text-muted-foreground mb-2">
              {t.inviteShare}
            </p>
            <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-3 py-2">
              <span className="text-xs font-mono flex-1 truncate">
                {inviteLink}
              </span>
              <button
                type="button"
                onClick={onCopyInviteLink}
                className="flex-shrink-0 text-primary hover:text-primary/80"
                title={t.copyLink}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActionSection({
  agency,
  t,
}: {
  agency: Agency;
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const agencyId = agency.id;

  const actions = [
    {
      icon: <UserPlus className="w-4 h-4" />,
      label: t.addAgentAction,
      href: "/espace-agence/agents/ajouter",
      locked: false,
    },
    {
      icon: <Home className="w-4 h-4" />,
      label: t.manageListings,
      href: `/espace-agence/annonces`,
      locked: false,
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: t.boostListing,
      href: "/espace-agence/boost",
      locked: false,
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t.editProfileAction,
      href: "/espace-agence/profil",
      locked: false,
    },
    {
      icon: <ExternalLink className="w-4 h-4" />,
      label: t.viewPublicPage,
      href: `/agences/${agencyId}`,
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
          <Link href="/espace-agence/annonces/nouvelle">
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            {t.publishListing}
          </Link>
        </Button>
      </div>

      {actions.map((a) => (
        <Link
          key={a.label}
          href={a.locked ? "/plans" : a.href}
          target={a.external ? "_blank" : undefined}
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
              <Lock className="w-2.5 h-2.5" /> {t.planAgence.replace(" →", "")}
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
  teamAgents,
  t,
}: {
  properties: AgencyProperty[];
  teamAgents: TeamAgent[];
  t: ReturnType<typeof useT>["espaceAgence"];
}) {
  const [filterAgentId, setFilterAgentId] = useState<string>("all");
  const recent = properties
    .filter((p) => filterAgentId === "all" || p.agent?.id === filterAgentId)
    .slice(0, 6);

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
        <h2 className="font-semibold text-sm">{t.recentListings}</h2>
        {properties.length > 0 && (
          <Link
            href="/espace-agence/annonces"
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            {t.viewAll} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Agent filter */}
      {teamAgents.length > 0 && properties.length > 0 && (
        <div className="px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {t.filterByAgent}
            </span>
            {[{ id: "all", name: t.allAgents }, ...teamAgents].map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setFilterAgentId(a.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filterAgentId === a.id
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">{t.noListings}</p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
            {t.noListingsBody}
          </p>
          <Button size="sm" asChild>
            <Link href="/espace-agence/annonces/nouvelle">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t.publishListing}
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
            return (
              <div key={p.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    {p.agent && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.by}{" "}
                        <span className="font-medium">{p.agent.name}</span>
                        {location && ` · ${location}`}
                      </p>
                    )}
                    {p.viewCount !== undefined && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {p.viewCount} {t.views}
                      </p>
                    )}
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
                    <Link href={`/espace-agence/boost?id=${p.id}`}>
                      <Zap className="w-3 h-3 mr-1" /> {t.boostBtn}
                    </Link>
                  </Button>
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

export default function EspaceAgencePage() {
  const router = useRouter();
  const {
    token,
    agent: sessionAgent,
    logout: _logout,
  } = useAgentSessionStore();
  const tAll = useT();
  const t = tAll.espaceAgence;
  const [ownerProfile, setOwnerProfile] = useState<{ agency: Agency } | null>(
    null,
  );
  const [teamAgents, setTeamAgents] = useState<TeamAgent[]>([]);
  const [recentProperties, setRecentProperties] = useState<AgencyProperty[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const hydrated = useMounted();

  // Guard: redirect if no session (only after Zustand persist rehydrates)
  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/connexion-agent");
  }, [hydrated, token, router]);

  // Fetch all data
  useEffect(() => {
    if (!token) return;

    const agencyId = sessionAgent?.agencyId;
    if (!agencyId) {
      // Not an agency owner — go to agent portal
      router.replace("/espace-agent");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      getMyAgentProfile(token),
      axios.get(`/api/proxy/agents?agencyId=${agencyId}&limit=50`, { headers }),
      axios.get(`/api/proxy/properties?agencyId=${agencyId}&limit=10`, {
        headers,
      }),
    ])
      .then(([profile, agentsRes, propertiesRes]) => {
        setOwnerProfile(profile);
        setTeamAgents(agentsRes.data?.data ?? []);
        setRecentProperties(
          propertiesRes.data?.data ?? propertiesRes.data ?? [],
        );
      })
      .catch((err: { response?: { status?: number } }) => {
        if (err?.response?.status === 401) {
          _logout();
          router.replace("/connexion-agent");
        }
      })
      .finally(() => setLoading(false));
  }, [token, sessionAgent?.agencyId, _logout, router]);

  function handleCopyInviteLink() {
    const agencyName = ownerProfile?.agency?.name ?? "";
    const slug = agencyName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigator.clipboard.writeText(`okapi.cd/rejoindre/${slug}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  if (!hydrated || !token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const agency = ownerProfile?.agency;
  if (!agency) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Copy success toast */}
      {copySuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm px-4 py-2 rounded-lg shadow-lg">
          {t.linkCopied}
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* ── Mobile: single column stacked ── */}
        <div className="flex flex-col gap-5 lg:hidden">
          <AgencyHeader agency={agency} t={t} />
          <GracePeriodBar agency={agency} t={t} />
          <NotificationStrip agency={agency} teamAgents={teamAgents} t={t} />
          <KpiCards agency={agency} teamAgents={teamAgents} t={t} />
          <TeamSection
            agency={agency}
            teamAgents={teamAgents}
            onCopyInviteLink={handleCopyInviteLink}
            t={t}
          />
          <ActionSection agency={agency} t={t} />
          <ListingsSection
            properties={recentProperties}
            teamAgents={teamAgents}
            t={t}
          />
        </div>

        {/* ── Desktop: 3-column grid ── */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr_300px] lg:gap-5 lg:items-start">
          {/* LEFT sidebar */}
          <div className="flex flex-col gap-4 min-w-0">
            <AgencyHeader agency={agency} t={t} />
            <GracePeriodBar agency={agency} t={t} />
            <NotificationStrip agency={agency} teamAgents={teamAgents} t={t} />
          </div>

          {/* CENTER column */}
          <div className="flex flex-col gap-4 min-w-0">
            <KpiCards agency={agency} teamAgents={teamAgents} t={t} />
            <TeamSection
              agency={agency}
              teamAgents={teamAgents}
              onCopyInviteLink={handleCopyInviteLink}
              t={t}
            />
            <p className="text-center text-xs text-muted-foreground pb-2">
              {t.comingSoon}
            </p>
          </div>

          {/* RIGHT sidebar */}
          <div className="flex flex-col gap-4 min-w-0">
            <ActionSection agency={agency} t={t} />
            <ListingsSection
              properties={recentProperties}
              teamAgents={teamAgents}
              t={t}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
