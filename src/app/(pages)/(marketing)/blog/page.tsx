import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Conseils & Actualités immobilières — Okapi Real Estate",
  description:
    "Conseils pratiques, actualités du marché et guides immobiliers pour acheter, vendre et investir à Kinshasa et en RDC.",
};

const featured = {
  category: "Guide",
  title: "Comment acheter un bien immobilier à Kinshasa en 2025 : guide complet",
  excerpt:
    "De la recherche du bien à la signature du titre foncier, en passant par la négociation et le financement — tout ce que vous devez savoir pour acheter en toute sérénité à Kinshasa.",
  date: "10 mai 2025",
  readTime: "12 min",
  tag: "Indispensable",
};

const posts = [
  {
    category: "Marché",
    title: "Prix de l'immobilier à Kinshasa : état des lieux en 2025",
    excerpt:
      "Analyse des prix par commune, des tendances sur 12 mois et des prévisions pour les 6 prochains mois.",
    date: "8 mai 2025",
    readTime: "7 min",
    tag: "Analyse",
  },
  {
    category: "Investissement",
    title: "5 raisons d'investir dans l'immobilier locatif à Kinshasa",
    excerpt:
      "Rendements attractifs, demande locative soutenue, marché en structuration… Pourquoi Kinshasa est une destination d'investissement à considérer.",
    date: "2 mai 2025",
    readTime: "6 min",
    tag: "Conseils",
  },
  {
    category: "Juridique",
    title: "Titre foncier vs. certificat d'enregistrement : quelle différence ?",
    excerpt:
      "Comprendre les documents légaux de propriété en RDC pour sécuriser votre achat immobilier et éviter les mauvaises surprises.",
    date: "25 avril 2025",
    readTime: "8 min",
    tag: "Juridique",
  },
  {
    category: "Quartiers",
    title: "Ngaliema vs. Gombe : quel quartier choisir pour vivre ?",
    excerpt:
      "Comparatif complet des deux quartiers premium de Kinshasa : ambiance, prix, commodités, sécurité et qualité de vie.",
    date: "18 avril 2025",
    readTime: "5 min",
    tag: "Lifestyle",
  },
  {
    category: "Rénovation",
    title: "Rénover pour revendre : les travaux qui valorisent le plus votre bien",
    excerpt:
      "Cuisine, salle de bain, façade, parking… Quels chantiers génèrent le meilleur retour sur investissement avant une mise en vente.",
    date: "11 avril 2025",
    readTime: "6 min",
    tag: "Conseils",
  },
  {
    category: "Financement",
    title: "Obtenir un crédit immobilier en RDC : les étapes clés",
    excerpt:
      "Tour d'horizon des banques proposant des prêts immobiliers à Kinshasa, conditions d'obtention et conseils pour maximiser vos chances.",
    date: "4 avril 2025",
    readTime: "9 min",
    tag: "Finance",
  },
];

const categories = [
  "Tous",
  "Marché",
  "Conseils",
  "Investissement",
  "Juridique",
  "Quartiers",
  "Rénovation",
  "Financement",
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Blog</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Conseils &amp; Actualités
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Le blog Okapi Real Estate
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Guides pratiques, analyses de marché et conseils d&apos;experts pour vous
            accompagner dans tous vos projets immobiliers à Kinshasa.
          </p>
        </div>
      </section>

      <section className="py-14 px-6 bg-background-alt">
        <div className="max-w-5xl mx-auto">

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 h-9 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground/80 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured article */}
          <div className="bg-navy text-white rounded-2xl p-8 mb-8 group cursor-pointer hover:ring-2 hover:ring-secondary/50 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                {featured.category}
              </span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">
                {featured.tag}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold leading-snug mb-3 group-hover:text-secondary transition-colors">
              {featured.title}
            </h2>
            <p className="text-white/75 text-sm leading-relaxed mb-5 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime} de lecture
                </span>
              </div>
              <span className="text-sm font-semibold text-secondary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Lire l&apos;article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {post.category}
                  </span>
                  <span className="text-xs bg-accent text-primary px-2 py-0.5 rounded-full font-medium">
                    {post.tag}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 flex-1">
                  {post.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </article>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg">
              Voir plus d&apos;articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-white border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Restez informé
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Recevez nos derniers articles et actualités du marché directement dans votre boîte mail.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="votre@email.cd"
              className="flex-1 h-11 px-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="rounded-full px-6">S&apos;abonner</Button>
          </div>
        </div>
      </section>
    </>
  );
}
