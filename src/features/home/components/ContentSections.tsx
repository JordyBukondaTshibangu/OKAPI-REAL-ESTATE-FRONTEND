"use client";

import { useT } from "@/i18n/useT";
import { ArrowRight, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function GoldWord({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <span className="text-secondary">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  );
}

export default function ContentSections() {
  const t = useT();

  const articles = [
    {
      image:    "/assets/images/article-1.jpg",
      category: t.home.content.card1Title,
      headline: t.home.content.card1Excerpt,
      author:   t.home.content.card1Author,
      date:     t.home.content.card1Date,
      readTime: t.home.content.card1ReadTime,
      href:     "/blog",
    },
    {
      image:    "/assets/images/article-2.jpg",
      category: t.home.content.card2Title,
      headline: t.home.content.card2Excerpt,
      author:   t.home.content.card2Author,
      date:     t.home.content.card2Date,
      readTime: t.home.content.card2ReadTime,
      href:     "/blog",
    },
  ];

  return (
    <section className="bg-background-alt py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-2">
          {t.home.content.journal}
        </p>
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            <GoldWord text={t.home.content.heading} highlight={t.home.content.headingHighlight} />
          </h2>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:gap-2.5 transition-all duration-200 group"
          >
            {t.home.content.viewAll}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <Link href={article.href} key={i} className="group block">
              <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:border-secondary/35 transition-all duration-200">
                {/* Image */}
                <div className="relative h-52 bg-muted overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.headline}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy/85 backdrop-blur-sm text-[10px] font-semibold text-secondary uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors duration-150 line-clamp-2">
                    {article.headline}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 shrink-0" />
                      {article.author}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary"
          >
            {t.home.content.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
