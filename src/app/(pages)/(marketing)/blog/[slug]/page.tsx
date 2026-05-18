import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { getArticleBySlug, getAllArticles } from "@/lib/blog";
import { Button } from "@/shared/components/ui/button";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable — Okapi Real Estate" };
  return {
    title: `${article.title} — Blog Okapi Real Estate`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="bg-background-alt min-h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au blog
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {article.category}
            </span>
            <span className="text-xs bg-accent text-primary px-2 py-0.5 rounded-full font-medium">
              {article.tag}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b border-border py-4">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime} de lecture
            </span>
            <span className="ml-auto text-xs font-medium text-primary bg-accent px-3 py-1 rounded-full">
              Okapi Real Estate
            </span>
          </div>
        </header>

        {/* Article body */}
        <article
          className="prose prose-sm md:prose-base max-w-none
            prose-headings:font-semibold prose-headings:text-foreground
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
            prose-p:text-foreground/85 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA */}
        <div className="mt-14 bg-navy text-white rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Vous avez un projet immobilier ?</h2>
          <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">
            Nos agents Okapi Real Estate sont des experts du marché kinois. Prenez contact pour un accompagnement personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="gold">
              <Link href="/agents">Trouver un agent</Link>
            </Button>
            <Button asChild className="border border-white/30 bg-transparent hover:bg-white/10">
              <Link href="/acheter">Voir les annonces</Link>
            </Button>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-white rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                    {rel.category}
                  </span>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                    {rel.title}
                  </p>
                  <span className="text-xs text-muted-foreground">{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
