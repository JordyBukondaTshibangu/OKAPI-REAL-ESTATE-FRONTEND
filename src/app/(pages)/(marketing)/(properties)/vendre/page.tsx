"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useT } from "@/i18n/useT";
import { useAgentSessionStore } from "@/store/useAgentSessionStore";
import { getMyAgentProfile } from "@/services/agentAuth";

// ── Types ─────────────────────────────────────────────────────────────────────

type AgentPlan = "FREE" | "PRO" | "AGENCY";

type AgentProfile = {
  plan: AgentPlan;
  graceEndsAt: string | null;
  properties?: { status: string }[];
};

type TierId = "gratuit" | "pro" | "agence";

type Tier = {
  id: TierId;
  name: string;
  price: string | null;
  priceNote: string;
  sub?: string;
  blurb: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
  dark?: boolean;
  cta: string;
  ctaHref: string;
  boostNote: string;
};

type BoostOption = {
  price: string;
  label: string;
  recommended: boolean;
};

type CtaVariant = "primary" | "secondary" | "current" | "destructive" | "disabled" | "default";

// ── Plan status banner ────────────────────────────────────────────────────────

function PlanBanner({ profile }: { profile: AgentProfile }) {
  const p = useT().pages.sell;
  const { plan, graceEndsAt } = profile;

  if (plan === "PRO") {
    return (
      <div className="max-w-5xl mx-auto px-6 mb-2">
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            {p.planBannerProActive}
          </p>
        </div>
      </div>
    );
  }

  if (plan === "AGENCY") {
    return (
      <div className="max-w-5xl mx-auto px-6 mb-2">
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            {p.planBannerAgencyActive}
          </p>
        </div>
      </div>
    );
  }

  // FREE plan — check grace period
  const now = new Date();
  const graceEnd = graceEndsAt ? new Date(graceEndsAt) : null;
  const daysLeft = graceEnd
    ? Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const liveCount = (profile.properties ?? []).filter((prop) => prop.status === "LIVE").length;

  if (!graceEnd || daysLeft <= 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 mb-2">
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {p.planBannerGraceExpired}
            {liveCount >= 10 && <span> {p.planBannerGraceExpiredCapReached.replace("{count}", String(liveCount))}</span>}
            {" "}{p.planBannerGraceExpiredUpgrade}
          </p>
        </div>
      </div>
    );
  }

  if (daysLeft <= 30) {
    return (
      <div className="max-w-5xl mx-auto px-6 mb-2">
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {p.planBannerGraceExpiring.replace("{days}", String(daysLeft))}
          </p>
        </div>
      </div>
    );
  }

  // Active grace — > 30 days left
  return (
    <div className="max-w-5xl mx-auto px-6 mb-2">
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          {p.planBannerGraceActive.replace("{days}", String(daysLeft))}
        </p>
      </div>
    </div>
  );
}

// ── TierCard ──────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  ctaVariant = "default",
  ctaLabel,
  ctaHref,
}: {
  tier: Tier;
  ctaVariant?: CtaVariant;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const { highlight, dark } = tier;

  const cardClass = dark
    ? "bg-[#0d1b3e] text-white ring-2 ring-[#0d1b3e]"
    : highlight
    ? "bg-card ring-2 ring-primary"
    : "bg-card ring-1 ring-border";

  const nameColor  = dark ? "text-white" : "text-foreground";
  const priceColor = dark ? "text-white" : highlight ? "text-primary" : "text-foreground";
  const noteColor  = dark ? "text-white/60" : "text-muted-foreground";
  const blurbColor = dark ? "text-white/70" : "text-muted-foreground";
  const checkColor = dark ? "text-emerald-400" : "text-emerald-500";
  const featColor  = dark ? "text-white/90" : "text-foreground";
  const boostColor = dark ? "text-yellow-400" : "text-amber-500";
  const divColor   = dark ? "border-white/10" : "border-border";

  // Resolve CTA
  const resolvedLabel = ctaLabel ?? tier.cta;
  const resolvedHref  = ctaHref  ?? tier.ctaHref;

  let ctaClass: string;
  let ctaContent: React.ReactNode;
  let isClickable = true;

  switch (ctaVariant) {
    case "current":
      isClickable = false;
      ctaClass = dark
        ? "bg-white/10 text-white/50"
        : "bg-muted text-muted-foreground";
      ctaContent = <><Check className="w-4 h-4" /> {resolvedLabel}</>;
      break;

    case "destructive":
      ctaClass = "bg-transparent border border-destructive/50 text-destructive hover:bg-destructive/5";
      ctaContent = <>{resolvedLabel} <ArrowRight className="w-4 h-4" /></>;
      break;

    case "disabled":
      isClickable = false;
      ctaClass = dark
        ? "bg-white/5 text-white/30"
        : "bg-muted/50 text-muted-foreground/50";
      ctaContent = <span className="text-lg">—</span>;
      break;

    case "primary":
      ctaClass = "bg-primary text-primary-foreground hover:bg-primary/90";
      ctaContent = <>{resolvedLabel} <ArrowRight className="w-4 h-4" /></>;
      break;

    case "secondary":
      ctaClass = "bg-background border border-border text-foreground hover:bg-muted";
      ctaContent = <>{resolvedLabel} <ArrowRight className="w-4 h-4" /></>;
      break;

    default:
      // Original style — based on card variant
      ctaClass = dark
        ? "bg-white text-[#0d1b3e] hover:bg-white/90"
        : highlight
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-background border border-border text-foreground hover:bg-muted";
      ctaContent = <>{resolvedLabel} <ArrowRight className="w-4 h-4" /></>;
  }

  return (
    <div className={`relative flex flex-col rounded-2xl shadow-sm overflow-hidden ${cardClass}`}>
      {/* Popular badge */}
      {tier.badge && (
        <div className="absolute top-0 left-0 z-10 overflow-hidden w-32 h-32 pointer-events-none">
          <div className="absolute top-6 -left-9 w-44 rotate-[-45deg] bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider text-center py-1 shadow">
            {tier.badge}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-8 pb-6 text-center">
        <h3 className={`text-2xl font-semibold ${nameColor}`}>{tier.name}</h3>

        {tier.price ? (
          <div className="mt-4">
            <span className={`text-4xl font-bold ${priceColor}`}>{tier.price}</span>
            <span className={`ml-1.5 text-sm ${noteColor}`}>{tier.priceNote}</span>
          </div>
        ) : (
          <div className="mt-4">
            <span className={`text-3xl font-bold ${priceColor}`}>{tier.priceNote}</span>
          </div>
        )}

        {/* Cap note — more prominent styling */}
        {tier.sub && (
          <p className={`mt-2.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full inline-block ${
            dark
              ? "text-yellow-300 bg-yellow-900/30"
              : "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30"
          }`}>
            {tier.sub}
          </p>
        )}

        <p className={`mt-4 text-sm leading-relaxed ${blurbColor}`}>{tier.blurb}</p>
      </div>

      {/* Features */}
      <div className={`flex-1 px-6 pb-6 border-t ${divColor}`}>
        <ul className="mt-5 space-y-3">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${checkColor}`} />
              <span className={featColor}>{f}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-5 flex items-start gap-2 text-xs ${boostColor}`}>
          <Star className="w-3.5 h-3.5 mt-0.5 shrink-0 fill-current" />
          <span>{tier.boostNote}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-7 pt-2">
        {isClickable ? (
          <Link
            href={resolvedHref}
            className={`flex items-center justify-center gap-2 w-full rounded-full h-11 text-sm font-semibold transition-colors ${ctaClass}`}
          >
            {ctaContent}
          </Link>
        ) : (
          <div className={`flex items-center justify-center gap-2 w-full rounded-full h-11 text-sm font-semibold ${ctaClass}`}>
            {ctaContent}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTierCta(
  tierId: TierId,
  agentPlan: AgentPlan | null,
  p: ReturnType<typeof useT>["pages"]["sell"],
): { ctaVariant?: CtaVariant; ctaLabel?: string; ctaHref?: string } {
  if (!agentPlan) return {};

  const planHref = "/espace-agent/plan";

  if (agentPlan === "FREE") {
    if (tierId === "gratuit") return { ctaVariant: "current",     ctaLabel: p.ctaCurrentPlan };
    if (tierId === "pro")     return { ctaVariant: "primary",     ctaLabel: p.ctaUpgradePro,    ctaHref: planHref };
    if (tierId === "agence")  return { ctaVariant: "secondary",   ctaLabel: p.ctaUpgradeAgency, ctaHref: planHref };
  }

  if (agentPlan === "PRO") {
    if (tierId === "gratuit") return { ctaVariant: "destructive", ctaLabel: p.ctaDowngrade,      ctaHref: planHref };
    if (tierId === "pro")     return { ctaVariant: "current",     ctaLabel: p.ctaCurrentPlan };
    if (tierId === "agence")  return { ctaVariant: "secondary",   ctaLabel: p.ctaUpgradeAgency, ctaHref: planHref };
  }

  if (agentPlan === "AGENCY") {
    if (tierId === "gratuit") return { ctaVariant: "disabled" };
    if (tierId === "pro")     return { ctaVariant: "disabled" };
    if (tierId === "agence")  return { ctaVariant: "primary",     ctaLabel: p.ctaManagePlan,    ctaHref: planHref };
  }

  return {};
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VendrePage() {
  const t = useT();
  const p = t.pages.sell;

  const { isAuthenticated: isAgentAuth, token } = useAgentSessionStore();
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    if (!isAgentAuth || !token) return;
    getMyAgentProfile(token)
      .then((data: AgentProfile) => setAgentProfile(data))
      .catch(() => {}); // fail silently — page renders fine without it
  }, [isAgentAuth, token]);

  const agentPlan: AgentPlan | null = agentProfile?.plan ?? null;

  const TIERS: Tier[] = [
    {
      id: "gratuit",
      name: p.tier1Name,
      price: null,
      priceNote: p.tier1PriceNote,
      sub: p.tier1Sub,
      blurb: p.tier1Blurb,
      features: [p.tier1Feat1, p.tier1Feat2, p.tier1Feat3, p.featWhatsApp, p.featDirectContact],
      cta: p.tier1Cta,
      ctaHref: "/devenir-agent",
      boostNote: p.boostNote,
    },
    {
      id: "pro",
      name: p.tier2Name,
      price: "$15",
      priceNote: p.tier2PriceNote,
      blurb: p.tier2Blurb,
      features: [p.featUnlimited, p.tier2Feat1, p.tier2Feat2, p.featWhatsApp, p.featDirectContact, p.featAnalytics],
      badge: p.tier2Badge,
      highlight: true,
      cta: p.tier2Cta,
      ctaHref: "/devenir-agent",
      boostNote: p.boostNote,
    },
    {
      id: "agence",
      name: p.tier3Name,
      price: "$50",
      priceNote: p.tier3PriceNote,
      blurb: p.tier3Blurb,
      features: [
        p.featUnlimited, p.tier3Feat1, p.featWhatsApp,
        p.featDirectContact, p.featAnalytics,
        p.tier3Feat2, p.tier3Feat3, p.tier3Feat4,
      ],
      dark: true,
      cta: p.tier3Cta,
      ctaHref: "/devenir-agent",
      boostNote: p.boostNote,
    },
  ];

  const BOOST_OPTIONS: BoostOption[] = [
    { price: "$5",  label: p.boost1Label, recommended: false },
    { price: "$9",  label: p.boost2Label, recommended: true  },
    { price: "$15", label: p.boost3Label, recommended: false },
  ];

  const TESTIMONIALS = [
    { quote: p.test1Quote, author: p.test1Author, role: p.test1Role },
    { quote: p.test2Quote, author: p.test2Author, role: p.test2Role },
  ];

  return (
    <div className="bg-background-alt">

      {/* ── Launch banner — hidden for signed-in agents ── */}
      {!isAgentAuth && (
        <div className="bg-emerald-50 border-b border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
          <div className="max-w-3xl mx-auto px-6 py-10 text-center">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              {p.bannerBadge}
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              {p.bannerHeading}
            </h2>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {[p.bannerBullet1, p.bannerBullet2, p.bannerBullet3].map((b, i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> {b}
                </li>
              ))}
            </ul>
            <Link
              href="/devenir-agent"
              className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-7 h-11 text-sm font-semibold transition-colors"
            >
              {p.bannerCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
          {p.heading}
        </h1>
        <p className="mt-3 text-muted-foreground text-base">{p.subheading}</p>
      </section>

      {/* ── Plan status banner (agents only) ── */}
      {isAgentAuth && agentProfile && (
        <section className="pt-6">
          <PlanBanner profile={agentProfile} />
        </section>
      )}

      {/* ── Tier cards ── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const cta = getTierCta(tier.id as TierId, agentPlan, p);
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                ctaVariant={cta.ctaVariant}
                ctaLabel={cta.ctaLabel}
                ctaHref={cta.ctaHref}
              />
            );
          })}
        </div>
      </section>

      {/* ── Boost section ── */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-foreground">{p.boostHeading}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {p.boostAvailable}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.boostDesc}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.boostPayment}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:flex-col md:w-52">
              {BOOST_OPTIONS.map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    opt.recommended
                      ? "border-amber-400 bg-amber-100/70 dark:bg-amber-900/30 dark:border-amber-600"
                      : "border-border bg-card hover:border-amber-300"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <input type="radio" name="boost" defaultChecked={opt.recommended} className="accent-amber-500" />
                    {opt.label}
                    {opt.recommended && (
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                        {p.boostRecommended}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="bg-background border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <blockquote
                key={i}
                className="bg-background-alt rounded-2xl px-7 py-7 border border-border"
              >
                <p className="text-foreground text-base leading-relaxed before:content-['\201C'] after:content-['\201D']">
                  {testimonial.quote}
                </p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats / Why ── */}
      <section className="bg-background-alt border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-foreground">{p.whyHeading}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-sm">{p.whyPara}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: p.stat1Value, label: p.stat1Label },
              { value: p.stat2Value, label: p.stat2Label },
              { value: p.stat3Value, label: p.stat3Label },
            ].map(({ value, label }) => (
              <div key={value} className="rounded-xl bg-card border border-border p-8">
                <p className="text-4xl font-semibold text-primary">{value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            {!isAgentAuth ? (
              <Link
                href="/devenir-agent"
                className="inline-flex items-center gap-2 rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
              >
                {p.startNow}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/espace-agent"
                className="inline-flex items-center gap-2 rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
              >
                {p.ctaAgentPortal}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
