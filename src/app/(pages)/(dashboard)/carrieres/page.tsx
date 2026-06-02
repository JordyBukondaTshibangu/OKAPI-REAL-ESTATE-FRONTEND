"use client";

import { useT } from "@/i18n/useT";
import { Button } from "@/shared/components/ui/button";
import { Briefcase, Globe, Heart, Zap } from "lucide-react";

export default function CarreresPage() {
  const t = useT();
  const p = t.pages.carrieres;

  const perks = [
    {
      icon: Heart,
      title: p.perk1Title,
      body: p.perk1Body,
    },
    {
      icon: Globe,
      title: p.perk2Title,
      body: p.perk2Body,
    },
    {
      icon: Zap,
      title: p.perk3Title,
      body: p.perk3Body,
    },
    {
      icon: Briefcase,
      title: p.perk4Title,
      body: p.perk4Body,
    },
  ];

  const openings = [
    {
      title: p.job1Title,
      team: p.job1Team,
      location: "Kinshasa (Hybride)",
      type: "CDI",
    },
    {
      title: p.job2Title,
      team: p.job2Team,
      location: "Kinshasa (Hybride)",
      type: "CDI",
    },
    {
      title: p.job3Title,
      team: p.job3Team,
      location: "Kinshasa",
      type: "CDI",
    },
    {
      title: p.job4Title,
      team: p.job4Team,
      location: "Kinshasa",
      type: "CDI",
    },
    {
      title: p.job5Title,
      team: p.job5Team,
      location: "Kinshasa / Lubumbashi",
      type: "CDI",
    },
    {
      title: p.job6Title,
      team: p.job6Team,
      location: "Kinshasa (Remote possible)",
      type: "CDI",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {p.heroBadge}
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight max-w-2xl mx-auto">
          {p.heroHeading}
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-base mb-8">
          {p.heroSubtitle}
        </p>
        <Button variant="gold" asChild>
          <a href="#offres">{p.heroBtn}</a>
        </Button>
      </section>

      {/* Why us */}
      <section className="bg-muted py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-text-dark">
              {p.whyHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="bg-card rounded-xl shadow-md p-6 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <perk.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-dark mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-text-light leading-relaxed">
                    {perk.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="offres" className="bg-background py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              {p.openingsBadge}
            </p>
            <h2 className="text-2xl font-semibold text-text-dark">
              {p.openingsHeading}
            </h2>
          </div>

          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="bg-card rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-semibold text-text-dark mb-1">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{job.team}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span className="text-primary font-medium">{job.type}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/contact">{p.applyBtn}</a>
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            {p.noRoleText}{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              {p.noRoleLink}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
