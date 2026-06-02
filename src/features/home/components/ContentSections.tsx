"use client";

import { useT } from "@/i18n/useT";
import { Card, CardContent } from "@/shared/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const SECTION_IMAGES = [
  "https://thumbs.dreamstime.com/b/property-news-information-updates-related-to-real-estate-market-text-concept-background-362539602.jpg",
  "https://thumbs.dreamstime.com/z/brown-surface-house-pen-notepad-inscription-property-news-business-concept-brown-surface-248951635.jpg",
];

export default function ContentSections() {
  const t = useT();

  const sections = [
    {
      image: SECTION_IMAGES[0],
      title: t.home.content.card1Title,
      excerpt: t.home.content.card1Excerpt,
    },
    {
      image: SECTION_IMAGES[1],
      title: t.home.content.card2Title,
      excerpt: t.home.content.card2Excerpt,
    },
  ];

  return (
    <section className="bg-background-alt py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-2">
          {t.home.content.journal}
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t.home.content.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Link href="/blog" key={index}>
              <Card
                key={section.title}
                className="rounded-xl shadow-md overflow-hidden border border-border"
              >
                <div className="w-full h-64 bg-muted">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={100}
                    height={48}
                    className="w-full h-10/9 object-cover"
                  />
                </div>

                <CardContent className="p-6 mt-8">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-[0.15em] mb-2">
                    {section.title}
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {section.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
