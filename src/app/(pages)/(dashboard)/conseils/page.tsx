"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function ConseilsPage() {
  const t = useT();
  const p = t.pages.conseils;

  const guides = [
    {
      href: "/conseils/guide-acheteur",
      label: p.guide1Label,
      description: p.guide1Desc,
      icon: "🏠",
      tag: p.guide1Tag,
      color: "border-primary",
    },
    {
      href: "/conseils/guide-vendeur",
      label: p.guide2Label,
      description: p.guide2Desc,
      icon: "📋",
      tag: p.guide2Tag,
      color: "border-secondary",
    },
    {
      href: "/conseils/guide-locataire",
      label: p.guide3Label,
      description: p.guide3Desc,
      icon: "🔑",
      tag: p.guide3Tag,
      color: "border-primary",
    },
    {
      href: "/conseils/quartiers",
      label: p.guide4Label,
      description: p.guide4Desc,
      icon: "🗺",
      tag: p.guide4Tag,
      color: "border-secondary",
    },
    {
      href: "/conseils/communautes",
      label: p.guide5Label,
      description: p.guide5Desc,
      icon: "👥",
      tag: p.guide5Tag,
      color: "border-primary",
    },
    {
      href: "/conseils/tours-residences",
      label: p.guide6Label,
      description: p.guide6Desc,
      icon: "🏢",
      tag: p.guide6Tag,
      color: "border-secondary",
    },
    {
      href: "/conseils/ecoles-universites",
      label: p.guide7Label,
      description: p.guide7Desc,
      icon: "🎓",
      tag: p.guide7Tag,
      color: "border-primary",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              {p.breadHome}
            </Link>
            <span>/</span>
            <span className="text-white">{p.breadConseils}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            {p.availableBadge}
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {p.heading}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            {p.subtitle}
          </p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className={`bg-card rounded-xl shadow-md p-6 border-t-4 ${guide.color} hover:shadow-lg transition-shadow group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{guide.icon}</span>
                  <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {guide.tag}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {guide.label}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {guide.description}
                </p>
                <div className="mt-4 text-sm font-medium text-primary flex items-center gap-1">
                  {p.readGuide}
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {p.ctaHeading}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {p.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">{p.ctaContact}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/acheter">{p.ctaBrowse}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
