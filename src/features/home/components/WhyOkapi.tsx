"use client";

import { useT } from "@/i18n/useT";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhyOkapi() {
  const t = useT();
  const p = t.pages.sell;

  return (
    <section className="bg-background border-b border-border">
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
  );
}
