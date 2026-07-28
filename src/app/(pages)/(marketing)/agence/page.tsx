"use client";

import Link from "next/link";
import {
  Check,
  Home,
  Users,
  BarChart2,
  ShieldCheck,
  Building2,
  MessageCircle,
  Minus,
  Headphones,
} from "lucide-react";
import { useT } from "@/i18n/useT";

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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white dark:bg-[#0F1A2B] border border-[#E5E1D8] dark:border-[#1A2E45] rounded-xl px-6 py-5">
      <p className="font-semibold text-[#0B1D3A] dark:text-white mb-2">{q}</p>
      <p className="text-sm text-[#7A7975] dark:text-[#94A3B8] leading-relaxed">{a}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgencePage() {
  const p = useT().pages.agence;

  const benefits = [
    { icon: <Home className="w-8 h-8 text-[#C9A84C]" />, title: p.b1Title, desc: p.b1Body, highlight: "∞ annonces" },
    { icon: <Users className="w-8 h-8 text-[#C9A84C]" />, title: p.b2Title, desc: p.b2Body, highlight: "∞ agents" },
    { icon: <Building2 className="w-8 h-8 text-[#C9A84C]" />, title: p.b3Title, desc: p.b3Body, highlight: "Dashboard centralisé" },
    { icon: <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />, title: p.b4Title, desc: p.b4Body, highlight: "Badge prioritaire" },
    { icon: <BarChart2 className="w-8 h-8 text-[#C9A84C]" />, title: p.b5Title, desc: p.b5Body, highlight: "Analytics avancés" },
    { icon: <Headphones className="w-8 h-8 text-[#C9A84C]" />, title: p.b6Title, desc: p.b6Body, highlight: "Support dédié" },
  ];

  const compareRows = [
    { label: p.cf1, free: "3", pro: "∞" },
    { label: p.cf2, free: "3", pro: "∞" },
    { label: p.cf3, free: false, pro: true },
    { label: p.cf4, free: false, pro: true },
    { label: p.cf5, free: false, pro: true },
    { label: p.cf6, free: false, pro: true },
  ];

  const pricingFeats = [
    p.pricingFeat1, p.pricingFeat2, p.pricingFeat3,
    p.pricingFeat4, p.pricingFeat5, p.pricingFeat6,
  ];

  return (
    <div className="bg-white dark:bg-[#0B1520] min-h-screen font-sans">

      {/* ── Hero (navy) ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1D3A] text-white pt-24 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#C9A84C 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-[#C9A84C]/30">
            {p.heroBadge}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            {p.heroTitle.split(" ").slice(0, -2).join(" ")}{" "}
            <GoldText>{p.heroTitle.split(" ").slice(-2).join(" ")}</GoldText>
          </h1>
          <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-2xl mx-auto">
            {p.heroSub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/plans"
              className="bg-[#C9A84C] hover:bg-[#B8973B] text-[#0B1D3A] font-bold px-8 py-4 rounded-xl text-base transition"
            >
              {p.heroCta}
            </Link>
            <a
              href="#avantages"
              className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-base transition"
            >
              {p.heroCtaGhost}
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar (navy) ────────────────────────────────────────────────── */}
      <section className="bg-[#0F2544] border-t border-b border-[#1A3259] py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: p.stat1Val, label: p.stat1Label },
            { val: p.stat2Val, label: p.stat2Label },
            { val: p.stat3Val, label: p.stat3Label },
            { val: p.stat4Val, label: p.stat4Label },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-extrabold text-[#C9A84C]">{s.val}</p>
              <p className="text-xs text-[#94A3B8] mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────────── */}
      <section id="avantages" className="py-20 px-4 bg-white dark:bg-[#0B1520]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <EyebrowTag>{p.benefitsEyebrow}</EyebrowTag>
          <SectionTitle>{p.benefitsTitle}</SectionTitle>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <BenefitCard key={i} icon={b.icon} title={b.title} desc={b.desc} highlight={b.highlight} />
          ))}
        </div>
      </section>

      {/* ── Comparison table ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F9F8F5] dark:bg-[#080F1A]">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <EyebrowTag>{p.compareEyebrow}</EyebrowTag>
          <SectionTitle>{p.compareTitle}</SectionTitle>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#0F1A2B] border border-[#E5E1D8] dark:border-[#1A2E45] rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 bg-[#F9F8F5] dark:bg-[#0B1D3A]/60 px-6 py-3 text-sm font-bold border-b border-[#E5E1D8] dark:border-[#1A2E45]">
              <span className="text-[#3D3D3A] dark:text-[#CBD5E1]">{p.compareFeature}</span>
              <span className="text-center text-[#7A7975] dark:text-[#94A3B8]">{p.compareGratuit}</span>
              <span className="text-center text-[#C9A84C]">{p.compareAgence}</span>
            </div>
            {compareRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-6 py-4 border-b border-[#E5E1D8] dark:border-[#1A2E45] last:border-0 items-center"
              >
                <span className="text-sm text-[#3D3D3A] dark:text-[#CBD5E1]">{row.label}</span>
                <div className="flex justify-center">
                  {typeof row.free === "boolean" ? (
                    row.free ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-[#CBD5E1] dark:text-[#4A5568]" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-[#3D3D3A] dark:text-[#CBD5E1]">{row.free}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.pro === "boolean" ? (
                    row.pro ? (
                      <Check className="w-4 h-4 text-[#C9A84C]" />
                    ) : (
                      <Minus className="w-4 h-4 text-[#CBD5E1]" />
                    )
                  ) : (
                    <span className="text-sm font-bold text-[#C9A84C]">{row.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white dark:bg-[#0B1520]">
        <div className="max-w-lg mx-auto text-center mb-12">
          <EyebrowTag>{p.pricingEyebrow}</EyebrowTag>
          <SectionTitle>{p.pricingTitle}</SectionTitle>
        </div>
        <div className="max-w-sm mx-auto bg-[#0B1D3A] rounded-2xl overflow-hidden shadow-xl border border-[#1A3259]">
          {/* Gold top bar */}
          <div className="h-1.5 bg-[#C9A84C]" />
          <div className="p-8">
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-extrabold text-white">{p.priceLabel}</span>
              <span className="text-[#94A3B8] mb-1">{p.priceUnit}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {pricingFeats.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#CBD5E1]">
                  <Check className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href="/plans"
              className="block w-full text-center bg-[#C9A84C] hover:bg-[#B8973B] text-[#0B1D3A] font-bold px-6 py-3.5 rounded-xl transition"
            >
              {p.pricingCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F9F8F5] dark:bg-[#080F1A]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-semibold italic text-[#0B1D3A] dark:text-white leading-relaxed mb-6">
            "{p.testimonialQuote}"
          </p>
          <div>
            <p className="font-bold text-[#0B1D3A] dark:text-white">{p.testimonialName}</p>
            <p className="text-sm text-[#7A7975] dark:text-[#94A3B8]">{p.testimonialRole}</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white dark:bg-[#0B1520]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <EyebrowTag>{p.faqEyebrow}</EyebrowTag>
          <SectionTitle>{p.faqTitle}</SectionTitle>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          <FaqItem q={p.faq1Q} a={p.faq1A} />
          <FaqItem q={p.faq2Q} a={p.faq2A} />
          <FaqItem q={p.faq3Q} a={p.faq3A} />
          <FaqItem q={p.faq4Q} a={p.faq4A} />
        </div>
      </section>

      {/* ── Footer CTA (navy) ───────────────────────────────────────────────── */}
      <section className="bg-[#0B1D3A] py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#C9A84C 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            {p.footerTitle}
          </h2>
          <p className="text-[#94A3B8] text-lg mb-10">{p.footerSub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/plans"
              className="bg-[#C9A84C] hover:bg-[#B8973B] text-[#0B1D3A] font-bold px-8 py-4 rounded-xl text-base transition"
            >
              {p.footerCta}
            </Link>
            <Link
              href="/devenir-agent"
              className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-base transition"
            >
              {p.footerCtaGhost}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
