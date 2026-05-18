import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import BlogClient from "./BlogClient";
import { featuredArticle, blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Conseils & Actualités immobilières — Okapi Real Estate",
  description:
    "Conseils pratiques, actualités du marché et guides immobiliers pour acheter, vendre et investir à Kinshasa et en RDC.",
};

const categories = [
  "Tous",
  ...Array.from(new Set(blogPosts.map((p) => p.category))),
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
