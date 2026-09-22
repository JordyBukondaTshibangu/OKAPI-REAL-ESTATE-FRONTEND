import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog immobilier — Conseils & Actualités à Kinshasa",
  description:
    "Retrouvez les derniers articles sur l'immobilier à Kinshasa : guides d'achat, conseils de location, tendances du marché en RDC et astuces pour agents immobiliers.",
  keywords: [
    "blog immobilier Kinshasa",
    "conseils immobiliers RDC",
    "actualité immobilière Congo",
    "guide achat immobilier Kinshasa",
    "marché immobilier Kinshasa",
  ],
  openGraph: {
    title: "Blog immobilier Okapi — Conseils & Actualités à Kinshasa",
    description:
      "Guides d'achat, conseils de location et tendances du marché immobilier à Kinshasa et en RDC.",
    url: "https://okapi-real-estate.com/blog",
  },
  alternates: { canonical: "https://okapi-real-estate.com/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
