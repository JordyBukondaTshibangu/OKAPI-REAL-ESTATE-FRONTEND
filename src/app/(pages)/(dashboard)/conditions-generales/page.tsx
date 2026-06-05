"use client";

import { useT } from "@/i18n/useT";

export default function TermsPage() {
  const t = useT();
  const p = t.pages.terms;

  const sections = [
    { title: p.s1Title, body: p.s1Body },
    { title: p.s2Title, body: p.s2Body },
    { title: p.s3Title, body: p.s3Body },
    { title: p.s4Title, body: p.s4Body },
    { title: p.s5Title, body: p.s5Body },
    { title: p.s6Title, body: p.s6Body },
    { title: p.s7Title, body: p.s7Body },
    { title: p.s8Title, body: p.s8Body },
  ];

  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {p.badge}
        </p>
        <h1 className="text-4xl font-semibold mb-4">
          {p.heading}
        </h1>
        <p className="text-white/70 text-sm">
          {p.lastUpdated}
        </p>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-semibold  mb-3">
                {s.title}
              </h2>
              <p className="text-sm text-text-light leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}

          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground">
              {p.contactText}{" "}
              <a
                href="mailto:legal@okapiimmobilier.cd"
                className="text-primary hover:underline"
              >
                legal@okapiimmobilier.cd
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
