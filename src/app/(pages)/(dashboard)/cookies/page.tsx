"use client";

import { useT } from "@/i18n/useT";

export default function CookiesPage() {
  const t = useT();
  const c = t.pages.cookies;

  const types = [
    { name: c.type1Name, desc: c.type1Desc, required: true },
    { name: c.type2Name, desc: c.type2Desc, required: false },
    { name: c.type3Name, desc: c.type3Desc, required: false },
    { name: c.type4Name, desc: c.type4Desc, required: false },
  ];

  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          {c.badge}
        </p>
        <h1 className="text-4xl font-semibold mb-4">{c.heading}</h1>
        <p className="text-white/70 text-sm">{c.lastUpdated}</p>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 mb-10">
            <p className="text-sm text-text-light leading-relaxed">{c.intro1}</p>
            <p className="text-sm text-text-light leading-relaxed">{c.intro2}</p>
          </div>

          <h2 className="text-base font-semibold text-not-dark mb-6">{c.typesHeading}</h2>

          <div className="space-y-4">
            {types.map((type) => (
              <div key={type.name} className="bg-card rounded-xl shadow-md p-6 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-not-dark">{type.name}</h3>
                    {type.required && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {c.required}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-light leading-relaxed">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 mt-10">
            <h2 className="text-base font-semibold text-not-dark mb-3">{c.manageHeading}</h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">{c.managePara}</p>
            <p className="text-xs text-muted-foreground">
              {c.question}{" "}
              <a href="mailto:privacy@okapiimmobilier.cd" className="text-primary hover:underline">
                privacy@okapiimmobilier.cd
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
