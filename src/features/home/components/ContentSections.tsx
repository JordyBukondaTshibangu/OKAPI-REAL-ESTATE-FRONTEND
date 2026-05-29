import { Card, CardContent } from "@/shared/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const sections = [
  {
    image : "/assets/images/article-1.jpg",
    title: "Actualités",
    excerpt:
      "Louer ou acheter à Kinshasa — quelle est la meilleure décision financière selon votre situation ?",
  },
  {
    image : "/assets/images/article-2.jpg",
    title: "Conseils",
    excerpt:
      "Pourquoi les vendeurs bien préparés obtiennent de meilleurs prix sur le marché immobilier de Kinshasa.",
  },
];

export default function ContentSections() {
  return (
    <section className="bg-background-alt py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-2">
          Le journal
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Actualités et conseils
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section,index) => (
            <Link href="/blog" key={index}>
              <Card
                key={section.title}
                className="rounded-xl shadow-md overflow-hidden border border-border"
              >
                <div className="w-full h-128 bg-muted">
                  <Image src={section.image} alt={section.title} width={580} height={8} className="object-cover h-full"/>
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
