"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import { Home, Laptop, Sofa, Users } from "lucide-react";

export default function AboutSection() {
  const t = useT();

  return (
    <section className="bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Le site immobilier numéro un à Kinshasa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image collage */}
          <div className="relative h-[420px]">
            {/* Top-left image */}
            <div className="absolute top-0 left-4 w-56 h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 shadow-lg flex items-center justify-center">
              <Sofa className="w-16 h-16 text-white/80" strokeWidth={1.5} />
            </div>
            {/* Top-right image */}
            <div className="absolute top-2 right-8 w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg flex items-center justify-center">
              <Laptop className="w-14 h-14 text-white/90" strokeWidth={1.5} />
            </div>
            {/* Bottom image */}
            <div className="absolute bottom-0 left-20 w-64 h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-sky-300 shadow-lg flex items-center justify-center">
              <Home className="w-20 h-20 text-white/90" strokeWidth={1.5} />
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {t.home.about.badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-dark mb-5 leading-tight">
              {t.home.about.heading}
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">
              {t.home.about.para1}
            </p>
            <p className="text-sm text-text-light leading-relaxed mb-8">
              {t.home.about.para2}
            </p>
            <Button variant="outline" asChild>
              <a href="/a-propos">{t.home.about.learnMore}</a>
            </Button>
          </div>
        </div>

        {/* Trouver un agent immobilier de confiance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="md:order-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {t.home.about.networkBadge}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-dark mb-5 leading-tight">
              {t.home.about.networkHeading}
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-8 max-w-lg">
              {t.home.about.networkPara}
            </p>
            <Button asChild>
              <a href="/vendre/agents">{t.home.about.findAgent}</a>
            </Button>
          </div>

          {/* Image */}
          <div className="md:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 via-rose-100 to-amber-200 shadow-lg flex items-center justify-center">
              <Users className="w-24 h-24 text-text-dark/50" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
