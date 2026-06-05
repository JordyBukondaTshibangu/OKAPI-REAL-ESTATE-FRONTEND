"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import { Award, Globe, Home, Users } from "lucide-react";

export default function AboutPage() {
  const t = useT();
  const p = t.pages.about;

  const stats = [
    { label: p.stat1Label, value: p.stat1Value },
    { label: p.stat2Label, value: p.stat2Value },
    { label: p.stat3Label, value: p.stat3Value },
    { label: p.stat4Label, value: p.stat4Value },
  ];

  const values = [
    {
      icon: Home,
      title: p.value1Title,
      body: p.value1Body,
    },
    {
      icon: Users,
      title: p.value2Title,
      body: p.value2Body,
    },
    {
      icon: Globe,
      title: p.value3Title,
      body: p.value3Body,
    },
    {
      icon: Award,
      title: p.value4Title,
      body: p.value4Body,
    },
  ];

  return (
    <>
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
            {p.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            {p.heading}
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto">
            {p.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-secondary/10 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 shadow-md flex items-center justify-center">
            <Home className="w-28 h-28 text-primary/30" strokeWidth={1} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {p.missionBadge}
            </p>
            <h2 className="text-3xl font-semibold  mb-5 leading-tight">
              {p.missionHeading}
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">
              {p.missionPara1}
            </p>
            <p className="text-sm text-text-light leading-relaxed mb-8">
              {p.missionPara2}
            </p>
            <Button asChild>
              <a href="/contact">{p.contactUs}</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {p.valuesBadge}
            </p>
            <h2 className="text-3xl font-semibold ">
              {p.valuesHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-xl shadow-md p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold  mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {p.ctaHeading}
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto text-sm">
          {p.ctaBody}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" asChild>
            <a href="/inscription">{p.ctaCreate}</a>
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white dark:bg-card/10"
            asChild
          >
            <a href="/carrieres">{p.ctaJoin}</a>
          </Button>
        </div>
      </section>
    </>
  );
}
