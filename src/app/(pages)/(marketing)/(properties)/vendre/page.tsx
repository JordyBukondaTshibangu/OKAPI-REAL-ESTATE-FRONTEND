"use client";

import Link from "next/link";
import { Check, X, Info } from "lucide-react";
import { useT } from "@/i18n/useT";

type Feature = { label: string; tooltip?: boolean };
type Package = {
  name: string; price: string; blurb: string;
  features: Feature[]; includes: (Feature | null)[];
  plus: (Feature | null)[]; highlight?: boolean; badge?: string;
  ctaVariant: "primary" | "highlight";
};

function FeatureRow({ feature }: { feature: Feature | null }) {
  if (feature === null) {
    return (
      <li className="flex items-center gap-2 text-sm text-muted-foreground/70 min-h-[28px]">
        <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2 text-sm  min-h-[28px]">
      <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
      <span className="flex items-center gap-1.5">
        {feature.label}
        {feature.tooltip && <Info className="w-3.5 h-3.5 text-muted-foreground" />}
      </span>
    </li>
  );
}

function PackageCard({ pkg, listBtn, included, plus }: { pkg: Package; listBtn: string; included: string; plus: string }) {
  const ringClass = pkg.highlight ? "ring-2 ring-emerald-500" : "ring-1 ring-border";
  return (
    <div className={`relative bg-card rounded-2xl ${ringClass} flex flex-col overflow-hidden shadow-sm`}>
      {pkg.badge && (
        <div className="absolute top-0 left-0 z-10 overflow-hidden w-32 h-32 pointer-events-none">
          <div className="absolute top-6 -left-9 w-44 rotate-[-45deg] bg-emerald-500 text-white text-[10px] font-semibold tracking-wider text-center py-1 shadow">
            {pkg.badge}
          </div>
        </div>
      )}
      <div className="px-6 pt-8 pb-6 text-center">
        <h3 className="text-2xl font-light ">{pkg.name}</h3>
        <p className="mt-3 text-2xl font-semibold ">{pkg.price}</p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed min-h-[60px]">{pkg.blurb}</p>
      </div>
      <div className="px-6 pb-6 border-t border-border pt-6 flex-1">
        <ul className="space-y-2.5">
          {pkg.features.map((f, i) => <FeatureRow key={`f-${i}`} feature={f} />)}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">{included}</p>
        <ul className="mt-3 space-y-2.5">
          {pkg.includes.map((f, i) => <FeatureRow key={`inc-${i}`} feature={f} />)}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">{plus}</p>
        <ul className="mt-3 space-y-2.5">
          {pkg.plus.map((f, i) => <FeatureRow key={`plus-${i}`} feature={f} />)}
        </ul>
      </div>
      <div className="px-6 pb-6">
        <Link
          href="/vendre/maison"
          className={`flex items-center justify-center w-full rounded-full h-11 text-sm font-medium transition-colors ${
            pkg.ctaVariant === "highlight"
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          }`}
        >
          {listBtn}
        </Link>
      </div>
    </div>
  );
}

export default function VendrePage() {
  const t = useT();
  const s = t.pages.sell;

  const commonFeats: Feature[] = [
    { label: s.feat2 }, { label: s.feat3 }, { label: s.feat4 },
    { label: s.feat5 }, { label: s.feat6 }, { label: s.feat7 },
    { label: s.feat8, tooltip: true }, { label: s.feat9 }, { label: s.feat10, tooltip: true },
  ];

  const packages: Package[] = [
    {
      name: s.pkg1Name, price: s.pkg1Price, blurb: s.pkg1Blurb,
      features: [{ label: s.feat1 }, ...commonFeats],
      includes: [null, null, null, null], plus: [null], ctaVariant: "primary",
    },
    {
      name: s.pkg2Name, price: s.pkg2Price, blurb: s.pkg2Blurb,
      features: [{ label: s.feat2 }, ...commonFeats],
      includes: [null, null, null, null], plus: [null],
      highlight: true, badge: s.popularBadge, ctaVariant: "highlight",
    },
    {
      name: s.pkg3Name, price: s.pkg3Price, blurb: s.pkg3Blurb,
      features: [{ label: s.feat2 }, ...commonFeats],
      includes: [
        { label: s.inc1 }, { label: s.inc2 }, { label: s.inc3 }, { label: s.inc4 },
      ],
      plus: [null], ctaVariant: "primary",
    },
    {
      name: s.pkg4Name, price: s.pkg4Price, blurb: s.pkg4Blurb,
      features: [{ label: s.feat2 }, ...commonFeats],
      includes: [
        { label: s.inc1 }, { label: s.inc2 }, { label: s.inc3 }, { label: s.inc4 },
      ],
      plus: [{ label: s.plusFeat, tooltip: true }], ctaVariant: "primary",
    },
  ];

  return (
    <div className="bg-background-alt">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <p className="text-center ">{s.tagline}</p>
        <h1 className="text-center text-4xl md:text-5xl font-light  mt-8">
          {s.heading}
        </h1>
        <p className="text-center mt-3">
          <Link href="/louer" className="text-primary hover:underline text-sm font-medium">
            {s.rentLink}
          </Link>
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} listBtn={s.listBtn} included={s.included} plus={s.plus} />
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-light ">{s.whyHeading}</h2>
          <p className="mt-6 max-w-3xl mx-auto ">{s.whyPara}</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">{s.stat1Value}</p>
              <p className="mt-3 text-sm ">{s.stat1Label}</p>
            </div>
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">{s.stat2Value}</p>
              <p className="mt-3 text-sm ">{s.stat2Label}</p>
            </div>
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">{s.stat3Value}</p>
              <p className="mt-3 text-sm ">{s.stat3Label}</p>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/vendre/maison"
              className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors"
            >
              {s.startNow}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
