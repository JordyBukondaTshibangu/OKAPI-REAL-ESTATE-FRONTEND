"use client";

import Link from "next/link";
import {
  Check,
  Home,
  Calendar,
  BarChart2,
  ShieldCheck,
  User,
  MessageCircle,
  Minus,
} from "lucide-react";
import { useT } from "@/i18n/useT";

// ─── Dark-mode colour tokens (Tailwind arbitrary values) ───────────────────────
// Navy sections (hero, stats, table, footer): already dark — no change needed.
// Light sections in light mode  →  deep-navy equivalents in dark mode:
//   bg-white / bg-[#F9F8F5]   →  dark:bg-[#080F1A]
//   card bg                   →  dark:bg-[#0F1A2B]
//   border                    →  dark:border-[#1A2E45]
//   heading text-[#0B1D3A]    →  dark:text-white
//   body text-[#7A7975]       →  dark:text-[#94A3B8]
//   dark body text-[#3D3D3A]  →  dark:text-[#CBD5E1]

// ─── Sub-components ───────────────────────────────────────────────────────────

function EyebrowTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest text-[#C9A84C] uppercase mb-3">
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4 ${
        light ? "text-white" : "text-[#0B1D3A] dark:text-white"
      }`}
    >
      {children}
    </h2>
  );
}

function GoldText({ children }: { children: React.ReactNode }) {
  return <span className="text-[#C9A84C]">{children}</span>;
}

// ─── Benefit card ─────────────────────────────────────────────────────────────

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlight: string;
};

function BenefitCard({ icon, title, desc, highlight }: BenefitProps) {
  return (
    <div className="relative bg-[#F9F8F5] dark:bg-[#0F1A2B] border border-[#E5E1D8] dark:border-[#1A2E45] rounded-xl p-7 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C] rounded-l-xl" />
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-base font-bold text-[#0B1D3A] dark:text-white mb-2">{title}</p>
      <p className="text-sm leading-relaxed text-[#7A7975] dark:text-[#94A3B8]">{desc}</p>
      <span className="inline-block mt-3 bg-[#F5E6C0] dark:bg-[#C9A84C]/15 text-[#0B1D3A] dark:text-[#C9A84C] text-xs font-bold px-2.5 py-1 rounded">
        {highlight}
      </span>
    </div>
  );
}

// ─── Comparison table row ─────────────────────────────────────────────────────

type RowProps = {
  feature: string;
  free: React.ReactNode;
  pro: React.ReactNode;
  highlighted?: boolean;
};

function TableRow({ feature, free, pro, highlighted }: RowProps) {
  return (
    <tr
      className={`border-b border-white/5 transition hover:bg-[#C9A84C]/5 ${
        highlighted ? "bg-[#C9A84C]/[0.06]" : ""
      }`}
    >
      <td
        className={`px-6 py-4 text-sm ${
          highlighted ? "text-[#C9A84C] font-semibold" : "text-[#CBD5E1]"
        }`}
      >
        {feature}
      </td>
      <td className="px-6 py-4 text-sm text-[#7A7975]">{free}</td>
      <td className="px-6 py-4 text-sm text-white font-medium">{pro}</td>
    </tr>
  );
}

// ─── Pricing card ─────────────────────────────────────────────────────────────

type PricingCardProps = {
  label: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
};

function PricingCard({
  label,
  name,
  price,
  period,
  features,
  cta,
  ctaHref,
  featured,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl p-9 ${
        featured
          ? "bg-[#0B1D3A] border-2 border-[#C9A84C] shadow-2xl"
          : "bg-white dark:bg-[#0F1A2B] border border-[#E5E1D8] dark:border-[#1A2E45]"
      }`}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0B1D3A] text-xs font-extrabold tracking-wide px-4 py-1.5 rounded-full whitespace-nowrap">
          {badge}
        </div>
      )}
      <p
        className={`text-xs font-bold tracking-widest uppercase mb-2 ${
          featured ? "text-[#C9A84C]" : "text-[#7A7975] dark:text-[#94A3B8]"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-extrabold mb-1 ${
          featured ? "text-white" : "text-[#0B1D3A] dark:text-white"
        }`}
      >
        {name}
      </p>
      <p
        className={`text-5xl font-extrabold leading-none mt-4 mb-1 ${
          featured ? "text-[#C9A84C]" : "text-[#0B1D3A] dark:text-white"
        }`}
      >
        {price}
      </p>
      <p
        className={`text-sm mb-7 ${
          featured ? "text-[#A0B0C8]" : "text-[#7A7975] dark:text-[#94A3B8]"
        }`}
      >
        {period}
      </p>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-2.5 text-sm ${
              featured ? "text-[#CBD5E1]" : "text-[#3D3D3A] dark:text-[#CBD5E1]"
            }`}
          >
            <Check
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                featured ? "text-[#C9A84C]" : "text-[#0F6E56]"
              }`}
            />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`block text-center font-bold text-base py-3.5 rounded-lg transition ${
          featured
            ? "bg-[#C9A84C] text-[#0B1D3A] hover:bg-[#D4B558]"
            : "border-2 border-[#E5E1D8] dark:border-[#1A2E45] text-[#7A7975] dark:text-[#94A3B8] hover:border-[#7A7975] dark:hover:border-[#94A3B8] hover:text-[#3D3D3A] dark:hover:text-white"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-[#F9F8F5] dark:bg-[#0F1A2B] border border-transparent dark:border-[#1A2E45] rounded-xl p-6">
      <p className="text-base font-bold text-[#0B1D3A] dark:text-white mb-3">{q}</p>
      <p className="text-sm leading-relaxed text-[#7A7975] dark:text-[#94A3B8]">{a}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProPage() {
  const p = useT().pages.pro;

  const benefits = [
    { icon: <Home className="w-8 h-8 text-[#C9A84C]" />,         title: p.b1Title, desc: p.b1Desc, highlight: p.b1Tag },
    { icon: <Calendar className="w-8 h-8 text-[#C9A84C]" />,     title: p.b2Title, desc: p.b2Desc, highlight: p.b2Tag },
    { icon: <BarChart2 className="w-8 h-8 text-[#C9A84C]" />,    title: p.b3Title, desc: p.b3Desc, highlight: p.b3Tag },
    { icon: <ShieldCheck className="w-8 h-8 text-[#185FA5]" />,  title: p.b4Title, desc: p.b4Desc, highlight: p.b4Tag },
    { icon: <User className="w-8 h-8 text-[#C9A84C]" />,         title: p.b5Title, desc: p.b5Desc, highlight: p.b5Tag },
    { icon: <MessageCircle className="w-8 h-8 text-[#0F6E56]" />, title: p.b6Title, desc: p.b6Desc, highlight: p.b6Tag },
  ];

  const analyticsItems = [
    p.analyticsItem1, p.analyticsItem2, p.analyticsItem3, p.analyticsItem4, p.analyticsItem5,
  ];

  const mockupStats = [
    { label: p.mockupStat1Label, val: p.mockupStat1Val, trend: p.mockupStat1Trend, trendColor: "text-[#0F6E56]" },
    { label: p.mockupStat2Label, val: p.mockupStat2Val, trend: p.mockupStat2Trend, trendColor: "text-[#0F6E56]" },
    { label: p.mockupStat3Label, val: p.mockupStat3Val, trend: p.mockupStat3Trend, trendColor: "text-[#A0B0C8]" },
  ];

  const freeFeatures = [p.freeFeat1, p.freeFeat2, p.freeFeat3, p.freeFeat4, p.freeFeat5, p.freeFeat6];
  const proFeatures  = [p.proFeat1, p.proFeat2, p.proFeat3, p.proFeat4, p.proFeat5, p.proFeat6, p.proFeat7, p.proFeat8, p.proFeat9];

  const faqs = [
    { q: p.faq1Q, a: p.faq1A }, { q: p.faq2Q, a: p.faq2A },
    { q: p.faq3Q, a: p.faq3A }, { q: p.faq4Q, a: p.faq4A },
    { q: p.faq5Q, a: p.faq5A }, { q: p.faq6Q, a: p.faq6A },
  ];

  const statsBar = [
    { val: p.stat1Val, label: p.stat1Label },
    { val: p.stat2Val, label: p.stat2Label },
    { val: p.stat3Val, label: p.stat3Label },
    { val: p.stat4Val, label: p.stat4Label },
  ];

  return (
    <div className="bg-[#F9F8F5] dark:bg-[#080F1A] antialiased">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      {/* Already navy — looks great in both modes */}
      <section className="relative bg-[#0B1D3A] overflow-hidden px-5 py-24 md:py-32 text-center">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-[#0F6E56]/12" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#C9A84C]/15 border border-[#C9A84C]/35 text-[#C9A84C] text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-7">
            {p.heroBadge}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6 whitespace-pre-line">
            {p.heroTitle}
          </h1>
          <p className="text-lg text-[#A0B8C8] max-w-xl mx-auto mb-10 leading-relaxed">
            {p.heroSub}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/espace-agent/abonnement" className="inline-block bg-[#C9A84C] text-[#0B1D3A] font-bold text-base px-9 py-4 rounded-lg hover:bg-[#D4B558] transition">
              {p.heroCta}
            </Link>
            <Link href="#comparer" className="inline-block border border-[#C9A84C]/40 text-[#C9A84C] font-semibold text-base px-8 py-4 rounded-lg hover:border-[#C9A84C] hover:bg-[#C9A84C]/8 transition">
              {p.heroCtaGhost}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      {/* Already very dark navy — no change needed */}
      <div className="bg-[#0F1E30] border-y border-[#C9A84C]/15 px-5 py-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-10 md:gap-16">
          {statsBar.map(({ val, label }) => (
            <div key={label} className="text-center">
              <span className="block text-4xl font-extrabold text-[#C9A84C] leading-none">{val}</span>
              <span className="block text-xs text-[#A0B0C8] mt-1.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENEFITS ────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#0B1520] px-5 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <EyebrowTag>{p.benefitsEyebrow}</EyebrowTag>
            <SectionTitle>{p.benefitsTitle}</SectionTitle>
            <p className="text-[#7A7975] dark:text-[#94A3B8] text-base max-w-lg mx-auto leading-relaxed">{p.benefitsSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <BenefitCard key={b.title} icon={b.icon} title={b.title} desc={b.desc} highlight={b.highlight} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ────────────────────────────────────────────── */}
      {/* Navy section — looks great in both modes */}
      <section id="comparer" className="bg-[#0B1D3A] px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <EyebrowTag>{p.compEyebrow}</EyebrowTag>
            <SectionTitle light>{p.compTitle}</SectionTitle>
            <p className="text-[#A0B0C8] max-w-md mx-auto">{p.compSub}</p>
          </div>
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full border-collapse bg-[#0F1E30] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#14253A] border-b-2 border-[#C9A84C]/25">
                  <th className="px-6 py-5 text-left text-sm text-[#A0B0C8] font-normal">{p.compColFeature}</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-white">{p.compColFree}</th>
                  <th className="px-6 py-5 text-left">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#C9A84C]">
                      {p.compColPro}
                      <span className="bg-[#C9A84C] text-[#0B1D3A] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded">$15/mois</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableRow feature={p.row1} free={p.row1Free} pro={<span className="text-[#C9A84C] font-bold">{p.row1Pro}</span>} highlighted />
                <TableRow feature={p.row2} free={p.row2Free} pro={<span className="text-[#C9A84C] font-bold">{p.row2Pro}</span>} />
                <TableRow feature={p.row3} free={p.row3Free} pro={<span className="text-[#C9A84C] font-bold">{p.row3Pro}</span>} />
                <TableRow feature={p.row4} free={p.row4Free} pro={<span className="text-[#C9A84C] font-bold">{p.row4Pro}</span>} />
                <TableRow feature={p.row5} free={<Check className="w-5 h-5 text-[#0F6E56]" />} pro={<Check className="w-5 h-5 text-[#0F6E56]" />} />
                <TableRow feature={p.row6} free={<Check className="w-5 h-5 text-[#0F6E56]" />} pro={<Check className="w-5 h-5 text-[#0F6E56]" />} />
                <TableRow feature={p.row7} free={<Check className="w-5 h-5 text-[#0F6E56]" />} pro={<Check className="w-5 h-5 text-[#0F6E56]" />} />
                <TableRow feature={p.row8}  free={<Minus className="w-5 h-5 text-[#4A5568]" />} pro={<span className="text-[#C9A84C] font-bold">{p.rowIncluded}</span>} highlighted />
                <TableRow feature={p.row9}  free={<Minus className="w-5 h-5 text-[#4A5568]" />} pro={<span className="text-[#C9A84C] font-bold">{p.rowIncluded}</span>} highlighted />
                <TableRow feature={p.row10} free={<Minus className="w-5 h-5 text-[#4A5568]" />} pro={<span className="text-[#C9A84C] font-bold">{p.rowIncluded}</span>} highlighted />
                <TableRow feature={p.row11} free={<Minus className="w-5 h-5 text-[#4A5568]" />} pro={<span className="text-[#C9A84C] font-bold">{p.rowIncluded}</span>} highlighted />
                <TableRow feature={p.row12} free={<Minus className="w-5 h-5 text-[#4A5568]" />} pro={<span className="text-[#C9A84C] font-bold">{p.rowIncluded}</span>} highlighted />
                <TableRow feature={p.row13} free={p.row13Free} pro={p.row13Pro} />
                <TableRow feature={p.row14} free={p.row14Free} pro={<span className="text-[#C9A84C] font-bold">{p.row14Pro}</span>} />
                <TableRow feature={p.row15} free={p.row15Free} pro={<span className="text-[#C9A84C] font-bold">{p.row15Pro}</span>} />
                <TableRow feature={p.row16} free={p.row16Free} pro={<span className="text-[#C9A84C] font-bold">{p.row16Pro}</span>} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ───────────────────────────────────────────── */}
      <section className="bg-[#F9F8F5] dark:bg-[#080F1A] px-5 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Mockup — already navy, no changes needed */}
          <div className="bg-[#0B1D3A] rounded-xl p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
              <p className="text-sm font-bold text-white">{p.mockupTitle}</p>
              <span className="bg-[#0F6E56] text-white text-[10px] font-bold px-2 py-0.5 rounded">{p.mockupBadge}</span>
            </div>
            <p className="text-sm font-semibold text-white mb-5">{p.mockupListing}</p>
            {mockupStats.map(({ label, val, trend, trendColor }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-white/6 last:border-0">
                <span className="text-sm text-[#A0B0C8]">{label}</span>
                <span className="text-base font-bold text-white">
                  {val} <span className={`text-xs ${trendColor}`}>{trend}</span>
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-[#A0B0C8]">{p.mockupRateLabel}</span>
              <span className="text-base font-bold text-[#C9A84C]">{p.mockupRateVal}</span>
            </div>
            {/* Bar chart */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-[#A0B0C8] mb-2">
                <span>{p.mockupChartTitle}</span>
                <span className="text-[#C9A84C]">{p.mockupChartPeak}</span>
              </div>
              <div className="flex gap-1 items-end h-10">
                {[55, 100, 80, 60, 45, 30, 20].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 1 ? "#0F6E56" : `rgba(15,110,86,${h / 200 + 0.1})` }} />
                ))}
              </div>
            </div>
            <div className="mt-5 bg-[#C9A84C]/8 rounded-lg p-3">
              <p className="text-[10px] font-bold text-[#C9A84C] mb-1">{p.mockupBoostLabel}</p>
              <p className="text-xs text-white leading-snug">{p.mockupBoostTip}</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <EyebrowTag>{p.analyticsEyebrow}</EyebrowTag>
            <SectionTitle><GoldText>{p.analyticsTitle}</GoldText></SectionTitle>
            <p className="text-[#7A7975] dark:text-[#94A3B8] text-base leading-relaxed mb-7">{p.analyticsSub}</p>
            <ul className="space-y-3.5">
              {analyticsItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#3D3D3A] dark:text-[#CBD5E1]">
                  <Check className="w-4 h-4 text-[#0F6E56] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#0B1520] px-5 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-7xl leading-none text-[#C9A84C] opacity-40 font-serif">&ldquo;</p>
          <blockquote className="text-xl md:text-2xl font-semibold text-[#0B1D3A] dark:text-white leading-relaxed mt-2 mb-7">
            {p.quoteText}
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0B1D3A] dark:bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold text-base">
              {p.quoteAuthor.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="text-left">
              <p className="font-bold text-[#0B1D3A] dark:text-white text-base">{p.quoteAuthor}</p>
              <p className="text-sm text-[#7A7975] dark:text-[#94A3B8]">{p.quoteRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="passer-au-pro" className="bg-[#F9F8F5] dark:bg-[#080F1A] px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <EyebrowTag>{p.pricingEyebrow}</EyebrowTag>
            <SectionTitle><GoldText>{p.pricingTitle}</GoldText></SectionTitle>
            <p className="text-[#7A7975] dark:text-[#94A3B8] max-w-md mx-auto">{p.pricingSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PricingCard label={p.freeLabel} name={p.freeName} price={p.freePrice} period={p.freePeriod} features={freeFeatures} cta={p.freeCta} ctaHref="/devenir-agent" />
            <PricingCard label={p.proLabel} name={p.proName} price={p.proPrice} period={p.proPeriod} features={proFeatures} cta={p.proCta} ctaHref="/espace-agent/abonnement" featured badge={p.proBadge} />
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-[#7A7975] dark:text-[#94A3B8]">
              {p.loginNote}{" "}
              <Link href="/espace-agent/abonnement" className="text-[#C9A84C] font-semibold hover:underline">{p.loginCta}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#0B1520] px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <EyebrowTag>{p.faqEyebrow}</EyebrowTag>
            <SectionTitle><GoldText>{p.faqTitle}</GoldText></SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────────────────── */}
      {/* Already navy — looks great in both modes */}
      <section className="relative bg-[#0B1D3A] overflow-hidden px-5 py-24 text-center">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/7" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            <GoldText>{p.footerTitle}</GoldText>
          </h2>
          <p className="text-[#A0B0C8] text-lg mb-10">{p.footerSub}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/espace-agent/abonnement" className="inline-block bg-[#C9A84C] text-[#0B1D3A] font-bold text-base px-9 py-4 rounded-lg hover:bg-[#D4B558] transition">
              {p.footerCta}
            </Link>
            <Link href="/devenir-agent" className="inline-block border border-[#C9A84C]/40 text-[#C9A84C] font-semibold text-base px-8 py-4 rounded-lg hover:border-[#C9A84C] hover:bg-[#C9A84C]/8 transition">
              {p.footerCtaGhost}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
