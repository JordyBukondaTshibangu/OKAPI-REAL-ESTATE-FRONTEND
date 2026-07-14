"use client";

import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/useT";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tier = {
  id: string;
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

// ── Sub-components ────────────────────────────────────────────────────────────

function TierCard({ tier }: { tier: Tier }) {
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

  const ctaClass = dark
    ? "bg-white text-[#0d1b3e] hover:bg-white/90"
    : highlight
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "bg-background border border-border text-foreground hover:bg-muted";

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

        {tier.sub && (
          <p className={`mt-1.5 text-xs ${noteColor}`}>{tier.sub}</p>
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
        <Link
          href={tier.ctaHref}
          className={`flex items-center justify-center gap-2 w-full rounded-full h-11 text-sm font-semibold transition-colors ${ctaClass}`}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VendrePage() {
  const t = useT();
  const p = t.pages.sell;

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
      features: [p.featUnlimited, p.tier2Feat1, p.featWhatsApp, p.featDirectContact, p.featAnalytics],
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

      {/* ── Launch banner ── */}
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

      {/* ── Header ── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
          {p.heading}
        </h1>
        <p className="mt-3 text-muted-foreground text-base">{p.subheading}</p>
      </section>

      {/* ── Tier cards ── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
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
            <Link
              href="/devenir-agent"
              className="inline-flex items-center gap-2 rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
            >
              {p.startNow}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
