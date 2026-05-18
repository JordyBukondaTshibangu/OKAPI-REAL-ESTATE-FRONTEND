import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, TrendingUp, Building2, BarChart3, Newspaper } from "lucide-react";
import { commercialArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Actualités commerciales — Okapi Real Estate",
  description:
    "Tendances du marché immobilier commercial à Kinshasa : bureaux, commerces, entrepôts. Analyses et actualités par Okapi Real Estate.",
};

const ICONS = [Building2, TrendingUp, BarChart3, TrendingUp, Newspaper, Building2] as const;
const COLORS = [
  "bg-primary/10 text-primary",
  "bg-secondary/20 text-secondary-foreground",
  "bg-primary/10 text-primary",
  "bg-secondary/20 text-secondary-foreground",
  "bg-primary/10 text-primary",
  "bg-secondary/20 text-secondary-foreground",
] as const;

const stats = [
  { value: "+12%", label: "Hausse des loyers bureaux (2025)" },
  { value: "85%", label: "Taux d'occupation retail moyen" },
  { value: "6–9%", label: "Rendement locatif commercial brut" },
  { value: "340", label: "Surfaces commerciales listées" },
];

export default function ActualitesCommercialesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/commercial" className="hover:text-white transition-colors">Commercial</Link>
            <span>/</span>
            <span className="text-white">Actualités</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            Actualités &amp; Analyses
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Actualités commerciales
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Tendances du marché, analyses de rendement et opportunités d&apos;investissement
            dans l&apos;immobilier commercial à Kinshasa et en RDC.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-14 px-6 bg-background-alt">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {commercialArticles.map((article, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              const color = COLORS[idx % COLORS.length];
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {article.category}
                        </span>
                        <span className="text-xs bg-accent text-primary px-2 py-0.5 rounded-full font-medium">
                          {article.tag}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {article.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{article.date}</span>
                          <span>·</span>
                          <span>Lecture : {article.readTime}</span>
                        </div>
                        <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lire <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">
            Vous cherchez un bien commercial ?
          </h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">
            Bureaux, commerces, entrepôts ou terrains — nos agents spécialisés
            vous accompagnent dans votre projet d&apos;investissement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link href="/commercial">Voir les biens commerciaux</Link>
            </Button>
            <Button asChild size="lg" className="border border-white/30 bg-transparent hover:bg-white/10">
              <Link href="/agents">Contacter un agent</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
