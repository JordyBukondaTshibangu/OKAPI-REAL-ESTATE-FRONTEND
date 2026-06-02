"use client";

import { useT } from "@/i18n/useT";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Article } from "@/lib/blog";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function BlogClient({
  featured,
  posts,
  categories,
}: {
  featured: Article;
  posts: Article[];
  categories: string[];
}) {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState(t.blog.allCategories);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered =
    activeCategory === t.blog.allCategories
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when category changes
  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <section className="py-14 px-6 bg-background-alt">
      <div className="max-w-5xl mx-auto">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 h-9 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-foreground/80 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article — only shown on "Tous" */}
        {activeCategory === t.blog.allCategories && (
          <Link
            href={`/blog/${featured.slug}`}
            className="block bg-navy text-white rounded-2xl p-8 mb-8 group hover:ring-2 hover:ring-secondary/50 transition-all"
          >
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
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime} {t.blog.readTime}
                </span>
              </div>
              <span className="text-sm font-semibold text-secondary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                {t.blog.readArticle} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        )}

        {/* Posts grid */}
        {visible.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {t.blog.noArticles}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow group flex flex-col"
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
              </Link>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((v) => v + LOAD_MORE_COUNT)}
            >
              {t.blog.loadMore.replace("{count}", String(filtered.length - visibleCount))}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
