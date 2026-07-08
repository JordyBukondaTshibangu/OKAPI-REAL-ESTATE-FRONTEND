"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import { Home, MapPin, Shield, Users } from "lucide-react";
import Link from "next/link";

function GoldWord({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <span className="text-secondary">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  );
}

export default function AboutSection() {
  const t = useT();

  const stats = [
    { value: t.home.about.stat1Value, label: t.home.about.stat1Label, icon: Home,   gold: false },
    { value: t.home.about.stat2Value, label: t.home.about.stat2Label, icon: Users,  gold: false },
    { value: t.home.about.stat3Value, label: t.home.about.stat3Label, icon: Shield, gold: true  },
  ];

  return (
    <section className="bg-navy text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* — Section 1: À propos — */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Large primary card — spans 2 rows */}
            <div className="bg-white dark:bg-card/5 border border-white/10 rounded-2xl p-6 row-span-2 flex flex-col min-h-[260px]">
              <div className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center mb-4">
                <Home className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-4xl font-bold text-foreground dark:text-white leading-none">{t.home.about.stat1Value}</p>
              <p className="text-sm text-muted-foreground dark:text-white/55 mt-1.5">{t.home.about.stat1Label}</p>

              {/* Mini neighbourhood activity bars */}
              <div className="mt-auto pt-5 space-y-2.5">
                {[
                  { name: "Gombe",    w: "w-full"  },
                  { name: "Ngaliema", w: "w-4/5"   },
                  { name: "Limete",   w: "w-[60%]" },
                ].map(({ name, w }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground/70 dark:text-white/45 w-14 shrink-0">{name}</span>
                    <div className="flex-1 h-1 bg-muted dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full ${w} bg-secondary/50 rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users card */}
            <div className="bg-white dark:bg-card/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-h-[120px]">
              <Users className="w-5 h-5 text-secondary/80" />
              <div>
                <p className="text-2xl font-bold text-foreground dark:text-white leading-none">{t.home.about.stat2Value}</p>
                <p className="text-xs text-muted-foreground dark:text-white/55 mt-1">{t.home.about.stat2Label}</p>
              </div>
            </div>

            {/* Agents card — gold accent */}
            <div className="bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/30 rounded-2xl p-5 flex flex-col justify-between min-h-[120px]">
              <Shield className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-secondary leading-none">{t.home.about.stat3Value}</p>
                <p className="text-xs text-muted-foreground dark:text-white/55 mt-1">{t.home.about.stat3Label}</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {t.home.about.badge}
            </p>
            <h2 className="text-3xl md:text-3xl font-semibold mb-5 leading-tight">
              <GoldWord text={t.home.about.heading} highlight={t.home.about.headingHighlight} />
            </h2>
            <p className="text-base text-white/70 leading-relaxed mb-6 max-w-md">
              {t.home.about.para}
            </p>
            <Button variant="outlineGold" asChild>
              <Link href="/a-propos">{t.home.about.learnMore}</Link>
            </Button>
          </div>
        </div>

        {/* — Section 2: Notre Réseau — */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <div className="md:order-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {t.home.about.networkBadge}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-5 leading-tight">
              <GoldWord text={t.home.about.networkHeading} highlight={t.home.about.networkHeadingHighlight} />
            </h2>
            <p className="text-base text-white/70 leading-relaxed mb-8 max-w-lg">
              {t.home.about.networkPara}
            </p>
            <Button variant="gold" asChild>
              <Link href="/agents">{t.home.about.findAgent}</Link>
            </Button>
          </div>

          {/* Agent network visual */}
          <div className="md:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-card/5 border border-white/10">
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent" aria-hidden="true" />

              {/* Agent avatar cluster */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-52 h-52">
                  {/* Centre avatar — gold */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-secondary text-secondary-foreground font-bold text-xl flex items-center justify-center ring-4 ring-navy z-10 shadow-lg">
                    K
                  </div>
                  {/* Orbit avatars — distinct tints to read as different people */}
                  {[
                    { init: "J", pos: "top-0 left-1/2 -translate-x-1/2",    bg: "bg-blue-500/30 border-blue-400/40"    },
                    { init: "M", pos: "bottom-0 left-1/2 -translate-x-1/2", bg: "bg-emerald-500/30 border-emerald-400/40" },
                    { init: "A", pos: "top-1/2 left-0 -translate-y-1/2",    bg: "bg-violet-500/30 border-violet-400/40" },
                    { init: "S", pos: "top-1/2 right-0 -translate-y-1/2",   bg: "bg-rose-500/30 border-rose-400/40"    },
                  ].map(({ init, pos, bg }) => (
                    <div
                      key={init}
                      className={`absolute ${pos} w-11 h-11 rounded-full ${bg} border flex items-center justify-center text-white text-sm font-semibold shadow-md`}
                    >
                      {init}
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent count badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-card/10 backdrop-blur-sm border border-border dark:border-white/15 rounded-full px-4 py-2 text-sm whitespace-nowrap shadow-sm">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-semibold text-foreground dark:text-white">{t.home.about.agentCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
