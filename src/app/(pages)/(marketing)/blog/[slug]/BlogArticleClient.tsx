"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useT } from "@/i18n/useT";
import type { Article } from "@/lib/blog";

export default function BlogArticleClient({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const t = useT();

  return (
    <div className="bg-background-alt min-h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.detail.blog.backToBlog}
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">{t.detail.blog.breadHome}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">{t.detail.blog.breadBlog}</Link>
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
              {article.readTime} {t.blog.readTime}
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
          <h2 className="text-xl font-bold mb-2">{t.detail.blog.ctaHeading}</h2>
          <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">
            {t.detail.blog.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="gold">
              <Link href="/agents">{t.detail.blog.ctaFindAgent}</Link>
            </Button>
            <Button asChild className="border border-white/30 bg-transparent hover:bg-white/10">
              <Link href="/acheter">{t.detail.blog.ctaViewListings}</Link>
            </Button>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-foreground mb-5">
              {t.detail.blog.relatedHeading}
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
