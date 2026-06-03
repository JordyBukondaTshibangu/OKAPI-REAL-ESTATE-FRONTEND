"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import BlogClient from "./BlogClient";
import { featuredArticle, blogPosts } from "@/lib/blog";
import { useT } from "@/i18n/useT";

const categories = [
  "Tous",
  ...Array.from(new Set(blogPosts.map((p) => p.category))),
];

export default function BlogPage() {
  const t = useT();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              {t.pages.blog.breadHome}
            </Link>
            <span>/</span>
            <span className="text-white">{t.pages.blog.breadBlog}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {t.pages.blog.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {t.pages.blog.heading}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            {t.pages.blog.subtitle}
          </p>
        </div>
      </section>

      <BlogClient
        featured={featuredArticle}
        posts={blogPosts}
        categories={categories}
      />

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-white border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t.pages.blog.newsletterHeading}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {t.pages.blog.newsletterSubtitle}
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder={t.pages.blog.newsletterPlaceholder}
              className="flex-1 h-11 px-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="rounded-full px-6">{t.pages.blog.subscribe}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
